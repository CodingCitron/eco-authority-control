import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchGenerateAuthorityControlNumber } from "@/api/authortiy-control-number";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";

import { AuthoritySplitModalBody } from "./authority-split-modal";

vi.mock("@/api/authortiy-control-number", () => ({
  fetchGenerateAuthorityControlNumber: vi.fn(),
}));

vi.mock("@/hooks/use-authority-search", () => ({
  useAuthoritySearchByRecordKeys: vi.fn(),
}));

vi.mock("@/hooks/use-authority-detail", () => ({
  useAuthorityDetail: vi.fn(),
}));

const detailResponse = {
  data: {
    recKey: "source-record",
    acType: "1",
    acControlNo: "KAC000000001",
    record: {
      leader: "00000nz  a2200000n  4500",
      controlFields: [{ tag: "001", value: "KAC000000001" }],
      dataFields: [
        {
          tag: "110",
          ind1: " ",
          ind2: " ",
          subfields: [{ code: "a", value: "분리 대상 단체" }],
        },
      ],
    },
  },
};

function renderSplitModalBody() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthoritySplitModalBody show onHide={vi.fn()} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AuthoritySplitModalBody", () => {
  it("모달을 열었을 때는 분리대상자료를 생성하지 않는다", () => {
    vi.mocked(useAuthoritySearchByRecordKeys).mockReturnValue({
      data: [{ recKey: "source-record" }],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useAuthorityDetail).mockReturnValue({
      data: detailResponse,
      isLoading: false,
      isError: false,
    } as never);

    renderSplitModalBody();

    expect(fetchGenerateAuthorityControlNumber).not.toHaveBeenCalled();
    expect(
      screen.getByText(
        "MARC 분리 실행 버튼을 눌러 분리대상자료를 생성해 주세요.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeDisabled();
  });

  it("MARC 분리 실행을 눌렀을 때 분리대상자료를 생성한다", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthoritySearchByRecordKeys).mockReturnValue({
      data: [{ recKey: "source-record" }],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useAuthorityDetail).mockReturnValue({
      data: detailResponse,
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(fetchGenerateAuthorityControlNumber).mockResolvedValue({
      data: "KAC000000002",
    });

    renderSplitModalBody();
    await user.click(screen.getByRole("button", { name: "MARC 분리 실행" }));

    expect(fetchGenerateAuthorityControlNumber).toHaveBeenCalledTimes(1);
    expect(
      vi.mocked(fetchGenerateAuthorityControlNumber).mock.calls[0]?.[0],
    ).toBe("1");
    await waitFor(() => {
      expect(screen.getByText("분리대상자료 (KAC000000002)")).toBeVisible();
    });
    expect(screen.getByRole("button", { name: "저장" })).toBeEnabled();
  });

  it("생성된 분리대상자료의 008과 MARC 행을 편집한다", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthoritySearchByRecordKeys).mockReturnValue({
      data: [{ recKey: "source-record" }],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useAuthorityDetail).mockReturnValue({
      data: detailResponse,
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(fetchGenerateAuthorityControlNumber).mockResolvedValue({
      data: "KAC000000002",
    });

    renderSplitModalBody();
    await user.click(screen.getByRole("button", { name: "MARC 분리 실행" }));
    await screen.findByText("분리대상자료 (KAC000000002)");

    await user.click(screen.getByRole("button", { name: "고정길이편집" }));
    const fixedFieldHeading = await screen.findByRole("heading", {
      name: "고정길이편집 (008)",
    });
    const fixedFieldForm = fixedFieldHeading.closest("form")!;
    await user.type(
      screen.getByLabelText("입력날짜 (0~5)"),
      "260831",
    );
    await user.click(
      within(fixedFieldForm).getByRole("button", { name: "확인" }),
    );
    expect(await screen.findByLabelText("008 행")).toHaveTextContent(
      "260831",
    );

    await user.click(screen.getByRole("button", { name: "MARC 행 추가" }));
    expect(await screen.findByLabelText("새 MARC 행")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "새 행 삭제" }));
    expect(screen.queryByLabelText("새 MARC 행")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("110 행"));
    const contentInput = screen.getByLabelText("MARC 지시기와 서브필드");
    await user.clear(contentInput);
    await user.type(contentInput, "\\\\$a수정된 단체{Enter}");
    expect(screen.getByLabelText("110 행")).toHaveTextContent("수정된 단체");

    await user.click(screen.getByRole("button", { name: "110 행 삭제" }));
    expect(screen.queryByLabelText("110 행")).not.toBeInTheDocument();
  });
});

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthorityCreate } from "@/api/authority-create";
import { fetchAuthorityUpdate } from "@/api/authority-update";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";

import AuthorityPersonalFormPage from "./authority-personal-form-page";

vi.mock("@/api/authority-create", () => ({
  fetchAuthorityCreate: vi.fn(),
}));
vi.mock("@/api/authority-update", () => ({
  fetchAuthorityUpdate: vi.fn(),
}));
vi.mock("@/hooks/use-authority-detail", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/hooks/use-authority-detail")
  >();

  return {
    ...actual,
    useAuthorityDetail: vi.fn(() => ({ data: undefined })),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.mocked(useAuthorityDetail).mockReturnValue({ data: undefined } as never);
});

describe("AuthorityPersonalFormPage", () => {
  it("고정길이 편집 모달의 라벨에 Leader와 008 위치를 표시한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "고정길이편집" }));

    expect(screen.getByLabelText("상 태 (05)")).toBeVisible();
    expect(screen.getByLabelText("입력수준 (17)")).toBeVisible();
    expect(screen.getByLabelText("입력날짜 (0~5)")).toBeVisible();
    expect(screen.getByLabelText("지리구분 (6)")).toBeVisible();
    expect(screen.getByLabelText("참조평가 (29)")).toBeVisible();
    expect(screen.getByLabelText("목록작성기관 (39)")).toBeVisible();
  });

  it("입력 화면을 초기화하면 왼쪽 폼과 오른쪽 MARC 레코드를 함께 비운다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.type(screen.getByLabelText("채택표목"), "김소월");
    await user.click(screen.getByRole("button", { name: "채택표목 추가" }));

    expect(screen.getByLabelText("채택표목")).toHaveValue("김소월");
    expect(screen.getByLabelText("100 행")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "화면 초기화" }));

    expect(screen.getByLabelText("채택표목")).toHaveValue("");
    expect(screen.queryByLabelText("100 행")).not.toBeInTheDocument();
  });

  it("저장 버튼을 누르면 개인명 등록 API에 MARC 데이터를 전달한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(fetchAuthorityCreate).mockResolvedValue({} as never);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.selectOptions(screen.getByLabelText("전거지역구분"), "1");
    await user.type(screen.getByLabelText("채택표목"), "김소월");
    await user.click(screen.getByRole("button", { name: "채택표목 추가" }));
    await user.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => {
      expect(fetchAuthorityCreate).toHaveBeenCalledWith({
        leaderStatus: "",
        leaderType: "",
        leaderInputLevel: "",
        acRegionCode: "1",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          controlFields: [],
          dataFields: [
            {
              tag: "100",
              ind1: "1",
              ind2: " ",
              subfields: [{ code: "a", value: "김소월" }],
            },
          ],
        },
      });
    });
    expect(fetchAuthorityUpdate).not.toHaveBeenCalled();
  });

  it("백엔드 MARC 검증 오류를 레코드 뷰의 행 추가 영역에 표시한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.mocked(fetchAuthorityCreate).mockRejectedValue({
      isAxiosError: true,
      response: {
        data: {
          error: {
            code: "MARC_VALIDATION_FAILED",
            message: "KORMARC validation failed.",
            details: [
              {
                severity: "error",
                code: "INVALID_CONTROL_FIELD_CODE",
                message: "Field 008 position 9 has an invalid value.",
                path: "controlFields[0].value",
                tag: "008",
                actual: "z",
              },
              {
                severity: "error",
                code: "MISSING_REQUIRED_FIELD",
                message: "Required field 003 is missing.",
                path: "controlFields",
                tag: "003",
              },
            ],
          },
        },
      },
    });

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="create" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await user.click(screen.getByRole("button", { name: "저장" }));

    const errorAlert = await screen.findByRole("alert");
    expect(errorAlert).toHaveTextContent("KORMARC validation failed.");
    expect(errorAlert).toHaveTextContent("MARC_VALIDATION_FAILED");
    expect(errorAlert).toHaveTextContent(
      "Field 008 position 9 has an invalid value.",
    );
    expect(errorAlert).toHaveTextContent("Required field 003 is missing.");
    expect(errorAlert.closest(".marc-editor-card")).not.toBeNull();
    const messageToggle = screen.getByRole("button", {
      name: "메시지 2건",
    });
    expect(messageToggle).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "MARC 행 추가" }),
    ).toBeVisible();

    await user.click(
      screen.getByRole("button", { name: "오류 메시지 닫기" }),
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(messageToggle).toHaveAttribute("aria-expanded", "false");

    await user.click(messageToggle);
    expect(await screen.findByRole("alert")).toBeVisible();
    expect(messageToggle).toHaveAttribute("aria-expanded", "true");

    rerender(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthorityPersonalFormPage mode="edit" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "메시지 없음" }),
    ).toBeDisabled();
  });

  it("수정 버튼을 누르면 recKey와 기존 Leader를 개인명 수정 API에 전달한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const leader = "00000nz  a2200000n  4500";
    vi.mocked(fetchAuthorityUpdate).mockResolvedValue({});
    vi.mocked(useAuthorityDetail).mockReturnValue({
      data: {
        data: {
          recKey: "record-1",
          acType: "0",
          acControlNo: "AUTH0001",
          acRegionCode: "1",
          activityField: "문학",
          hanjaName: "金素月",
          headingName: "김소월",
          birthDeathDate: "1902-1934",
          firstInputDate: "2026-08-25T10:00:00.000Z",
          firstWorker: "creator",
          lastUpdateDate: "2026-08-26T10:00:00.000Z",
          lastWorker: "editor",
          sourceControlNo: "",
          sourceDataFound: "",
          record: {
            leader,
            control_fields: [{ tag: "001", value: "AUTH0001" }],
            data_fields: [
              {
                tag: "100",
                ind1: "1",
                ind2: " ",
                subfields: [{ code: "a", value: "김소월" }],
              },
            ],
          },
        },
      },
    } as never);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/personal/edit?recKey=record-1"]}>
          <AuthorityPersonalFormPage mode="edit" />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const updateButton = await screen.findByRole("button", { name: "수정" });
    await waitFor(() => expect(updateButton).toBeEnabled());
    await user.click(updateButton);

    await waitFor(() => {
      expect(fetchAuthorityUpdate).toHaveBeenCalledWith({
        recKey: "record-1",
        leaderStatus: "n",
        leaderType: "z",
        leaderInputLevel: "n",
        acRegionCode: "1",
        biographyPrivateYn: "N",
        copyrightBlanketAgreeYn: "N",
        record: {
          leader,
          controlFields: [{ tag: "001", value: "AUTH0001" }],
          dataFields: [
            {
              tag: "100",
              ind1: "1",
              ind2: " ",
              subfields: [{ code: "a", value: "김소월" }],
            },
          ],
        },
      });
    });
    expect(fetchAuthorityCreate).not.toHaveBeenCalled();
  });
});

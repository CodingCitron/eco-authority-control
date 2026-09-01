import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthorityIntegrate } from "@/api/authorty-integrate";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";

import { AuthorityMergeModalBody } from "./authority-merge-modal";

vi.mock("@/hooks/use-authority-search", () => ({
  authoritySearchQueryKeys: { all: ["authority-search"] },
  useAuthoritySearchByRecordKeys: vi.fn(),
}));

vi.mock("@/hooks/use-authority-detail", () => ({
  useAuthorityDetail: vi.fn(),
}));

vi.mock("@/api/authorty-integrate", () => ({
  fetchAuthorityIntegrate: vi.fn(),
}));

const masterDetail = {
  recKey: "1001",
  acType: "2",
  acControlNo: "KAB000000001",
  acRegionCode: "10",
  birthDeathDatePrivateYn: "N",
  biographyPrivateYn: "Y",
  headingName: "통합 주자료",
  record: {
    leader: "00000nz  a2200000n  4500",
    controlFields: [
      { tag: "001", value: "KAB000000001" },
      { tag: "008", value: "260831n azaannnnaaan           a aaa      " },
    ],
    dataFields: [
      {
        tag: "110",
        ind1: " ",
        ind2: " ",
        subfields: [{ code: "a", value: "통합 주자료" }],
      },
    ],
  },
};

const targetDetail = {
  recKey: "1002",
  acType: "2",
  acControlNo: "KAB000000002",
  headingName: "통합 대상자료",
  record: {
    leader: "00000nz  a2200000n  4500",
    controlFields: [
      { tag: "001", value: "KAB000000002" },
      { tag: "008", value: "260830n azaannnnaaan           a aaa      " },
    ],
    dataFields: [
      {
        tag: "110",
        ind1: " ",
        ind2: " ",
        subfields: [{ code: "a", value: "통합 대상자료" }],
      },
      {
        tag: "510",
        ind1: " ",
        ind2: " ",
        subfields: [{ code: "a", value: "대상 참조표목" }],
      },
      {
        tag: "670",
        ind1: " ",
        ind2: " ",
        subfields: [{ code: "a", value: "대상 정보원" }],
      },
    ],
  },
};

function mockMergeRecords() {
  vi.mocked(useAuthoritySearchByRecordKeys).mockReturnValue({
    data: [
      {
        recKey: masterDetail.recKey,
        acType: masterDetail.acType,
        acControlNo: masterDetail.acControlNo,
        headingName: masterDetail.headingName,
      },
      {
        recKey: targetDetail.recKey,
        acType: targetDetail.acType,
        acControlNo: targetDetail.acControlNo,
        headingName: targetDetail.headingName,
      },
    ],
    isLoading: false,
    isError: false,
  } as never);
  vi.mocked(useAuthorityDetail).mockImplementation((recordKey) => ({
    data: {
      data: recordKey === masterDetail.recKey ? masterDetail : targetDetail,
    },
    isLoading: false,
    isError: false,
  }) as never);
}

function renderMergeModalBody(
  props: ComponentProps<typeof AuthorityMergeModalBody>,
) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthorityMergeModalBody {...props} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("AuthorityMergeModalBody", () => {
  it("대상자료의 반복 가능한 데이터 필드만 통합주자료에 추가한다", async () => {
    const user = userEvent.setup();
    const onPreview = vi.fn();
    const onMerge = vi.fn();
    const onHide = vi.fn();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(fetchAuthorityIntegrate).mockResolvedValue({
      sourceRecKey: targetDetail.recKey,
      integrated: true,
      target: {
        birthDeathDatePrivateYn: "N",
        biographyPrivateYn: "Y",
        copyrightBlanketAgreeYn: "N",
        copyrightBlanketAgreeDate: "",
        record: masterDetail.record,
      },
    });
    mockMergeRecords();

    renderMergeModalBody({
      show: true,
      onHide,
      onPreview,
      onMerge,
    });

    const masterEditor = screen
      .getByText("통합주자료 MARC")
      .closest(".card") as HTMLElement;
    const masterEditorScope = within(masterEditor);
    expect(masterEditorScope.getByLabelText("110 행")).toHaveTextContent(
      "통합 주자료",
    );
    expect(masterEditorScope.queryByLabelText("510 행")).toBeNull();
    expect(screen.getByRole("button", { name: "통합" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "MARC 통합" }));

    expect(await masterEditorScope.findByLabelText("510 행")).toHaveTextContent(
      "대상 참조표목",
    );
    expect(masterEditorScope.getByLabelText("670 행")).toHaveTextContent(
      "대상 정보원",
    );
    expect(masterEditorScope.getAllByLabelText("110 행")).toHaveLength(1);
    expect(masterEditorScope.getByLabelText("110 행")).not.toHaveTextContent(
      "통합 대상자료",
    );
    expect(masterEditorScope.getAllByLabelText("001 행")).toHaveLength(1);
    expect(masterEditorScope.getByLabelText("001 행")).toHaveTextContent(
      "KAB000000001",
    );
    expect(masterEditorScope.getAllByLabelText("008 행")).toHaveLength(1);
    expect(masterEditorScope.getByLabelText("008 행")).toHaveTextContent(
      "260831",
    );
    expect(screen.getByRole("button", { name: "MARC 통합 완료" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "통합" })).toBeEnabled();

    const previewMaster = onPreview.mock.calls[0]?.[0];
    expect(previewMaster.record.controlFields).toEqual(
      masterDetail.record.controlFields,
    );
    expect(
      previewMaster.record.dataFields.map((field: { tag: string }) => field.tag),
    ).toEqual(["110", "510", "670"]);

    await user.click(screen.getByRole("button", { name: "통합" }));
    await waitFor(() =>
      expect(fetchAuthorityIntegrate).toHaveBeenCalledTimes(1),
    );
    const integrateParams = vi.mocked(fetchAuthorityIntegrate).mock.calls[0]?.[0];
    expect(integrateParams).toEqual(
      expect.objectContaining({
        sourceRecKey: 1002,
        targetRecKey: 1001,
        acRegionCode: "10",
        birthDeathDatePrivateYn: "N",
        biographyPrivateYn: "Y",
      }),
    );
    expect(integrateParams?.record.controlFields).toEqual(
      masterDetail.record.controlFields,
    );
    expect(integrateParams?.record.dataFields.map((field) => field.tag)).toEqual(
      ["110", "510", "670"],
    );
    await waitFor(() => expect(onMerge).toHaveBeenCalledTimes(1));
    expect(
      onMerge.mock.calls[0]?.[0].record.dataFields.map(
        (field: { tag: string }) => field.tag,
      ),
    ).toEqual(["110", "510", "670"]);
    expect(window.alert).toHaveBeenCalledWith("전거자료가 통합되었습니다.");
    expect(onHide).toHaveBeenCalledTimes(1);
  });

  it("통합주자료에서 고정필드와 MARC 행 편집 기능을 제공한다", () => {
    mockMergeRecords();

    renderMergeModalBody({ show: true, onHide: vi.fn() });

    const masterEditor = screen
      .getByText("통합주자료 MARC")
      .closest(".card") as HTMLElement;
    const masterEditorScope = within(masterEditor);
    expect(
      masterEditorScope.getByRole("button", { name: "고정길이편집" }),
    ).toBeEnabled();
    expect(
      masterEditorScope.getByRole("button", { name: "MARC 행 추가" }),
    ).toBeEnabled();
    expect(
      masterEditorScope.getByRole("button", { name: "110 행 삭제" }),
    ).toBeEnabled();
  });
});

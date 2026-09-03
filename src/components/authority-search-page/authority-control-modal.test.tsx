import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchAuthoritySeeAlso } from "@/api/authortiy-see-also";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearch } from "@/hooks/use-authority-search";
import { SearchPageContext } from "./authority-search-page-context";
import { AuthorityControlModalBody } from "./authority-control-modal";

vi.mock("@/api/authortiy-see-also", () => ({
  fetchAuthoritySeeAlso: vi.fn(),
}));

vi.mock("@/hooks/use-authority-detail", () => ({
  useAuthorityDetail: vi.fn(),
}));

vi.mock("@/hooks/use-authority-search", () => ({
  authoritySearchQueryKeys: {
    all: ["authority-search"],
    list: (params: unknown) => ["authority-search", "list", params],
  },
  useCurrentAuthoritySearchParams: () => ({
    params: {
      acType: "4",
      acRegionCode: "0",
      searchKeyword: "부작위",
      searchType: "CONTAINS",
      page: "1",
      display: "20",
    },
    isSearched: true,
  }),
  useAuthoritySearch: vi.fn(),
}));

const controlledSubjectDetail = {
  data: {
    recKey: "controlled-record",
    acType: "4",
    acControlNo: "KAS000000001",
    headingName: "부작위",
    record: {
      leader: "00000nz  a2200000n  4500",
      controlFields: [{ tag: "001", value: "KAS000000001" }],
      dataFields: [
        {
          tag: "150",
          ind1: " ",
          ind2: " ",
          subfields: [{ code: "a", value: "부작위" }],
        },
        {
          tag: "550",
          ind1: " ",
          ind2: " ",
          subfields: [
            { code: "w", value: "g" },
            { code: "a", value: "기존 관련 주제" },
            { code: "0", value: "KAS000000010" },
          ],
        },
      ],
    },
  },
};

const selectedSubjectDetail = {
  data: {
    recKey: "related-record",
    acType: "4",
    acControlNo: "KAS000000002",
    headingName: "작위[作爲]",
    record: {
      leader: "00000nz  a2200000n  4500",
      controlFields: [{ tag: "001", value: "KAS000000002" }],
      dataFields: [
        {
          tag: "150",
          ind1: " ",
          ind2: " ",
          subfields: [{ code: "a", value: "작위[作爲]" }],
        },
      ],
    },
  },
};

const searchResponse = {
  data: {
    page: 1,
    display: 10,
    total: 1,
    totalPages: 1,
    items: [
      {
        recKey: "related-record",
        acType: "4",
        acControlNo: "KAS000000002",
        headingName: "작위[作爲]",
      },
    ],
  },
};

function renderControlModal({
  onHide = vi.fn(),
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}: {
  onHide?: () => void;
  queryClient?: QueryClient;
} = {}) {
  return render(
    <QueryClientProvider client={queryClient}>
      <SearchPageContext.Provider
        value={{
          selectedRecordKeys: ["controlled-record"],
          toggleSelectedRecordKey: vi.fn(),
          toggleAllRecordKeys: vi.fn(),
          pruneSelectedRecordKeys: vi.fn(),
          clearSelectedRecordKeys: vi.fn(),
        }}
      >
        <AuthorityControlModalBody onHide={onHide} />
      </SearchPageContext.Provider>
    </QueryClientProvider>,
  );
}

function mockSubjectQueries() {
  vi.mocked(useAuthoritySearch).mockReturnValue({
    data: searchResponse,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  } as never);
  vi.mocked(useAuthorityDetail).mockImplementation((recordKey) => {
    const data =
      recordKey === "controlled-record"
        ? controlledSubjectDetail
        : recordKey === "related-record"
          ? selectedSubjectDetail
          : undefined;

    return {
      data,
      isLoading: false,
      isFetching: false,
      isError: false,
    } as never;
  });
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AuthorityControlModalBody", () => {
  it.each([
    ["0", "500", "개인명"],
    ["1", "510", "단체명"],
    ["5", "551", "지리명"],
    ["4", "550", "주제명"],
  ] as const)(
    "%s 전거의 기존 %s 필드를 표시한다",
    (acType, referenceTag, authorityTypeLabel) => {
      vi.mocked(useAuthoritySearch).mockReturnValue({
        isFetching: false,
        isError: false,
        refetch: vi.fn(),
      } as never);
      vi.mocked(useAuthorityDetail).mockImplementation((recordKey) => ({
        data:
          recordKey === "controlled-record"
            ? {
                data: {
                  ...controlledSubjectDetail.data,
                  acType,
                  record: {
                    ...controlledSubjectDetail.data.record,
                    dataFields: [
                      {
                        tag: referenceTag,
                        ind1: " ",
                        ind2: " ",
                        subfields: [{ code: "a", value: "기존 참조표목" }],
                      },
                    ],
                  },
                },
              }
            : undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
      }) as never);

      renderControlModal();

      expect(
        screen.getByRole("combobox", { name: "전거유형" }),
      ).toHaveValue(acType);
      expect(
        screen.getByRole("option", { name: authorityTypeLabel }),
      ).toBeInTheDocument();
      const referenceTable = screen.getByRole("table", {
        name: "5XX 필드 목록",
      });
      expect(within(referenceTable).getByText(referenceTag)).toBeInTheDocument();
      expect(
        within(referenceTable).getByText("기존 참조표목"),
      ).toBeInTheDocument();
    },
  );

  it("선택한 전거유형으로 검색한다", async () => {
    const user = userEvent.setup();
    mockSubjectQueries();
    renderControlModal();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "전거유형" }),
      "1",
    );
    await user.type(screen.getByLabelText("검색어"), "단체");
    await user.click(screen.getByRole("button", { name: "찾기" }));

    const lastSearchParams = vi.mocked(useAuthoritySearch).mock.calls.at(-1)?.[0];
    expect(lastSearchParams).toEqual(
      expect.objectContaining({
        acType: "1",
        searchKeyword: "단체",
      }),
    );
  });

  it("전거를 검색하고 상세 채택표목을 임시 5XX 목록에 복사한다", async () => {
    const user = userEvent.setup();
    mockSubjectQueries();
    renderControlModal();

    const referenceTable = screen.getByRole("table", {
      name: "5XX 필드 목록",
    });
    expect(
      within(referenceTable).getByText("기존 관련 주제"),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText("검색어"), "작위");
    await user.click(screen.getByRole("button", { name: "찾기" }));

    const lastSearchParams = vi.mocked(useAuthoritySearch).mock.calls.at(-1)?.[0];
    expect(lastSearchParams).toEqual(
      expect.objectContaining({
        acType: "4",
        searchKeyword: "작위",
        searchType: "CONTAINS",
        page: "1",
      }),
    );

    await user.click(screen.getByLabelText("작위[作爲] 선택"));
    expect(useAuthorityDetail).toHaveBeenCalledWith(
      "related-record",
      expect.objectContaining({ enabled: true }),
    );
    await user.click(screen.getByLabelText(/상위\s*\(g\)/));
    await user.click(screen.getByRole("button", { name: "채택표목 복사" }));

    const copiedFieldCheckbox = within(referenceTable).getByLabelText(
      "550 작위[作爲] 선택",
    );
    const copiedFieldRow = copiedFieldCheckbox.closest("tr");
    expect(copiedFieldRow).toHaveTextContent("550");
    expect(copiedFieldRow).toHaveTextContent("$wg");
    expect(copiedFieldRow).toHaveTextContent("작위[作爲]");
    expect(copiedFieldRow).toHaveTextContent("KAS000000002");
    expect(screen.getByRole("button", { name: "확인" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "삭제" })).toBeDisabled();

    await user.click(copiedFieldCheckbox);
    await user.click(screen.getByRole("button", { name: "삭제" }));

    expect(
      within(referenceTable).queryByText("작위[作爲]"),
    ).not.toBeInTheDocument();
    expect(
      within(referenceTable).getByText("기존 관련 주제"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "삭제" })).toBeDisabled();
  });

  it("선택한 기존 5XX 필드를 모달의 목록에서 제거한다", async () => {
    const user = userEvent.setup();
    mockSubjectQueries();
    renderControlModal();

    const referenceTable = screen.getByRole("table", {
      name: "5XX 필드 목록",
    });
    await user.click(
      within(referenceTable).getByLabelText("550 기존 관련 주제 선택"),
    );
    const deleteButton = screen.getByRole("button", { name: "삭제" });
    expect(deleteButton).toBeEnabled();

    await user.click(deleteButton);

    expect(
      within(referenceTable).queryByText("기존 관련 주제"),
    ).not.toBeInTheDocument();
    expect(
      within(referenceTable).getByText("현재 적용된 550 필드가 없습니다."),
    ).toBeInTheDocument();
    expect(deleteButton).toBeDisabled();
  });

  it("확인하면 새로 복사한 5XX 필드를 전거통제 API로 저장한다", async () => {
    const user = userEvent.setup();
    const onHide = vi.fn();
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(fetchAuthoritySeeAlso).mockResolvedValue({
      data: {
        authority: {},
        addedCount: 1,
        skippedControlNos: [],
      },
    });
    mockSubjectQueries();
    renderControlModal({ onHide, queryClient });

    await user.type(screen.getByLabelText("검색어"), "작위");
    await user.click(screen.getByRole("button", { name: "찾기" }));
    await user.click(screen.getByLabelText("작위[作爲] 선택"));
    await user.click(screen.getByLabelText(/상위\s*\(g\)/));
    await user.click(screen.getByRole("button", { name: "채택표목 복사" }));
    await user.click(screen.getByRole("button", { name: "확인" }));

    await waitFor(() =>
      expect(fetchAuthoritySeeAlso).toHaveBeenCalledWith("controlled-record", {
        seeAlsoFields: [
          {
            tag: "550",
            ind1: " ",
            ind2: " ",
            subfields: [
              { code: "w", value: "g" },
              { code: "a", value: "작위[作爲]" },
              { code: "0", value: "KAS000000002" },
            ],
          },
        ],
      }),
    );
    await waitFor(() => expect(onHide).toHaveBeenCalledTimes(1));
    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: [
        "authority-search",
        "list",
        {
          acType: "4",
          acRegionCode: "0",
          searchKeyword: "부작위",
          searchType: "CONTAINS",
          page: "1",
          display: "20",
        },
      ],
      exact: true,
    });
    expect(alertSpy).toHaveBeenCalledWith("참조표목 1건을 추가했습니다.");

    alertSpy.mockRestore();
  });
});

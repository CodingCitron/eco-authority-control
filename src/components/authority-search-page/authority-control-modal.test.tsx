import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { useAuthoritySearch } from "@/hooks/use-authority-search";
import { SearchPageContext } from "./authority-search-page-context";
import { AuthorityControlModalBody } from "./authority-control-modal";

vi.mock("@/hooks/use-authority-detail", () => ({
  useAuthorityDetail: vi.fn(),
}));

vi.mock("@/hooks/use-authority-search", () => ({
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

function renderControlModal() {
  return render(
    <SearchPageContext.Provider
      value={{
        selectedRecordKeys: ["controlled-record"],
        toggleSelectedRecordKey: vi.fn(),
        toggleAllRecordKeys: vi.fn(),
        clearSelectedRecordKeys: vi.fn(),
      }}
    >
      <AuthorityControlModalBody onHide={vi.fn()} />
    </SearchPageContext.Provider>,
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
    expect(screen.getByRole("button", { name: "확인" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "삭제" })).toBeDisabled();
  });
});

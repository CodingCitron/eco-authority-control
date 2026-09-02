import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useAuthorityHistory } from "@/hooks/use-authority-history";
import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";

import { AuthorityHistoryModalBody } from "./authority-history-modal";

vi.mock("@/hooks/use-authority-history", () => ({
  useAuthorityHistory: vi.fn(),
}));
vi.mock("@/hooks/use-authority-search", () => ({
  useAuthoritySearchByRecordKeys: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function createRecord(heading: string) {
  return {
    leader: "00000nz  a2200000n  4500",
    controlFields: [{ tag: "001", value: "KAS202600001" }],
    dataFields: [
      {
        tag: "150",
        ind1: " ",
        ind2: " ",
        subfields: [{ code: "a", value: heading }],
      },
    ],
  };
}

const historyItems = [
  {
    recKey: "subject-1",
    historyKey: "history-latest",
    operation: "UPDATE",
    updateDate: "2026-09-03T12:00:00.000Z",
    worker: "worker-3",
    record: createRecord("최신 주제명"),
  },
  {
    recKey: "subject-1",
    historyKey: "history-middle",
    operation: "UPDATE",
    updateDate: "2026-09-02T12:00:00.000Z",
    worker: "worker-2",
    record: createRecord("중간 주제명"),
  },
  {
    recKey: "subject-1",
    historyKey: "history-oldest",
    operation: "CREATE",
    updateDate: "2026-09-01T12:00:00.000Z",
    worker: "worker-1",
    record: createRecord("최초 주제명"),
  },
];

describe("AuthorityHistoryModalBody", () => {
  it("선택한 이력을 바로 이전 이력과 비교해 표시한다", async () => {
    const user = userEvent.setup();
    vi.mocked(useAuthoritySearchByRecordKeys).mockReturnValue({
      data: [
        {
          recKey: "subject-1",
          acType: "4",
          acControlNo: "KAS202600001",
          acRegionCode: "1",
          acRegionDesc: "한국",
          headingName: "최신 주제명",
          firstWorker: "worker-1",
          firstInputDate: "2026-09-01T12:00:00.000Z",
          lastWorker: "worker-3",
          lastUpdateDate: "2026-09-03T12:00:00.000Z",
          sourceDataFound: null,
        },
      ],
      isLoading: false,
      isError: false,
    } as never);
    vi.mocked(useAuthorityHistory).mockImplementation((params) =>
      ({
        data:
          params.page === "1"
            ? {
                data: {
                  page: 1,
                  display: 10,
                  total: 3,
                  totalPages: 1,
                  items: historyItems,
                },
              }
            : undefined,
        isLoading: false,
        isError: false,
        isFetching: false,
      }) as never,
    );

    render(<AuthorityHistoryModalBody onHide={vi.fn()} />);

    expect(screen.getByLabelText("150 삭제 행")).toHaveTextContent(
      "중간 주제명",
    );
    expect(screen.getByLabelText("150 추가 행")).toHaveTextContent(
      "최신 주제명",
    );

    await user.click(
      screen.getByRole("radio", { name: "중간 주제명 이력 선택" }),
    );

    expect(screen.getByLabelText("150 삭제 행")).toHaveTextContent(
      "최초 주제명",
    );
    expect(screen.getByLabelText("150 추가 행")).toHaveTextContent(
      "중간 주제명",
    );

    await user.click(
      screen.getByRole("radio", { name: "최초 주제명 이력 선택" }),
    );

    const preview = screen.getByText("LDR").closest(".marc-record-view");
    expect(preview).toHaveTextContent("최초 주제명");
    expect(screen.queryByLabelText("150 삭제 행")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("150 추가 행")).not.toBeInTheDocument();
  });
});

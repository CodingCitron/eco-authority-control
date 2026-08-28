import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchDeleteAuthorityRecords } from "@/api/authority-delete";
import { authoritySearchQueryKeys } from "@/hooks/use-authority-search";
import { SearchPageProvider } from "./authority-search-page-provider";
import { useSearchPage } from "./authority-search-page-context";
import { AuthorityDeleteModalBody } from "./authority-delete-modal";

vi.mock("@/api/authority-delete", () => ({
  fetchDeleteAuthorityRecord: vi.fn(),
  fetchDeleteAuthorityRecords: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function DeleteModalTestFixture({ onHide }: { onHide: () => void }) {
  const { selectedRecordKeys, toggleSelectedRecordKey } = useSearchPage();

  return (
    <>
      <button type="button" onClick={() => toggleSelectedRecordKey("record-1")}>
        첫 번째 선택
      </button>
      <button type="button" onClick={() => toggleSelectedRecordKey("record-2")}>
        두 번째 선택
      </button>
      <output data-testid="selected-count">{selectedRecordKeys.length}</output>
      <AuthorityDeleteModalBody onHide={onHide} />
    </>
  );
}

function renderDeleteModal(queryClient: QueryClient, onHide = vi.fn()) {
  render(
    <QueryClientProvider client={queryClient}>
      <SearchPageProvider>
        <DeleteModalTestFixture onHide={onHide} />
      </SearchPageProvider>
    </QueryClientProvider>,
  );

  return { onHide };
}

async function selectTwoRecords(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "첫 번째 선택" }));
  await user.click(screen.getByRole("button", { name: "두 번째 선택" }));
  expect(screen.getByTestId("selected-count")).toHaveTextContent("2");
}

describe("AuthorityDeleteModalBody", () => {
  it("선택한 전거자료를 일괄 삭제하고 선택 상태와 검색 캐시를 정리한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.mocked(fetchDeleteAuthorityRecords).mockResolvedValue({
      data: {
        items: [
          { recKey: "record-1", deleted: true },
          { recKey: "record-2", deleted: true },
        ],
      },
    });
    const { onHide } = renderDeleteModal(queryClient);
    await selectTwoRecords(user);

    expect(screen.getByText(/선택한 전거자료 2건/)).toBeVisible();
    await user.click(screen.getByRole("button", { name: "일괄 삭제" }));

    await waitFor(() => {
      expect(fetchDeleteAuthorityRecords).toHaveBeenCalledWith([
        "record-1",
        "record-2",
      ]);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: authoritySearchQueryKeys.all,
      });
      expect(alertSpy).toHaveBeenCalledWith("전거자료 2건을 삭제했습니다.");
      expect(onHide).toHaveBeenCalledOnce();
    });
    expect(screen.getByTestId("selected-count")).toHaveTextContent("0");
    alertSpy.mockRestore();
  });

  it("일괄 삭제 요청이 실패하면 오류를 표시하고 모달을 유지한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    vi.mocked(fetchDeleteAuthorityRecords).mockRejectedValue(
      new Error("delete failed"),
    );
    const { onHide } = renderDeleteModal(queryClient);
    await selectTwoRecords(user);

    await user.click(screen.getByRole("button", { name: "일괄 삭제" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "선택한 전거자료를 삭제하지 못했습니다.",
    );
    expect(onHide).not.toHaveBeenCalled();
    expect(screen.getByTestId("selected-count")).toHaveTextContent("2");
  });

  it("일부 자료가 삭제되지 않으면 실패 건수를 표시한다", async () => {
    const user = userEvent.setup();
    const queryClient = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    vi.mocked(fetchDeleteAuthorityRecords).mockResolvedValue({
      data: {
        items: [
          { recKey: "record-1", deleted: true },
          { recKey: "record-2", deleted: false },
        ],
      },
    });
    const { onHide } = renderDeleteModal(queryClient);
    await selectTwoRecords(user);

    await user.click(screen.getByRole("button", { name: "일괄 삭제" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "선택한 전거자료 중 1건이 삭제되지 않았습니다.",
    );
    expect(onHide).not.toHaveBeenCalled();
    expect(screen.getByTestId("selected-count")).toHaveTextContent("2");
  });
});

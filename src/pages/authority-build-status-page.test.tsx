import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useCurrentAuthorityStatistics } from "@/hooks/use-authority-statistics";

import AuthorityBuildStatusPage from "./authority-build-status-page";

vi.mock("@/hooks/use-authority-statistics", () => ({
  useCurrentAuthorityStatistics: vi.fn(),
}));

vi.mock("@/components/ui/print-button", () => ({
  default: () => null,
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/build-status?acType=all"]}>
      <AuthorityBuildStatusPage />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("AuthorityBuildStatusPage", () => {
  it("변경된 통계 응답의 유형별 건수와 전체 건수를 표시한다", () => {
    vi.mocked(useCurrentAuthorityStatistics).mockReturnValue({
      data: {
        data: {
          byType: [
            { acType: "0", acTypeName: "개인명", count: 12345 },
            { acType: "1", acTypeName: "단체명", count: 6789 },
          ],
          total: 19134,
        },
      },
      isLoading: false,
      isError: false,
      isSearched: true,
      refetch: vi.fn(),
    } as never);

    renderPage();

    const table = screen.getByRole("table", { name: "구축현황표" });
    expect(within(table).getByText("개인명")).toBeVisible();
    expect(within(table).getByText("12,345 건")).toBeVisible();
    expect(within(table).getByText("단체명")).toBeVisible();
    expect(within(table).getByText("6,789 건")).toBeVisible();
    expect(within(table).getByText("19,134 건")).toBeVisible();
    expect(within(table).queryByText("25,000 건")).toBeNull();
  });

  it("조회 전에는 조회 안내를 표시한다", () => {
    vi.mocked(useCurrentAuthorityStatistics).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      isSearched: false,
      refetch: vi.fn(),
    } as never);

    renderPage();

    expect(
      screen.getByText("조회 조건을 설정한 후 조회해 주세요."),
    ).toBeVisible();
  });

  it("통계 조회 오류를 테이블에 표시한다", () => {
    vi.mocked(useCurrentAuthorityStatistics).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isSearched: true,
      refetch: vi.fn(),
    } as never);

    renderPage();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "구축현황을 불러오지 못했습니다.",
    );
  });
});

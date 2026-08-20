import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SearchPageProvider } from "@/components/authority-search-page/authority-search-page-provider";
import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

function SelectionHarness() {
  const {
    selectedRecordKeys,
    toggleAllRecordKeys,
    toggleSelectedRecordKey,
  } = useSearchPage();

  return (
    <>
      <output data-testid="selected-control-numbers">
        {selectedRecordKeys.join(",")}
      </output>
      <button
        type="button"
        onClick={() => toggleSelectedRecordKey("other")}
      >
        다른 항목 선택
      </button>
      <button
        type="button"
        onClick={() => toggleAllRecordKeys(["first", "second", "second"])}
      >
        현재 목록 전체 선택
      </button>
    </>
  );
}

describe("SearchPageProvider", () => {
  it("현재 목록을 중복 없이 전체 선택하고 다시 누르면 해당 목록만 해제한다", async () => {
    const user = userEvent.setup();

    render(
      <SearchPageProvider>
        <SelectionHarness />
      </SearchPageProvider>,
    );

    await user.click(screen.getByRole("button", { name: "다른 항목 선택" }));
    await user.click(
      screen.getByRole("button", { name: "현재 목록 전체 선택" }),
    );

    expect(screen.getByTestId("selected-control-numbers")).toHaveTextContent(
      "other,first,second",
    );

    await user.click(
      screen.getByRole("button", { name: "현재 목록 전체 선택" }),
    );

    expect(screen.getByTestId("selected-control-numbers")).toHaveTextContent(
      "other",
    );
  });
});

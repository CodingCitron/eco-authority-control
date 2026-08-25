import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import Table, { type TableColumn } from "./table";

interface TestRow {
  id: string;
  value: string;
}

const columns: TableColumn<TestRow>[] = [
  {
    header: "내용",
    cell: (row) => row.value,
    sortValue: (row) => row.value,
  },
];

afterEach(cleanup);

describe("Table 말줄임", () => {
  it("잘린 문자열에 hover하면 전체 내용을 툴팁으로 표시한다", async () => {
    const user = userEvent.setup();
    const value = "화면 너비보다 긴 전거 검색 결과 내용";
    render(
      <Table
        columns={columns}
        rows={[{ id: "1", value }]}
        getRowKey={(row) => row.id}
        truncateCells
      />,
    );

    const table = screen.getByRole("table");
    const content = screen.getByText(value);
    Object.defineProperties(content, {
      clientWidth: { configurable: true, value: 100 },
      scrollWidth: { configurable: true, value: 200 },
    });

    expect(table).toHaveClass("table-layout-fixed");
    expect(content).toHaveClass("table-cell-ellipsis");

    await user.hover(content);

    expect(await screen.findByRole("tooltip")).toHaveTextContent(value);
  });
});

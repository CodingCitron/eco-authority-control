import { useMemo, useState, type ReactNode } from "react";
import { nextGridSort, sortGridRows, type GridSort } from "@/utils/grid-sort";

export interface TableColumn<T> {
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** API의 선택 필드가 비어 있으면 Table에서 빈 문자열로 정렬한다. */
  sortValue?: (row: T) => string | number | null | undefined;
  className?: string;
}

interface TableProps<T> {
  caption?: string;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  getRowKey: (row: T) => string;
  getRowProps?: (row: T) => Record<string, string | undefined>;
}

export default function Table<T>({
  caption,
  columns,
  rows,
  getRowKey,
  getRowProps,
}: TableProps<T>) {
  const [sort, setSort] = useState<GridSort | null>(null);
  const sortedRows = useMemo(
    () =>
      sortGridRows(
        rows,
        sort,
        (row, column) => columns[column]?.sortValue?.(row) ?? "",
      ),
    [columns, rows, sort],
  );

  return (
    <table className="table table-bordered table-hover text-center align-middle text-nowrap table-sm">
      {caption && <caption className="visually-hidden">{caption}</caption>}
      <thead className="table-light">
        <tr>
          {columns.map((column, index) => {
            const sortable = Boolean(column.sortValue);
            const direction =
              sort?.column === index ? sort.direction : undefined;

            return (
              <th
                key={index}
                scope="col"
                className="sortable-th"
                data-sort-dir={direction}
                aria-sort={
                  direction === "asc"
                    ? "ascending"
                    : direction === "desc"
                      ? "descending"
                      : "none"
                }
                onClick={() =>
                  setSort((current) => nextGridSort(current, index))
                }
              >
                {sortable ? (
                  <>
                    {column.header}
                    <span className="sort-indicator" aria-hidden="true">
                      {direction === "asc"
                        ? "▲"
                        : direction === "desc"
                          ? "▼"
                          : "⇅"}
                    </span>
                  </>
                ) : (
                  column.header
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row) => (
          <tr key={getRowKey(row)} {...getRowProps?.(row)}>
            {columns.map((column, index) => (
              <td key={index} className={column.className}>
                {column.cell(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

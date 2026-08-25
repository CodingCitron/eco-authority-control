import {
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
  /** 셀을 한 줄로 줄여 표시하고, 잘린 문자열은 hover/focus 툴팁으로 보여준다. */
  truncateCells?: boolean;
}

export default function Table<T>({
  caption,
  columns,
  rows,
  getRowKey,
  getRowProps,
  truncateCells = false,
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
    <table
      className={`table table-bordered table-hover text-center align-middle text-nowrap table-sm${
        truncateCells ? " table-layout-fixed" : ""
      }`}
    >
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
            {columns.map((column, index) => {
              const content = column.cell(row);
              const tooltipText =
                typeof content === "string" || typeof content === "number"
                  ? String(content)
                  : undefined;

              return (
                <td key={index} className={column.className}>
                  {truncateCells && tooltipText ? (
                    <OverflowTooltip text={tooltipText}>
                      {content}
                    </OverflowTooltip>
                  ) : (
                    content
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OverflowTooltip({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const tooltipId = useId();
  const contentRef = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 100 }}
      show={show}
      onToggle={(nextShow) => {
        const element = contentRef.current;
        setShow(
          nextShow &&
            Boolean(element && element.scrollWidth > element.clientWidth),
        );
      }}
      overlay={
        <Tooltip id={tooltipId} className="table-cell-tooltip">
          {text}
        </Tooltip>
      }
    >
      <span ref={contentRef} className="table-cell-ellipsis" tabIndex={0}>
        {children}
      </span>
    </OverlayTrigger>
  );
}

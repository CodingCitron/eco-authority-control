export type SortDirection = "asc" | "desc";

export interface GridSort {
  column: number;
  direction: SortDirection;
}

function compareValues(a: string, b: string) {
  const numericA = Number.parseFloat(a.replace(/,/g, ""));
  const numericB = Number.parseFloat(b.replace(/,/g, ""));

  if (
    a !== "" &&
    b !== "" &&
    !Number.isNaN(numericA) &&
    !Number.isNaN(numericB)
  ) {
    return numericA - numericB;
  }

  return a.localeCompare(b, "ko");
}

export function nextGridSort(
  currentSort: GridSort | null,
  column: number,
): GridSort {
  return {
    column,
    direction:
      currentSort?.column === column && currentSort.direction === "asc"
        ? "desc"
        : "asc",
  };
}

export function sortGridRows<T>(
  rows: readonly T[],
  sort: GridSort | null,
  getValue: (row: T, column: number) => string | number,
): T[] {
  if (!sort) return [...rows];

  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const result = compareValues(
        String(getValue(a.row, sort.column)),
        String(getValue(b.row, sort.column)),
      );
      return result === 0
        ? a.index - b.index
        : sort.direction === "asc"
          ? result
          : -result;
    })
    .map(({ row }) => row);
}

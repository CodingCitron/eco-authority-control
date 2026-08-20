import { Pagination } from "react-bootstrap";

export interface AppPaginationProps {
  page: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function AppPagination({
  page,
  totalCount,
  pageSize,
  onPageChange,
}: AppPaginationProps) {
  const totalPages = Math.ceil(totalCount / Math.max(pageSize, 1));

  if (totalPages <= 1) {
    return null;
  }

  const pageGroupStart = Math.floor((page - 1) / 10) * 10 + 1;
  const pageGroupEnd = Math.min(pageGroupStart + 9, totalPages);

  return (
    <Pagination className="mb-0">
      <Pagination.First disabled={page === 1} onClick={() => onPageChange(1)} />
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />

      {Array.from(
        { length: pageGroupEnd - pageGroupStart + 1 },
        (_, index) => {
          const pageNumber = pageGroupStart + index;

          return (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          );
        },
      )}

      <Pagination.Next
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      />
      <Pagination.Last
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    </Pagination>
  );
}

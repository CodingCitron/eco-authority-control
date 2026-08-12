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
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="mb-0">
      <Pagination.First disabled={page === 1} onClick={() => onPageChange(1)} />
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />

      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;

        return (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === page}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        );
      })}

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

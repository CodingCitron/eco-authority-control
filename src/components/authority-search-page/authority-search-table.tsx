import type { AuthoritySearchResult } from "@/api/authority-search";
import { useCurrentAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import Table, { type TableColumn } from "@/components/ui/table";

interface AuthoritySearchTableProps<T extends AuthoritySearchResult> {
  caption: string;
  columns: TableColumn<T>[];
}

export default function AuthoritySearchTable<T extends AuthoritySearchResult>({
  caption,
  columns,
}: AuthoritySearchTableProps<T>) {
  const {
    data = [],
    isLoading,
    isError,
    isSearched,
  } = useCurrentAuthoritySearchQuery();

  if (!isSearched) {
    return <div>찾기 버튼을 클릭하면 전거를 검색할 수 있습니다.</div>;
  }

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>에러 발생</div>;
  }

  if (data.length === 0) {
    return <div>검색된 전거 데이터가 없습니다.</div>;
  }

  return (
    <Table
      caption={caption}
      columns={columns}
      rows={data}
      getRowKey={(row) => row.controlNumber}
    />
  );
}

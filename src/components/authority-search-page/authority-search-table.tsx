import type { AuthoritySearchResult } from "@/api/authority-search";
import { useCurrentAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import Table, { type TableColumn } from "@/components/ui/table";
import type { AuthoritySearchType } from "@/types/authority.types";

interface AuthoritySearchTableProps<T extends AuthoritySearchResult> {
  caption: string;
  columns: TableColumn<T>[];
  tab: AuthoritySearchType;
}

export default function AuthoritySearchTable<T extends AuthoritySearchResult>({
  caption,
  columns,
  tab,
}: AuthoritySearchTableProps<T>) {
  const { data = [], isLoading, isError } = useCurrentAuthoritySearchQuery();

  // tab은 필터에 해당

  // 로딩이나, 에러에 대한 UI가 필요

  console.log(data);

  return (
    <Table
      caption={caption}
      columns={columns}
      rows={data}
      getRowKey={(row) => row.controlNumber}
    />
  );
}

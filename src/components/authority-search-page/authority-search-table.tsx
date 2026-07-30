import type {
  AuthoritySearchParams,
  AuthoritySearchResult,
} from "@/api/authority-search";
import { useAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import Table, { type TableColumn } from "@/components/ui/table";

interface AuthoritySearchTableProps<T extends AuthoritySearchResult> {
  caption: string;
  columns: TableColumn<T>[];
  params: AuthoritySearchParams;
}

export default function AuthoritySearchTable<T extends AuthoritySearchResult>({
  caption,
  columns,
  params,
}: AuthoritySearchTableProps<T>) {
  const { data = [] } = useAuthoritySearchQuery<T>(params);

  return (
    <Table
      caption={caption}
      columns={columns}
      rows={data}
      getRowKey={(row) => row.controlNumber}
    />
  );
}

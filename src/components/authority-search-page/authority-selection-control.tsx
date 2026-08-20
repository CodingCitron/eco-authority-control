import { useEffect, useMemo, useRef } from "react";

import { useCurrentAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

export default function AuthoritySelectionControl() {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { selectedRecordKeys, toggleAllRecordKeys } = useSearchPage();

  const { data } = useCurrentAuthoritySearchQuery();

  const contents = data?.data?.items ?? [];

  const recordKeys = useMemo(
    () => contents.map((record) => record.recKey),
    [contents],
  );
  const selectedCount = recordKeys.filter((recordKey) =>
    selectedRecordKeys.includes(recordKey),
  ).length;
  const isAllSelected =
    recordKeys.length > 0 && selectedCount === recordKeys.length;
  const isIndeterminate = selectedCount > 0 && !isAllSelected;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <span className="text-muted">
      <label htmlFor="checkAll" className="visually-hidden">
        전체 선택
      </label>
      <input
        ref={checkboxRef}
        type="checkbox"
        id="checkAll"
        checked={isAllSelected}
        disabled={recordKeys.length === 0}
        onChange={() => toggleAllRecordKeys(recordKeys)}
      />{" "}
      전체 <strong id="listTotalCount">{recordKeys.length}</strong>건 / 선택{" "}
      <strong className="text-primary" id="listCheckedCount">
        {selectedCount}
      </strong>
      건
    </span>
  );
}

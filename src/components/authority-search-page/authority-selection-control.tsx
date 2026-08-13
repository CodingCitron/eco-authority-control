import { useEffect, useMemo, useRef } from "react";

import { useCurrentAuthoritySearchQuery } from "@/hooks/use-authority-search-query";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

export default function AuthoritySelectionControl() {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const { selectedControlNumbers, toggleAllControlNumbers } = useSearchPage();

  const { data } = useCurrentAuthoritySearchQuery();

  const contents = data?.data?.items ?? [];

  const controlNumbers = useMemo(
    () => contents.map((record) => record.acControlNo),
    [contents],
  );
  const selectedCount = controlNumbers.filter((controlNumber) =>
    selectedControlNumbers.includes(controlNumber),
  ).length;
  const isAllSelected =
    controlNumbers.length > 0 && selectedCount === controlNumbers.length;
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
        disabled={controlNumbers.length === 0}
        onChange={() => toggleAllControlNumbers(controlNumbers)}
      />{" "}
      전체 <strong id="listTotalCount">{controlNumbers.length}</strong>건 / 선택{" "}
      <strong className="text-primary" id="listCheckedCount">
        {selectedCount}
      </strong>
      건
    </span>
  );
}

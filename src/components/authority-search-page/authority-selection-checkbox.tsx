import { useContextSelector } from "use-context-selector";

import { SearchPageContext } from "@/components/authority-search-page/authority-search-page-context";

export default function AuthoritySelectionCheckbox({
  recordKey,
  heading,
  inputId,
}: {
  recordKey: string;
  heading?: string | undefined | null;
  inputId: string;
}) {
  const isSelected = useContextSelector(
    SearchPageContext,
    (context) => context?.selectedRecordKeys.includes(recordKey) ?? false,
  );
  const toggleSelectedRecordKey = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleSelectedRecordKey,
  );

  if (!toggleSelectedRecordKey) {
    throw new Error(
      "AuthoritySelectionCheckbox는 SearchPageProvider 내부에서 사용해야 합니다.",
    );
  }

  return (
    <>
      <label htmlFor={inputId} className="visually-hidden">
        {heading} 선택
      </label>
      <input
        type="checkbox"
        id={inputId}
        checked={isSelected}
        onChange={() => toggleSelectedRecordKey(recordKey)}
      />
    </>
  );
}

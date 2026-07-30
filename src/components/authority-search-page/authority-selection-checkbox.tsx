import { useContextSelector } from "use-context-selector";

import { SearchPageContext } from "@/components/authority-search-page/authority-search-page-provider";

export default function AuthoritySelectionCheckbox({
  controlNumber,
  heading,
  inputId,
}: {
  controlNumber: string;
  heading: string;
  inputId: string;
}) {
  const isSelected = useContextSelector(
    SearchPageContext,
    (context) =>
      context?.selectedControlNumbers.includes(controlNumber) ?? false,
  );
  const toggleSelectedControlNumber = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleSelectedControlNumber,
  );

  if (!toggleSelectedControlNumber) {
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
        onChange={() => toggleSelectedControlNumber(controlNumber)}
      />
    </>
  );
}

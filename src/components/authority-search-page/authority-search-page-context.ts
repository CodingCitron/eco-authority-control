import { createContext, useContextSelector } from "use-context-selector";

export interface SearchPageContextValue {
  selectedControlNumbers: readonly string[]; // 선택된 레코드 제어번호
  toggleSelectedControlNumber: (controlNumber: string) => void;
  toggleAllControlNumbers: (controlNumbers: readonly string[]) => void;
  clearSelectedControlNumbers: () => void;
}

export const SearchPageContext = createContext<SearchPageContextValue | null>(
  null,
);

export function useSearchPage() {
  const selectedControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.selectedControlNumbers,
  );

  const toggleSelectedControlNumber = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleSelectedControlNumber,
  );

  const toggleAllControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleAllControlNumbers,
  );

  const clearSelectedControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.clearSelectedControlNumbers,
  );

  if (
    !selectedControlNumbers ||
    !toggleSelectedControlNumber ||
    !toggleAllControlNumbers ||
    !clearSelectedControlNumbers
  ) {
    throw new Error(
      "useSearchPage는 SearchPageProvider 내부에서 사용해야 합니다.",
    );
  }

  return {
    selectedControlNumbers,
    toggleSelectedControlNumber,
    toggleAllControlNumbers,
    clearSelectedControlNumbers,
  };
}

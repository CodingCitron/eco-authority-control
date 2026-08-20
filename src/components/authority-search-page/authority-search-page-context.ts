import { createContext, useContextSelector } from "use-context-selector";

export interface SearchPageContextValue {
  selectedRecordKeys: readonly string[];
  toggleSelectedRecordKey: (recordKey: string) => void;
  toggleAllRecordKeys: (recordKeys: readonly string[]) => void;
  clearSelectedRecordKeys: () => void;
}

export const SearchPageContext = createContext<SearchPageContextValue | null>(
  null,
);

export function useSearchPage() {
  const selectedRecordKeys = useContextSelector(
    SearchPageContext,
    (context) => context?.selectedRecordKeys,
  );
  const toggleSelectedRecordKey = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleSelectedRecordKey,
  );
  const toggleAllRecordKeys = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleAllRecordKeys,
  );
  const clearSelectedRecordKeys = useContextSelector(
    SearchPageContext,
    (context) => context?.clearSelectedRecordKeys,
  );

  if (
    !selectedRecordKeys ||
    !toggleSelectedRecordKey ||
    !toggleAllRecordKeys ||
    !clearSelectedRecordKeys
  ) {
    throw new Error(
      "useSearchPage는 SearchPageProvider 내부에서 사용해야 합니다.",
    );
  }

  return {
    selectedRecordKeys,
    toggleSelectedRecordKey,
    toggleAllRecordKeys,
    clearSelectedRecordKeys,
  };
}

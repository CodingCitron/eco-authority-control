import type { ReactNode } from "react";
import { createContext, useContextSelector } from "use-context-selector";

import type { AuthoritySearchType } from "@/api/authority-search";

export interface SearchTab {
  id: string;
  authorityType: AuthoritySearchType;
  label: string;
  content: ReactNode;
}

export interface SearchPageContextValue {
  currentTab: SearchTab;
  setCurrentTab: (tab: SearchTab) => void;
  selectedControlNumbers: readonly string[];
  toggleSelectedControlNumber: (controlNumber: string) => void;
  clearSelectedControlNumbers: () => void;
}

export const SearchPageContext = createContext<SearchPageContextValue | null>(
  null,
);

export function useSearchPage() {
  const currentTab = useContextSelector(
    SearchPageContext,
    (context) => context?.currentTab,
  );

  const setCurrentTab = useContextSelector(
    SearchPageContext,
    (context) => context?.setCurrentTab,
  );

  const selectedControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.selectedControlNumbers,
  );

  const toggleSelectedControlNumber = useContextSelector(
    SearchPageContext,
    (context) => context?.toggleSelectedControlNumber,
  );

  const clearSelectedControlNumbers = useContextSelector(
    SearchPageContext,
    (context) => context?.clearSelectedControlNumbers,
  );

  if (
    !currentTab ||
    !setCurrentTab ||
    !selectedControlNumbers ||
    !toggleSelectedControlNumber ||
    !clearSelectedControlNumbers
  ) {
    throw new Error(
      "useSearchPage는 SearchPageProvider 내부에서 사용해야 합니다.",
    );
  }

  return {
    currentTab,
    setCurrentTab,
    selectedControlNumbers,
    toggleSelectedControlNumber,
    clearSelectedControlNumbers,
  };
}

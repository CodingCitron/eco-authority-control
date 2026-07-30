import { useCallback, useState, type ReactNode } from "react";

import {
  SearchPageContext,
  type SearchTab,
} from "@/components/authority-search-page/authority-search-page-context";
import { tabList } from "@/components/authority-search-page/authority-search-page-tabs";

export function SearchPageProvider({ children }: { children: ReactNode }) {
  const [currentTab, setCurrentTab] = useState<SearchTab>(tabList[0]);
  const [selectedControlNumbers, setSelectedControlNumbers] = useState<
    string[]
  >([]);

  const toggleSelectedControlNumber = useCallback((controlNumber: string) => {
    setSelectedControlNumbers((current) =>
      current.includes(controlNumber)
        ? current.filter((value) => value !== controlNumber)
        : [...current, controlNumber],
    );
  }, []);

  const clearSelectedControlNumbers = useCallback(() => {
    setSelectedControlNumbers([]);
  }, []);

  const changeCurrentTab = useCallback(
    (tab: SearchTab) => {
      setCurrentTab(tab);
      clearSelectedControlNumbers();
    },
    [clearSelectedControlNumbers],
  );

  return (
    <SearchPageContext.Provider
      value={{
        currentTab,
        setCurrentTab: changeCurrentTab,
        selectedControlNumbers,
        toggleSelectedControlNumber,
        clearSelectedControlNumbers,
      }}
    >
      {children}
    </SearchPageContext.Provider>
  );
}

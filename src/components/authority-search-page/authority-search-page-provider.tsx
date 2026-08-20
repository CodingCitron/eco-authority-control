import { useCallback, useState, type ReactNode } from "react";

import { SearchPageContext } from "@/components/authority-search-page/authority-search-page-context";

export function SearchPageProvider({ children }: { children: ReactNode }) {
  const [selectedRecordKeys, setSelectedRecordKeys] = useState<string[]>([]);

  const toggleSelectedRecordKey = useCallback((recordKey: string) => {
    setSelectedRecordKeys((current) =>
      current.includes(recordKey)
        ? current.filter((value) => value !== recordKey)
        : [...current, recordKey],
    );
  }, []);

  const toggleAllRecordKeys = useCallback((recordKeys: readonly string[]) => {
    const recordKeySet = new Set(recordKeys);

    if (recordKeySet.size === 0) return;

    setSelectedRecordKeys((current) => {
      const selectedRecordKeySet = new Set(current);
      const isAllSelected = [...recordKeySet].every((recordKey) =>
        selectedRecordKeySet.has(recordKey),
      );

      if (isAllSelected) {
        return current.filter((recordKey) => !recordKeySet.has(recordKey));
      }

      return [...new Set([...current, ...recordKeySet])];
    });
  }, []);

  const clearSelectedRecordKeys = useCallback(() => {
    setSelectedRecordKeys([]);
  }, []);

  return (
    <SearchPageContext.Provider
      value={{
        selectedRecordKeys,
        toggleSelectedRecordKey,
        toggleAllRecordKeys,
        clearSelectedRecordKeys,
      }}
    >
      {children}
    </SearchPageContext.Provider>
  );
}

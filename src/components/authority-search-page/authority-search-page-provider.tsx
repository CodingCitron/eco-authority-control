import { useCallback, useState, type ReactNode } from "react";

import { SearchPageContext } from "@/components/authority-search-page/authority-search-page-context";

export function SearchPageProvider({ children }: { children: ReactNode }) {
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

  const toggleAllControlNumbers = useCallback(
    (controlNumbers: readonly string[]) => {
      const controlNumberSet = new Set(controlNumbers);

      if (controlNumberSet.size === 0) return;

      setSelectedControlNumbers((current) => {
        const selectedControlNumberSet = new Set(current);
        const isAllSelected = [...controlNumberSet].every((controlNumber) =>
          selectedControlNumberSet.has(controlNumber),
        );

        if (isAllSelected) {
          return current.filter(
            (controlNumber) => !controlNumberSet.has(controlNumber),
          );
        }

        return [...new Set([...current, ...controlNumberSet])];
      });
    },
    [],
  );

  const clearSelectedControlNumbers = useCallback(() => {
    setSelectedControlNumbers([]);
  }, []);

  return (
    <SearchPageContext.Provider
      value={{
        selectedControlNumbers,
        toggleSelectedControlNumber,
        toggleAllControlNumbers,
        clearSelectedControlNumbers,
      }}
    >
      {children}
    </SearchPageContext.Provider>
  );
}

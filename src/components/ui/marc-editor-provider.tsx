import { useState, type ReactNode } from "react";
import {
  MarcEditorContext,
  type LeaderData,
  type MarcField,
} from "./marc-editor-context";

export default function MarcEditorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [leaderData, setLeaderData] = useState<LeaderData | undefined>(
    undefined,
  );
  const [variableFields, setVariableFields] = useState<MarcField[] | undefined>(
    undefined,
  );

  const value = {
    leaderData,
    variableFields,
    setLeaderData,
    setVariableFields,
  };

  return (
    <MarcEditorContext.Provider value={value}>
      {children}
    </MarcEditorContext.Provider>
  );
}

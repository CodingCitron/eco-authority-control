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
  const [leaderData, setLeaderData] = useState<LeaderData>({
    status: "",
    type: "",
    encodingLevel: "",
    raw: "",
  });
  const [variableFields, setVariableFields] = useState<MarcField[]>([]);

  const value = {
    leaderData,
    variableFields,
    setLeaderData,
    setVariableFields,
  };

  // setVariableFields 이후, sorting되게 해야 함

  return (
    <MarcEditorContext.Provider value={value}>
      {children}
    </MarcEditorContext.Provider>
  );
}

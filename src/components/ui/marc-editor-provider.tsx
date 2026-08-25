import { useState, type ReactNode } from "react";
import {
  MarcEditorContext,
  type LeaderData,
  type MarcField,
} from "./marc-editor-context";

export default function MarcEditorProvider({
  children,
  initialFields,
}: {
  children: ReactNode;
  /** 상세 조회로 불러온 제어필드와 데이터필드 */
  initialFields?: MarcField[];
}) {
  const [leaderData, setLeaderData] = useState<LeaderData>({
    status: "",
    type: "",
    encodingLevel: "",
    raw: "",
  });
  const [variableFields, setVariableFields] = useState<MarcField[]>(
    initialFields ?? [],
  );

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

import { useState, type ReactNode } from "react";
import {
  MarcEditorContext,
  sortMarcFields,
  type AuthorityCreateMetadata,
  type LeaderData,
  type MarcField,
} from "./marc-editor-context";

export default function MarcEditorProvider({
  children,
  initialFields,
  initialLeader,
  initialAuthorityCreateMetadata,
}: {
  children: ReactNode;
  /** 상세 조회로 불러온 제어필드와 데이터필드 */
  initialFields?: MarcField[];
  /** 상세 조회로 불러온 24자리 Leader */
  initialLeader?: LeaderData;
  /** 전거 생성 API에 MARC 레코드와 함께 전달할 초기 메타데이터 */
  initialAuthorityCreateMetadata?: AuthorityCreateMetadata;
}) {
  const [leaderData, setLeaderData] = useState<LeaderData>(
    initialLeader ?? {
      status: "",
      type: "",
      encodingLevel: "",
      raw: "",
    },
  );
  const [variableFields, setVariableFields] = useState<MarcField[]>(
    sortMarcFields(initialFields ?? []),
  );
  const [authorityCreateMetadata, setAuthorityCreateMetadata] =
    useState<AuthorityCreateMetadata>(initialAuthorityCreateMetadata ?? {});

  const value = {
    leaderData,
    variableFields,
    authorityCreateMetadata,
    setLeaderData,
    setVariableFields,
    setAuthorityCreateMetadata,
  };

  return (
    <MarcEditorContext.Provider value={value}>
      {children}
    </MarcEditorContext.Provider>
  );
}

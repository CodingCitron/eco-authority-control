import { useState, type SetStateAction } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { css } from "styled-system/css";

import {
  fetchAuthorityIntegrate,
  type AuthorityIntegrateRequestQueryParams,
} from "@/api/authorty-integrate";
import { getAuthoritySaveError } from "@/api/authority-save-error";
import { authorityTypeLabels } from "@/types/authority.types";
import type { AuthorityDetailData } from "@/types/authority-detail.types";
import type {
  AuthorityCreateMetadata,
  MarcField,
} from "@/types/marc-editor.types";

import {
  authoritySearchQueryKeys,
  useAuthoritySearchByRecordKeys,
} from "@/hooks/use-authority-search";
import {
  isMarcFieldRepeatable,
  sortMarcFields,
} from "@/lib/marc/marc-field.utils";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import { MarcEditorWorkspace } from "@/components/ui/marc-editor";
import {
  formatLeaderData,
  MarcEditorContext,
  parseLeaderData,
  type LeaderData,
} from "@/components/ui/marc-editor-context";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "@/components/ui/marc-font-size-select";
import BaseModal from "@/components/ui/base-modal";
import OverflowTooltip from "@/components/ui/overflow-tooltip";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import MarcRecordPreview from "../ui/record-preview";
import {
  HanjaToHangulModalButton,
  MarcEditorHanjaToHangulModalButton,
} from "../ui/hanja-to-hangul-modal";

interface AuthorityMergeModalProps {
  show: boolean;
  onHide: () => void;
  onPreview?: (
    master: AuthorityDetailData,
    target: AuthorityDetailData,
  ) => void;
  onMerge?: (master: AuthorityDetailData, target: AuthorityDetailData) => void;
}

const MERGE_TABLE_HEADS = [
  "No",
  "통합 주자료",
  "전거유형",
  "전거제어번호",
  "채택표목",
  "정보원",
];

interface MasterEditorState {
  recordKey: string;
  leaderData: LeaderData;
  variableFields: MarcField[];
  authorityCreateMetadata: AuthorityCreateMetadata;
}

interface IntegrateMutationVariables {
  params: AuthorityIntegrateRequestQueryParams;
  master: AuthorityDetailData;
  target: AuthorityDetailData;
}

function createEditorFields(
  record: AuthorityDetailData["record"],
): MarcField[] {
  return sortMarcFields([
    ...record.controlFields.map((field) => ({
      type: "control" as const,
      tag: field.tag,
      value: field.value,
    })),
    ...record.dataFields.map((field) => ({
      type: "data" as const,
      tag: field.tag,
      indicator1: field.ind1,
      indicator2: field.ind2,
      subfields: field.subfields.map((subfield) => ({ ...subfield })),
    })),
  ]);
}

function createMasterEditorState(
  detail: AuthorityDetailData,
): MasterEditorState {
  return {
    recordKey: detail.recKey,
    leaderData: parseLeaderData(detail.record.leader),
    variableFields: createEditorFields(detail.record),
    authorityCreateMetadata: {
      acRegionCode: detail.acRegionCode ?? undefined,
      birthDeathDatePrivateYn: detail.birthDeathDatePrivateYn ?? undefined,
      biographyPrivateYn: detail.biographyPrivateYn ?? undefined,
    },
  };
}

function createEditedMasterDetail(
  detail: AuthorityDetailData,
  editorState: MasterEditorState,
): AuthorityDetailData {
  const controlFields: AuthorityDetailData["record"]["controlFields"] = [];
  const dataFields: AuthorityDetailData["record"]["dataFields"] = [];

  editorState.variableFields.forEach((field) => {
    if (field.type === "control") {
      controlFields.push({ tag: field.tag, value: field.value });
      return;
    }

    dataFields.push({
      tag: field.tag,
      ind1: field.indicator1,
      ind2: field.indicator2,
      subfields: field.subfields.map((subfield) => ({ ...subfield })),
    });
  });

  return {
    ...detail,
    record: {
      leader: formatLeaderData(editorState.leaderData),
      controlFields,
      dataFields,
    },
  };
}

function createAuthorityIntegrateParams(
  master: AuthorityDetailData,
  target: AuthorityDetailData,
  metadata: AuthorityCreateMetadata,
): AuthorityIntegrateRequestQueryParams {
  const sourceRecKey = parsePositiveRecordKey(target.recKey);
  const targetRecKey = parsePositiveRecordKey(master.recKey);

  if (sourceRecKey === targetRecKey) {
    throw new Error("통합할 원본과 대상 전거 레코드 키가 같습니다.");
  }

  const copyrightBlanketAgreeDate = metadata.copyrightBlanketAgreeDate?.trim();

  return {
    // source는 통합 후 제거되고 target은 통합주자료로 남는다.
    sourceRecKey,
    targetRecKey,
    acRegionCode: metadata.acRegionCode ?? master.acRegionCode ?? undefined,
    birthDeathDatePrivateYn:
      metadata.birthDeathDatePrivateYn ??
      master.birthDeathDatePrivateYn ??
      undefined,
    biographyPrivateYn:
      metadata.biographyPrivateYn ?? master.biographyPrivateYn ?? undefined,
    copyrightBlanketAgreeYn: metadata.copyrightBlanketAgreeYn,
    ...(copyrightBlanketAgreeDate && { copyrightBlanketAgreeDate }),
    record: master.record,
  };
}

function parsePositiveRecordKey(recordKey: string) {
  const parsedRecordKey = Number(recordKey);
  if (!Number.isSafeInteger(parsedRecordKey) || parsedRecordKey <= 0) {
    throw new Error(`올바르지 않은 전거 레코드 키입니다: ${recordKey}`);
  }

  return parsedRecordKey;
}

export function AuthorityMergeButton() {
  const { selectedRecordKeys, clearSelectedRecordKeys } = useSearchPage();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedRecordKeys.length !== 2) {
      alert(
        "전거통합은 2건씩 비교하여 진행합니다. 통합할 전거자료를 정확히 2건 선택해주세요.",
      );
      return;
    }

    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        onClick={handleClick}
      >
        <i className="bi bi-intersect me-1" aria-hidden="true"></i>
        전거통합
      </button>
      <AuthorityMergeModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
        onMerge={() => clearSelectedRecordKeys()}
      />
    </>
  );
}

export default function AuthorityMergeModal({
  show,
  onHide,
  onPreview,
  onMerge,
}: AuthorityMergeModalProps) {
  return (
    <>
      <BaseModal title="전거통합 통합화면" show={show} onHide={onHide}>
        <AuthorityMergeModalBody
          show={show}
          onHide={onHide}
          onPreview={onPreview}
          onMerge={onMerge}
        />
      </BaseModal>
    </>
  );
}

export function AuthorityMergeModalBody({
  show,
  onHide,
  onPreview,
  onMerge,
}: AuthorityMergeModalProps) {
  const queryClient = useQueryClient();

  const [masterRecordKey, setMasterRecordKey] = useState<string>();
  const [masterEditorState, setMasterEditorState] =
    useState<MasterEditorState>();
  const [mergedPairKey, setMergedPairKey] = useState<string>();

  const [masterFontSize, setMasterFontSize] = useState(defaultFontSize);
  const [targetFontSize, setTargetFontSize] = useState(defaultFontSize);

  const { data = [], isError, isLoading } = useAuthoritySearchByRecordKeys();

  const firstRecordKey = data[0]?.recKey;
  const secondRecordKey = data[1]?.recKey;
  const selectedMasterRecordKey = data.some(
    (record) => record.recKey === masterRecordKey,
  )
    ? masterRecordKey
    : firstRecordKey;

  const { data: firstResponse, isError: isFirstError } = useAuthorityDetail(
    firstRecordKey,
    {
      enabled: show && !!firstRecordKey,
    },
  );

  const { data: secondResponse, isError: isSecondError } = useAuthorityDetail(
    secondRecordKey,
    {
      enabled: show && !!secondRecordKey,
    },
  );

  const firstDetail = firstResponse?.data;
  const secondDetail = secondResponse?.data;
  const isFirstMaster =
    selectedMasterRecordKey === undefined ||
    selectedMasterRecordKey === firstRecordKey;
  const master = isFirstMaster ? firstDetail : secondDetail;
  const target = isFirstMaster ? secondDetail : firstDetail;
  const isMasterError =
    master === undefined && (isFirstMaster ? isFirstError : isSecondError);
  const isTargetError =
    target === undefined && (isFirstMaster ? isSecondError : isFirstError);
  const masterControlNo =
    master?.acControlNo ??
    (isFirstMaster ? data[0]?.acControlNo : data[1]?.acControlNo) ??
    "";
  const targetControlNo =
    target?.acControlNo ??
    (isFirstMaster ? data[1]?.acControlNo : data[0]?.acControlNo) ??
    "";
  const isRecordFetchComplete = !isLoading && !isError;
  const canMerge =
    data.length === 2 && master !== undefined && target !== undefined;
  const activeMasterEditorState = master
    ? masterEditorState?.recordKey === master.recKey
      ? masterEditorState
      : createMasterEditorState(master)
    : undefined;
  const currentPairKey =
    master && target ? `${master.recKey}:${target.recKey}` : undefined;
  const hasMarcMerged =
    currentPairKey !== undefined && currentPairKey === mergedPairKey;

  const integrateMutation = useMutation({
    mutationFn: ({ params }: IntegrateMutationVariables) =>
      fetchAuthorityIntegrate(params),
    onSuccess: async (result, variables) => {
      if (!result.data.integrated) {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: authoritySearchQueryKeys.all,
      });

      window.alert("전거자료가 통합되었습니다.");
      onMerge?.(variables.master, variables.target);
      onHide();
    },
  });

  const integrateSaveError = getAuthoritySaveError(integrateMutation.error);

  const updateMasterEditorState = (
    update: (current: MasterEditorState) => MasterEditorState,
  ) => {
    if (!master) {
      return;
    }

    setMasterEditorState((current) => {
      const activeState =
        current?.recordKey === master.recKey
          ? current
          : createMasterEditorState(master);
      return update(activeState);
    });
  };

  const setMasterLeaderData = (leaderData: LeaderData) => {
    updateMasterEditorState((current) => ({ ...current, leaderData }));
  };

  const setMasterVariableFields = (nextFields: SetStateAction<MarcField[]>) => {
    updateMasterEditorState((current) => ({
      ...current,
      variableFields:
        typeof nextFields === "function"
          ? nextFields(current.variableFields)
          : nextFields,
    }));
  };

  const setMasterAuthorityCreateMetadata = (
    nextMetadata: SetStateAction<AuthorityCreateMetadata>,
  ) => {
    updateMasterEditorState((current) => ({
      ...current,
      authorityCreateMetadata:
        typeof nextMetadata === "function"
          ? nextMetadata(current.authorityCreateMetadata)
          : nextMetadata,
    }));
  };

  const selectMasterRecord = (recordKey: string) => {
    if (integrateMutation.isPending) {
      return;
    }

    integrateMutation.reset();
    setMasterRecordKey(recordKey);
    setMasterEditorState(undefined);
    setMergedPairKey(undefined);
  };

  const mergeMarcDataFields = () => {
    if (!master || !target || !activeMasterEditorState || !currentPairKey) {
      return;
    }

    integrateMutation.reset();

    const targetDataFields = target.record.dataFields
      .filter((field) => isMarcFieldRepeatable(field.tag))
      .map((field) => ({
        type: "data" as const,
        tag: field.tag,
        indicator1: field.ind1,
        indicator2: field.ind2,
        subfields: field.subfields.map((subfield) => ({ ...subfield })),
      }));
    const mergedEditorState: MasterEditorState = {
      ...activeMasterEditorState,
      variableFields: sortMarcFields([
        ...activeMasterEditorState.variableFields,
        ...targetDataFields,
      ]),
    };

    setMasterEditorState(mergedEditorState);
    setMergedPairKey(currentPairKey);
    onPreview?.(createEditedMasterDetail(master, mergedEditorState), target);
  };

  const integrateAuthority = () => {
    if (!master || !target || !activeMasterEditorState || !hasMarcMerged) {
      return;
    }

    const editedMaster = createEditedMasterDetail(
      master,
      activeMasterEditorState,
    );
    try {
      const params = createAuthorityIntegrateParams(
        editedMaster,
        target,
        activeMasterEditorState.authorityCreateMetadata,
      );
      integrateMutation.mutate(
        {
          params,
          master: editedMaster,
          target,
        },
        {
          onError(error) {
            console.error(error);
          },
        },
      );
    } catch {
      window.alert("통합할 전거자료의 레코드 키가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <Modal.Header
        closeButton={!integrateMutation.isPending}
        closeVariant="white"
        className="bg-primary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거통합 통합화면
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={css({
          maxHeight: "80vh",
          overflow: "auto",
        })}
      >
        <p className="text-muted small mb-2">
          두 레코드 중 <strong>통합 주자료</strong> 열의 선택 버튼(또는 행
          클릭)으로 주자료로 지정할 레코드를 하나씩 눌러보며 선택하세요. <br />
          선택하지 않은 나머지 한 건은 통합 대상자료가 되어 주자료에 병합된 후
          삭제(flag) 처리됩니다.
        </p>

        {isLoading && (
          <p className="mb-0">선택한 전거자료를 불러오는 중입니다.</p>
        )}

        {!isLoading && isError && (
          <p className="mb-0">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && data.length !== 2 && (
          <p className="mb-0">
            선택한 전거자료 2건 중 {data.length}건만 조회되었습니다. 목록을
            확인한 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && data.length === 2 && (
          <>
            <div className="table-responsive mb-4">
              <Table
                bordered
                size="sm"
                className="text-center align-middle mb-4 table-layout-fixed"
                id="mergeSummaryTable"
              >
                <caption className="visually-hidden">
                  전거 통합 대상 목록
                </caption>
                <thead className="table-light">
                  <tr>
                    {MERGE_TABLE_HEADS.map((header) => (
                      <th scope="col" key={header}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((record) => {
                    const isChecked = selectedMasterRecordKey === record.recKey;
                    const authorityTypeLabel =
                      authorityTypeLabels[record.acType];
                    const headingName = record.headingName ?? "";
                    const sourceDataFound = record.sourceDataFound ?? "";

                    return (
                      <tr
                        key={record.recKey}
                        role="button"
                        onClick={() => selectMasterRecord(record.recKey)}
                      >
                        <td>{record.recKey}</td>
                        <td>
                          <Form.Check
                            type="radio"
                            name="merge-master"
                            aria-label={`${headingName}을 통합 주자료로 선택`}
                            checked={isChecked}
                            onChange={() => selectMasterRecord(record.recKey)}
                          />
                        </td>
                        <td>
                          <OverflowTooltip text={authorityTypeLabel}>
                            {authorityTypeLabel}
                          </OverflowTooltip>
                        </td>
                        <td>
                          <OverflowTooltip text={record.acControlNo}>
                            {record.acControlNo}
                          </OverflowTooltip>
                        </td>
                        <td
                          className={clsx("text-start", {
                            "fw-bold text-primary": isChecked,
                          })}
                        >
                          <OverflowTooltip text={headingName}>
                            {headingName}
                          </OverflowTooltip>
                        </td>
                        <td className="text-center">
                          <OverflowTooltip text={sourceDataFound}>
                            {sourceDataFound}
                          </OverflowTooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div className="row g-3">
              <section className="col-md-6">
                <div className="border p-3 bg-light rounded h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <span className="badge bg-primary">
                      통합주자료({masterControlNo})
                    </span>
                    <div className="d-flex gap-2">
                      <MarcFontSizeSelect
                        aria-label="주자료 글자크기"
                        value={masterFontSize}
                        onChange={setMasterFontSize}
                        className="form-select-sm w-auto"
                      />
                      {master && activeMasterEditorState ? (
                        <MarcEditorContext.Provider
                          value={{
                            leaderData: activeMasterEditorState.leaderData,
                            variableFields:
                              activeMasterEditorState.variableFields,
                            authorityCreateMetadata:
                              activeMasterEditorState.authorityCreateMetadata,
                            setLeaderData: setMasterLeaderData,
                            setVariableFields: setMasterVariableFields,
                            setAuthorityCreateMetadata:
                              setMasterAuthorityCreateMetadata,
                          }}
                        >
                          <MarcEditorHanjaToHangulModalButton />
                        </MarcEditorContext.Provider>
                      ) : (
                        <HanjaToHangulModalButton record={master?.record} />
                      )}
                    </div>
                  </div>
                  {isMasterError ? (
                    <p className="mb-0">
                      통합 주자료의 상세 정보를 불러오지 못했습니다. 잠시 후
                      다시 시도해주세요.
                    </p>
                  ) : master && activeMasterEditorState ? (
                    <MarcEditorContext.Provider
                      value={{
                        leaderData: activeMasterEditorState.leaderData,
                        variableFields: activeMasterEditorState.variableFields,
                        authorityCreateMetadata:
                          activeMasterEditorState.authorityCreateMetadata,
                        setLeaderData: setMasterLeaderData,
                        setVariableFields: setMasterVariableFields,
                        setAuthorityCreateMetadata:
                          setMasterAuthorityCreateMetadata,
                      }}
                    >
                      <div className="card shadow-sm">
                        <MarcEditorWorkspace
                          title="통합주자료 MARC"
                          fontSize={`${masterFontSize}px`}
                          saveError={integrateSaveError}
                          saveErrorKey={integrateMutation.submittedAt}
                        />
                      </div>
                    </MarcEditorContext.Provider>
                  ) : (
                    <MarcRecordPreview
                      fontSize={`${masterFontSize}px`}
                      message="통합 주자료를 불러오는 중입니다."
                      className="bg-white"
                    />
                  )}
                </div>
              </section>
              <section className="col-md-6">
                <div className="border p-3 bg-white rounded h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <span className="badge bg-secondary">
                      통합대상자료({targetControlNo})
                    </span>
                    <div className="d-flex gap-2">
                      <MarcFontSizeSelect
                        aria-label="주자료 글자크기"
                        value={targetFontSize}
                        onChange={setTargetFontSize}
                        className="form-select-sm w-auto"
                      />
                      <HanjaToHangulModalButton record={target?.record} />
                    </div>
                  </div>
                  {isTargetError ? (
                    <p className="mb-0">
                      통합 대상자료의 상세 정보를 불러오지 못했습니다. 잠시 후
                      다시 시도해주세요.
                    </p>
                  ) : (
                    <MarcRecordPreview
                      detail={target}
                      fontSize={`${targetFontSize}px`}
                      className="bg-light"
                    />
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="col justify-content-start">
          {integrateMutation.data?.data.integrated === false && (
            <span className="small text-danger" role="alert">
              전거자료를 통합하지 못했습니다. 다시 시도해주세요.
            </span>
          )}

          {integrateMutation.isError && !integrateSaveError && (
            <span className="small text-danger" role="alert">
              전거자료 통합 중 오류가 발생했습니다.
            </span>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button
            className="px-4 fw-bold"
            variant="outline-primary"
            disabled={!canMerge || hasMarcMerged || integrateMutation.isPending}
            onClick={mergeMarcDataFields}
          >
            {hasMarcMerged ? "MARC 통합 완료" : "MARC 통합"}
          </Button>
          <Button
            className="px-4 fw-bold"
            variant="primary"
            disabled={
              !canMerge || !hasMarcMerged || integrateMutation.isPending
            }
            onClick={integrateAuthority}
          >
            {integrateMutation.isPending ? "통합 중..." : "통합"}
          </Button>
          <Button
            className="px-4 fw-bold"
            variant="secondary"
            disabled={integrateMutation.isPending}
            onClick={onHide}
          >
            닫기
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}

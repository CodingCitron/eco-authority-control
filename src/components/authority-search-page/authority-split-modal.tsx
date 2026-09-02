import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";

import { fetchGenerateAuthorityControlNumber } from "@/api/authortiy-control-number";
import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import { sortMarcFields } from "@/lib/marc/marc-field.utils";
import type { AuthorityDetailData } from "@/types/authority-detail.types";
import { isValidAcType } from "@/types/authority.types";
import type {
  AuthorityCreateMetadata,
  MarcField,
} from "@/types/marc-editor.types";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import BaseModal from "@/components/ui/base-modal";
import {
  MarcEditorContext,
  parseLeaderData,
  type LeaderData,
} from "@/components/ui/marc-editor-context";
import { MarcEditorWorkspace } from "@/components/ui/marc-editor";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "@/components/ui/marc-font-size-select";
import MarcRecordPreview from "@/components/ui/record-preview";
import {
  HanjaToHangulModalButton,
  MarcEditorHanjaToHangulModalButton,
} from "../ui/hanja-to-hangul-modal";

const emptyLeaderData: LeaderData = {
  status: "",
  type: "",
  encodingLevel: "",
  raw: "",
};

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
      subfields: field.subfields,
    })),
  ]);
}

export function AuthoritySplitButton() {
  const { selectedRecordKeys } = useSearchPage();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedRecordKeys.length !== 1) {
      alert(
        "전거분리는 1건씩 진행합니다. 분리할 전거자료를 정확히 1건 선택해주세요.",
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
        전거분리
      </button>
      <AuthoritySplitModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthoritySplitModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthoritySplitModalBody show={show} onHide={onHide} />
    </BaseModal>
  );
}

export function AuthoritySplitModalBody({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  const [masterFontSize, setMasterFontSize] = useState(defaultFontSize);
  const [targetFontSize, setTargetFontSize] = useState(defaultFontSize);
  const [targetLeaderData, setTargetLeaderData] =
    useState<LeaderData>(emptyLeaderData);
  const [targetVariableFields, setTargetVariableFields] = useState<MarcField[]>(
    [],
  );
  const [targetAuthorityCreateMetadata, setTargetAuthorityCreateMetadata] =
    useState<AuthorityCreateMetadata>({});

  // 분리 데이터
  const [targetRecord, setTargetRecord] = useState<{
    data: AuthorityDetailData;
  } | null>(null);

  const { data = [], isError, isLoading } = useAuthoritySearchByRecordKeys();

  const recKey = data[0]?.recKey;

  const {
    data: detailData,
    isLoading: isDetailDataLoading,
    isError: isDetailDataError,
  } = useAuthorityDetail(recKey, {
    enabled: show && !!recKey,
  });

  const isRecordFetchComplete = !isLoading && !isError;

  // 전거 제어 번호 가져오기
  const {
    mutate: generateControlNumber,
    isPending: isSplitPending,
    isError: isSplitError,
  } = useMutation({
    mutationFn: fetchGenerateAuthorityControlNumber,
    onSuccess: (data) => {
      if (!detailData) {
        return;
      }

      const sourceDetail = detailData.data;
      const targetControlFields = sourceDetail.record.controlFields.map(
        (controlField) =>
          controlField.tag === "001"
            ? { ...controlField, value: data.data }
            : controlField,
      );
      const targetDetail: AuthorityDetailData = {
        ...sourceDetail,
        acControlNo: data.data,
        recKey: "",
        record: {
          ...sourceDetail.record,
          controlFields: targetControlFields,
          dataFields: [...sourceDetail.record.dataFields],
        },
      };

      setTargetRecord({
        data: targetDetail,
      });
      setTargetLeaderData(parseLeaderData(targetDetail.record.leader));
      setTargetVariableFields(createEditorFields(targetDetail.record));
      setTargetAuthorityCreateMetadata({});
    },
  });

  const handleSplit = () => {
    const acType = detailData?.data.acType;
    if (!acType || !isValidAcType(acType)) {
      return;
    }

    generateControlNumber(acType);
  };

  const targetRecordMessage = isSplitPending
    ? "분리대상자료를 생성하는 중입니다."
    : isSplitError
      ? "분리대상자료를 생성하지 못했습니다. 다시 실행해 주세요."
      : "MARC 분리 실행 버튼을 눌러 분리대상자료를 생성해 주세요.";

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-primary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거분리 - 분리화면
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <p className="mb-0">선택한 전거자료를 불러오는 중입니다.</p>
        )}

        {!isLoading && isError && (
          <p className="mb-0">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && isDetailDataLoading && (
          <p className="mb-0">선택한 전거의 상세 정보를 불러오는 중입니다.</p>
        )}

        {isRecordFetchComplete && !isDetailDataLoading && isDetailDataError && (
          <p className="mb-0">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && detailData && (
          <div className="row g-3">
            <section className="col-md-6">
              <div className="border p-3 bg-light rounded h-100">
                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <span className="badge bg-primary">
                    통합원본자료({detailData.data.acControlNo})
                  </span>
                  <div className="d-flex gap-2">
                    <MarcFontSizeSelect
                      aria-label="주자료 글자크기"
                      value={masterFontSize}
                      onChange={setMasterFontSize}
                      className="form-select-sm w-auto"
                    />
                    <HanjaToHangulModalButton record={detailData.data.record} />
                  </div>
                </div>
                <MarcRecordPreview
                  detail={detailData.data}
                  fontSize={`${masterFontSize}px`}
                  className="bg-white"
                />
              </div>
            </section>
            <section className="col-md-6">
              <div className="border p-3 bg-white rounded h-100">
                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <span className="badge bg-secondary">
                    {targetRecord
                      ? `분리대상자료 (${targetRecord.data.acControlNo})`
                      : "분리대상자료"}
                  </span>
                  <div className="d-flex gap-2">
                    <MarcFontSizeSelect
                      aria-label="대상자료 글자크기"
                      value={targetFontSize}
                      onChange={setTargetFontSize}
                      className="form-select-sm w-auto"
                    />
                    {targetRecord && (
                      <MarcEditorContext.Provider
                        value={{
                          leaderData: targetLeaderData,
                          variableFields: targetVariableFields,
                          authorityCreateMetadata:
                            targetAuthorityCreateMetadata,
                          setLeaderData: setTargetLeaderData,
                          setVariableFields: setTargetVariableFields,
                          setAuthorityCreateMetadata:
                            setTargetAuthorityCreateMetadata,
                        }}
                      >
                        <MarcEditorHanjaToHangulModalButton />
                      </MarcEditorContext.Provider>
                    )}
                  </div>
                </div>
                {targetRecord ? (
                  <MarcEditorContext.Provider
                    value={{
                      leaderData: targetLeaderData,
                      variableFields: targetVariableFields,
                      authorityCreateMetadata: targetAuthorityCreateMetadata,
                      setLeaderData: setTargetLeaderData,
                      setVariableFields: setTargetVariableFields,
                      setAuthorityCreateMetadata:
                        setTargetAuthorityCreateMetadata,
                    }}
                  >
                    <div className="card shadow-sm">
                      <MarcEditorWorkspace
                        title="분리대상자료 MARC"
                        fontSize={`${targetFontSize}px`}
                      />
                    </div>
                  </MarcEditorContext.Provider>
                ) : (
                  <MarcRecordPreview
                    fontSize={`${targetFontSize}px`}
                    message={targetRecordMessage}
                    className="bg-light"
                  />
                )}
              </div>
            </section>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          className="px-4 fw-bold"
          variant="primary"
          disabled={!detailData || isSplitPending}
          onClick={handleSplit}
        >
          {isSplitPending ? "MARC 분리 중" : "MARC 분리 실행"}
        </Button>
        <Button
          className="px-4 fw-bold"
          variant="secondary"
          disabled={!targetRecord || isSplitPending}
        >
          저장
        </Button>
        <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </>
  );
}

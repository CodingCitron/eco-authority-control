import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import clsx from "clsx";

import { authorityTypeLabels } from "@/types/authority-search.types";
import type { AuthorityDetailData } from "@/types/authority-detail.types";

import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import MarcFontSizeSelect, {
  fontSizeList,
} from "@/components/ui/marc-font-size-select";
import BaseModal from "@/components/ui/base-modal";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";

interface AuthorityMergeModalProps {
  show: boolean;
  onHide: () => void;
  onPreview?: (
    master: AuthorityDetailData,
    target: AuthorityDetailData,
  ) => void;
  onMerge?: (
    master: AuthorityDetailData,
    target: AuthorityDetailData,
  ) => void;
}

const MERGE_TABLE_HEADS = [
  "No",
  "통합 주자료",
  "전거유형",
  "전거제어번호",
  "채택표목",
  "정보원",
];

export function AuthorityMergeButton() {
  const { selectedRecordKeys } = useSearchPage();

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

function AuthorityMergeModalBody({
  show,
  onHide,
  onPreview,
  onMerge,
}: AuthorityMergeModalProps) {
  const [masterRecordKey, setMasterRecordKey] = useState<string>();
  const [targetRecordKey, setTargetRecordKey] = useState<string>();

  const [masterFontSize, setMasterFontSize] = useState(fontSizeList[0]);
  const [targetFontSize, setTargetFontSize] = useState(fontSizeList[0]);

  const { data = [], isError, isLoading } = useAuthoritySearchByRecordKeys();

  useEffect(() => {
    if (show) {
      setMasterRecordKey(data[0]?.recKey);
      setTargetRecordKey(data[1]?.recKey);
    }
  }, [data, show]);

  const {
    data: masterResponse,
    isLoading: isMasterLoading,
    isError: isMasterError,
  } = useAuthorityDetail(
    masterRecordKey,
    {
      enabled: !!masterRecordKey,
    },
  );

  const {
    data: targetResponse,
    isLoading: isTargetLoading,
    isError: isTargetError,
  } = useAuthorityDetail(
    targetRecordKey,
    {
      enabled: !!targetRecordKey,
    },
  );

  const master = masterResponse?.data;
  const target = targetResponse?.data;
  const isDetailLoading = isMasterLoading || isTargetLoading;
  const isDetailError = isMasterError || isTargetError;
  const isRecordFetchComplete = !isLoading && !isError;
  const canMerge =
    data.length === 2 &&
    master !== undefined &&
    target !== undefined;

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-primary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거통합 통합화면
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          <p className="alert alert-danger mb-0" role="alert">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && data.length !== 2 && (
          <p className="alert alert-warning mb-0" role="alert">
            선택한 전거자료 2건 중 {data.length}건만 조회되었습니다. 목록을
            확인한 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && isDetailLoading && (
          <p className="alert alert-info mb-0" role="status">
            선택한 전거의 상세 정보를 불러오는 중입니다.
          </p>
        )}

        {isRecordFetchComplete && !isDetailLoading && isDetailError && (
          <p className="alert alert-danger mb-0" role="alert">
            선택한 전거의 상세 정보를 불러오지 못했습니다.
          </p>
        )}

        {isRecordFetchComplete && data.length === 2 && (
          <>
            <div className="table-responsive mb-4">
              <Table
                bordered
                size="sm"
                className="text-center align-middle mb-4"
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
                  {data.map((record, index) => {
                    const isChecked = masterRecordKey === record.recKey;

                    return (
                      <tr key={record.recKey}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Check
                            type="radio"
                            name="merge-master"
                            aria-label={`${record.headingName}을 통합 주자료로 선택`}
                            checked={isChecked}
                            onChange={() => setMasterRecordKey(record.recKey)}
                          />
                        </td>
                        <td>{authorityTypeLabels[record.acType]}</td>
                        <td>{record.acControlNo}</td>
                        <td
                          className={clsx("text-start", {
                            "fw-bold text-primary": isChecked,
                          })}
                        >
                          {record.headingName}
                        </td>
                        <td className="text-center">
                          {record.sourceDataFound}
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
                      통합주자료({master ? master.acControlNo : ""})
                    </span>
                    <div className="d-flex gap-2">
                      <MarcFontSizeSelect
                        aria-label="주자료 글자크기"
                        value={masterFontSize}
                        onChange={setMasterFontSize}
                        className="form-select-sm w-auto"
                      />
                      <button
                        className="btn btn-sm btn-outline-dark"
                        type="button"
                      >
                        한자 -&gt; 한글
                      </button>
                    </div>
                  </div>
                  <MarcRecordPreview
                    detail={master}
                    fontSize={`${masterFontSize}px`}
                    className="bg-white"
                  />
                </div>
              </section>
              <section className="col-md-6">
                <div className="border p-3 bg-white rounded h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <span className="badge bg-secondary">
                      통합대상자료({target ? target.acControlNo : ""})
                    </span>
                    <div className="d-flex gap-2">
                      <MarcFontSizeSelect
                        aria-label="주자료 글자크기"
                        value={targetFontSize}
                        onChange={setTargetFontSize}
                        className="form-select-sm w-auto"
                      />
                      <button
                        className="btn btn-sm btn-outline-dark"
                        type="button"
                      >
                        한자 -&gt; 한글
                      </button>
                    </div>
                  </div>
                  <MarcRecordPreview
                    detail={target}
                    fontSize={`${targetFontSize}px`}
                    className="bg-light"
                  />
                </div>
              </section>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="px-4 fw-bold"
          variant="outline-primary"
          disabled={!canMerge}
          onClick={() => {
            if (master && target) {
              onPreview?.(master, target);
            }
          }}
        >
          MARC 통합
        </Button>
        <Button
          className="px-4 fw-bold"
          variant="primary"
          disabled={!canMerge}
          onClick={() => {
            if (master && target) {
              onMerge?.(master, target);
            }
          }}
        >
          통합
        </Button>
        <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </>
  );
}

function MarcRecordPreview({
  detail,
  fontSize,
  className,
}: {
  detail?: AuthorityDetailData;
  fontSize: string;
  className?: string;
}) {
  if (!detail) {
    return (
      <div className={clsx("marc-record-view border rounded p-2", className)}>
        상세 정보를 불러오는 중입니다.
      </div>
    );
  }

  const { record } = detail;

  return (
    <div
      className={clsx(
        "marc-record-view font-monospace border rounded p-2",
        className,
      )}
      style={{ fontSize }}
    >
      <div className="marc-line">
        <span className="marc-tag">LDR</span>
        {record.leader}
      </div>
      {record.control_fields.map((field) => (
        <div className="marc-line" key={`${field.tag}-${field.value}`}>
          <span className="marc-tag">{field.tag}</span>
          {field.value}
        </div>
      ))}
      {record.data_fields.map((field, index) => (
        <div className="marc-line" key={`${field.tag}-${index}`}>
          <span className="marc-tag">{field.tag}</span>
          {field.ind1}
          {field.ind2}
          {field.subfields.map((subfield) => (
            <span key={`${subfield.code}-${subfield.value}`}>
              <span className="ms-1">${subfield.code}</span> {subfield.value}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

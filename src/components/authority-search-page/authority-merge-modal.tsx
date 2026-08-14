import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import clsx from "clsx";

import { authorityTypeLabels } from "@/types/authority-search.types";

import { useAuthoritySearchByControlNumbersQuery } from "@/hooks/use-authority-search-query";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import MarcFontSizeSelect, {
  fontSizeList,
} from "@/components/ui/marc-font-size-select";
import BaseModal from "@/components/ui/base-modal";
import type { AuthorityRecord } from "@/components/ui/record-preview";
import RecordPreview from "@/components/ui/record-preview";

interface AuthorityMergeModalProps {
  show: boolean;
  onHide: () => void;
  onPreview?: (master: AuthorityRecord, target: AuthorityRecord) => void;
  onMerge?: (master: AuthorityRecord, target: AuthorityRecord) => void;
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
  const { selectedControlNumbers } = useSearchPage();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedControlNumbers.length !== 2) {
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
  const [masterControlNumber, setMasterControlNumber] = useState<string>();

  const [masterFontSize, setMasterFontSize] = useState(fontSizeList[0]);
  const [targetFontSize, setTargetFontSize] = useState(fontSizeList[0]);

  const {
    data = [],
    isError,
    isLoading,
  } = useAuthoritySearchByControlNumbersQuery();

  useEffect(() => {
    if (show) setMasterControlNumber(data[0]?.acControlNo);
  }, [data, show]);

  const master = data.find(
    (record) => record.acControlNo === masterControlNumber,
  );
  const target = data.find(
    (record) => record.acControlNo !== masterControlNumber,
  );

  const isRecordFetchComplete = !isLoading && !isError;
  const canMerge = data.length === 2 && master && target;

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
                    const isChecked =
                      masterControlNumber === record.acControlNo;

                    return (
                      <tr key={record.acControlNo}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Check
                            type="radio"
                            name="merge-master"
                            aria-label={`${record.headingName}을 통합 주자료로 선택`}
                            checked={isChecked}
                            onChange={() =>
                              setMasterControlNumber(record.acControlNo)
                            }
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
                  {master && (
                    <RecordPreview
                      record={master}
                      fontSize={`${masterFontSize}px`}
                      className="bg-white"
                    />
                  )}
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
                  {target && (
                    <RecordPreview
                      record={target}
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
        <Button
          className="px-4 fw-bold"
          variant="outline-primary"
          disabled={!canMerge}
          onClick={() => canMerge && onPreview?.(master, target)}
        >
          MARC 통합
        </Button>
        <Button
          className="px-4 fw-bold"
          variant="primary"
          disabled={!canMerge}
          onClick={() => canMerge && onMerge?.(master, target)}
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

import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import clsx from "clsx";
import { css } from "styled-system/css";

import type { AuthoritySearchResult } from "@/api/authority-search";
import { useAuthoritySearchByControlNumbersQuery } from "@/hooks/use-authority-search-query";

import { useSearchPage } from "@/components/search-page/search-page-provider";

export interface MergeAuthorityRecord {
  controlNumber: string;
  type: string;
  heading: string;
  source?: string;
  marcPreview?: string;
}

interface AuthorityMergeModalProps {
  show: boolean;
  onHide: () => void;
  onPreview?: (
    master: MergeAuthorityRecord,
    target: MergeAuthorityRecord,
  ) => void;
  onMerge?: (
    master: MergeAuthorityRecord,
    target: MergeAuthorityRecord,
  ) => void;
}

const fontSizeList = ["16", "18", "20", "22", "24"];

function RecordPreview({
  record,
  fontSize,
}: {
  record: MergeAuthorityRecord;
  fontSize: string;
}) {
  console.log(record);
  console.log(record.marcPreview);
  const marcLines = [
    {
      tag: "001",
      line: record.controlNumber,
    },
    {
      tag: "150",
      line: record.heading,
    },
    {
      tag: "670",
      line: record.source,
    },
  ];

  return (
    <div
      className={clsx(
        "marc-record-view font-monospace bg-white border rounded p-2",
        css({
          minHeight: "280px",
        }),
      )}
      style={{ fontSize }}
    >
      {marcLines.map((item) => (
        <div className="marc-line marc-line-control">
          <span className="marc-tag">{item.tag}</span>
          {item.line}
        </div>
      ))}
    </div>
  );
}

export default function AuthorityMergeModal({
  show,
  onHide,
  onPreview,
  onMerge,
}: AuthorityMergeModalProps) {
  const { currentTab, selectedControlNumbers } = useSearchPage();
  const [masterControlNumber, setMasterControlNumber] = useState<string>();

  const [masterFontSize, setMasterFontSize] = useState(fontSizeList[1]);
  const [targetFontSize, setTargetFontSize] = useState(fontSizeList[1]);

  const { data = [], isError, isLoading } =
    useAuthoritySearchByControlNumbersQuery(
      currentTab.authorityType,
      selectedControlNumbers,
      show,
    );

  const records = useMemo(
    () =>
      selectedControlNumbers
        .map((controlNumber) =>
          data.find((record) => record.controlNumber === controlNumber),
        )
        .filter(
          (record): record is AuthoritySearchResult => record !== undefined,
        )
        .map((record) => ({
          controlNumber: record.controlNumber,
          type: record.type,
          heading: record.heading,
          source: record.source,
        })),
    [data, selectedControlNumbers],
  );

  useEffect(() => {
    if (show) setMasterControlNumber(records[0]?.controlNumber);
  }, [records, show]);

  const master = records.find(
    (record) => record.controlNumber === masterControlNumber,
  );
  const target = records.find(
    (record) => record.controlNumber !== masterControlNumber,
  );

  const isRecordFetchComplete = !isLoading && !isError;
  const canMerge = records.length === 2 && master && target;

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title as="h2" className="h5 fw-bold">
          전거통합 - 통합화면
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
        {isRecordFetchComplete && records.length !== 2 && (
          <p className="alert alert-warning mb-0" role="alert">
            선택한 전거자료 2건 중 {records.length}건만 조회되었습니다. 목록을
            확인한 후 다시 시도해주세요.
          </p>
        )}
        {isRecordFetchComplete && records.length === 2 && (
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
                    {[
                      "No",
                      "통합 주자료",
                      "전거유형",
                      "전거제어번호",
                      "채택표목",
                      "정보원",
                    ].map((header) => (
                      <th scope="col" key={header}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => {
                    const isChecked =
                      masterControlNumber === record.controlNumber;

                    return (
                      <tr key={record.controlNumber}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Check
                            type="radio"
                            name="merge-master"
                            aria-label={`${record.heading}을 통합 주자료로 선택`}
                            checked={isChecked}
                            onChange={() =>
                              setMasterControlNumber(record.controlNumber)
                            }
                          />
                        </td>
                        <td>{record.type}</td>
                        <td>{record.controlNumber}</td>
                        <td
                          className={clsx("text-start", {
                            "fw-bold text-primary": isChecked,
                          })}
                        >
                          {record.heading}
                        </td>
                        <td className="text-start">{record.source}</td>
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
                      통합주자료({master ? master.controlNumber : ""})
                    </span>
                    <div className="d-flex gap-2">
                      <Form.Select
                        aria-label="주자료 글자크기"
                        value={masterFontSize}
                        onChange={(event) =>
                          setMasterFontSize(event.target.value)
                        }
                        className="form-select-sm w-auto"
                      >
                        {fontSizeList.map((size) => (
                          <option key={size} value={parseInt(size)}>
                            {size} px
                          </option>
                        ))}
                      </Form.Select>
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
                    />
                  )}
                </div>
              </section>
              <section className="col-md-6">
                <div className="border p-3 bg-light rounded h-100">
                  <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                    <span className="badge bg-secondary">
                      통합대상자료({target ? target.controlNumber : ""})
                    </span>
                    <div className="d-flex gap-2">
                      <Form.Select
                        aria-label="주자료 글자크기"
                        value={targetFontSize}
                        onChange={(event) =>
                          setTargetFontSize(event.target.value)
                        }
                        className="form-select-sm w-auto"
                      >
                        {fontSizeList.map((size) => (
                          <option key={size} value={parseInt(size)}>
                            {size} px
                          </option>
                        ))}
                      </Form.Select>
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
                    />
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
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
    </Modal>
  );
}

export function AuthorityMergeButton({ onOpen }: { onOpen: () => void }) {
  const { selectedControlNumbers } = useSearchPage();

  const handleClick = () => {
    if (selectedControlNumbers.length !== 2) {
      alert(
        "전거통합은 2건씩 비교하여 진행합니다. 통합할 전거자료를 정확히 2건 선택해주세요.",
      );
      return;
    }

    onOpen();
  };

  return (
    <button
      type="button"
      className="btn btn-outline-dark btn-sm"
      onClick={handleClick}
    >
      <i className="bi bi-intersect me-1" aria-hidden="true"></i>
      전거통합
    </button>
  );
}

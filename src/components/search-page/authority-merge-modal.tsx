import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

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

function RecordPreview({ record }: { record: MergeAuthorityRecord }) {
  const preview =
    record.marcPreview ??
    [
      `001  ${record.controlNumber}`,
      `150  $a ${record.heading}`,
      record.source ? `670  $a ${record.source}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  return (
    <pre
      className="marc-record-view font-monospace bg-white border rounded p-3 mb-0"
      style={{ minHeight: "280px" }}
    >
      {preview}
    </pre>
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
  const [fontSize, setFontSize] = useState(fontSizeList[1]);

  const { data = [], isLoading } = useAuthoritySearchByControlNumbersQuery(
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
  const canMerge = records.length === 2 && master && target;

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title as="h2" className="h5 fw-bold">
          전거통합 - 통합화면
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted small">
          통합 주자료를 하나 선택하세요. 선택하지 않은 자료는 통합 대상이 되어
          주자료에 병합됩니다.
        </p>

        {isLoading ? (
          <p className="mb-0">선택한 전거자료를 불러오는 중입니다.</p>
        ) : records.length !== 2 ? null : (
          <>
            <Table bordered size="sm" className="text-center align-middle mb-4">
              <caption className="visually-hidden">전거 통합 대상 목록</caption>
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
                {records.map((record, index) => (
                  <tr key={record.controlNumber}>
                    <td>{index + 1}</td>
                    <td>
                      <Form.Check
                        type="radio"
                        name="merge-master"
                        aria-label={`${record.heading}을 통합 주자료로 선택`}
                        checked={masterControlNumber === record.controlNumber}
                        onChange={() =>
                          setMasterControlNumber(record.controlNumber)
                        }
                      />
                    </td>
                    <td>{record.type}</td>
                    <td>{record.controlNumber}</td>
                    <td className="text-start">{record.heading}</td>
                    <td className="text-start">{record.source}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-end mb-2">
              <Form.Select
                aria-label="MARC 미리보기 글자 크기"
                value={fontSize}
                onChange={(event) => setFontSize(event.target.value)}
                style={{ width: "auto" }}
              >
                {fontSizeList.map((size) => (
                  <option key={size} value={parseInt(size)}>
                    {size} px
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="row g-3" style={{ fontSize: `${fontSize}px` }}>
              <div className="col-md-6">
                <section className="border p-3 bg-light rounded h-100">
                  <span className="badge bg-primary mb-2">통합 주자료</span>
                  {master && <RecordPreview record={master} />}
                </section>
              </div>
              <div className="col-md-6">
                <section className="border p-3 rounded h-100">
                  <span className="badge bg-secondary mb-2">통합 대상자료</span>
                  {target && <RecordPreview record={target} />}
                </section>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="outline-primary"
          disabled={!canMerge}
          onClick={() => canMerge && onPreview?.(master, target)}
        >
          MARC 통합 미리보기
        </Button>
        <Button
          variant="primary"
          disabled={!canMerge}
          onClick={() => canMerge && onMerge?.(master, target)}
        >
          통합
        </Button>
        <Button variant="secondary" onClick={onHide}>
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

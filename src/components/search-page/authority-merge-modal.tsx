import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

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
  records: readonly MergeAuthorityRecord[];
  onPreview?: (
    master: MergeAuthorityRecord,
    target: MergeAuthorityRecord,
  ) => void;
  onMerge?: (
    master: MergeAuthorityRecord,
    target: MergeAuthorityRecord,
  ) => void;
}

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

const theads = [
  "No",
  "통합 주자로",
  "전거유형",
  "전거제어번호",
  "채택표목",
  "정보원",
];
const fontSizeList = ["16", "18", "20", "22", "24"];

export default function AuthorityMergeModal({
  show,
  onHide,
  records,
  onPreview,
  onMerge,
}: AuthorityMergeModalProps) {
  const [masterControlNumber, setMasterControlNumber] = useState<string>();
  const [fontSize, setFontSize] = useState(fontSizeList[1]);

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

        {records.length !== 2 ? (
          <p className="alert alert-warning mb-0">
            전거통합은 정확히 2건을 선택한 경우에만 진행할 수 있습니다.
          </p>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <Table
                bordered
                size="sm"
                className="text-center align-middle mb-0"
              >
                <caption className="visually-hidden">
                  전거 통합 대상 목록
                </caption>
                <thead className="table-light">
                  <tr>
                    {theads.map((th) => (
                      <th scope="col" key={th}>
                        {th}
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
            </div>

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

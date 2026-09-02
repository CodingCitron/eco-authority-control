import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";

import type { AuthorityDetailData } from "@/types/authority-detail.types";
import { extractHanjaFromRecord, type HanjaRecordRow } from "@/utils/hanja";
import BaseModal from "./base-modal";

// 등록, 수정 페이지에서는 context에서 가져오게 수정 필요
export function HanjaToHangulModalButton({
  record,
}: {
  record?: AuthorityDetailData["record"];
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (!record) {
      alert("전거 데이터가 없습니다.");
      return;
    }

    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-outline-dark"
        onClick={handleClick}
      >
        한자 {"->"} 한글
      </button>
      {record && (
        <HanjaToHangulModal
          show={modalIsOpen}
          onHide={() => setModalIsOpen(false)}
          record={record}
        />
      )}
    </>
  );
}

export function HanjaToHangulModal({
  show,
  onHide,
  record,
}: {
  show: boolean;
  onHide: () => void;
  record: AuthorityDetailData["record"];
}) {
  return (
    <BaseModal show={show} onHide={onHide} size="lg">
      <HanjaToHangulModalBody record={record} onHide={onHide} />
    </BaseModal>
  );
}

export function HanjaToHangulModalBody({
  record,
  onHide,
}: {
  record: AuthorityDetailData["record"];
  onHide: () => void;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 전거 레코드에서 한자가 포함된 행 추출
  const hanjaRows: HanjaRecordRow[] = useMemo(() => {
    return extractHanjaFromRecord(record);
  }, [record]);

  // 총 한자 단어 개수
  const totalHanjaCount = useMemo(() => {
    return hanjaRows.reduce((acc, row) => acc + row.hanjaMappings.length, 0);
  }, [hanjaRows]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold mb-0">
          한자 {"->"} 한글 변환
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        {hanjaRows.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-info-circle fs-3 d-block mb-2" />
            <p className="mb-0">전거 레코드에 포함된 한자가 없습니다.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center bg-light p-2 px-3 rounded border">
              <span className="text-secondary small">
                총 <strong>{hanjaRows.length}</strong>개 필드에서{" "}
                <strong>{totalHanjaCount}</strong>개의 한자가 발견되었습니다.
              </span>
            </div>

            <div
              className="table-responsive border rounded"
              style={{
                maxHeight: "500px",
              }}
            >
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light text-center">
                  <tr>
                    <th style={{ width: "80px" }}>필드</th>
                    <th style={{ width: "35%" }}>한자 표기</th>
                    <th style={{ width: "35%" }}>한글 독음</th>
                    <th style={{ width: "120px" }}>글자별 대응</th>
                  </tr>
                </thead>
                <tbody>
                  {hanjaRows.map((row) => {
                    console.log(hanjaRows);

                    return (
                      <tr key={row.key}>
                        <td className="text-center align-top pt-3">
                          <span className="badge bg-secondary font-monospace fs-6">
                            {row.tag}
                          </span>
                        </td>
                        <td colSpan={3} className="p-0">
                          <div className="d-flex flex-column divide-y">
                            {row.hanjaMappings.map((mapping, mIdx) => {
                              const copyId = `${row.key}-${mIdx}`;

                              return (
                                <div
                                  key={mIdx}
                                  className={`p-2 px-3 d-flex flex-wrap align-items-center justify-content-between gap-2 ${
                                    mIdx > 0 ? "border-top" : ""
                                  }`}
                                >
                                  <div className="d-flex align-items-center gap-3 flex-grow-1">
                                    {/* 좌측 한자 표기 */}
                                    <div
                                      className="fw-bold text-dark fs-5 font-monospace"
                                      style={{ minWidth: "100px" }}
                                    >
                                      {mapping.hanja}
                                    </div>

                                    <span className="text-muted">➔</span>

                                    {/* 우측 한글 표기 */}
                                    <div
                                      className="fw-bold text-primary fs-5"
                                      style={{ minWidth: "100px" }}
                                    >
                                      {mapping.hangul}
                                    </div>

                                    {/* 글자별 1:1 매칭 표시 */}
                                    <div className="d-flex flex-wrap gap-1 ms-auto">
                                      {mapping.chars.map((charMap, cIdx) => (
                                        <span
                                          key={cIdx}
                                          className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 px-2 py-1"
                                          title={`${charMap.char}의 한글 음은 [${charMap.hangul}] 입니다.`}
                                        >
                                          <span className="fw-bold">
                                            {charMap.char}
                                          </span>
                                          <span className="text-muted">:</span>
                                          <span className="text-primary fw-semibold">
                                            {charMap.hangul}
                                          </span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 복사 버튼 */}
                                  <div className="ms-2">
                                    {/* <button
                                      type="button"
                                      className="btn btn-outline-secondary btn-sm"
                                      onClick={() =>
                                        handleCopy(copyId, mapping.hangul)
                                      }
                                      title="한글 독음 복사"
                                    >
                                      {copiedKey === copyId
                                        ? "복사됨!"
                                        : "복사"}
                                    </button> */}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* 전체 필드 내용 미리보기 */}
                          <div className="bg-light px-3 py-1 text-muted small border-top font-monospace text-truncate">
                            <span className="me-2 text-secondary">원문:</span>
                            {row.fullFieldText}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={onHide}>
          닫기
        </button>
      </Modal.Footer>
    </>
  );
}

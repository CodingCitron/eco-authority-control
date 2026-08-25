import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import BaseModal from "../ui/base-modal";

export function BibliographicRecordConsistencyButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-light-info ms-2"
        onClick={handleClick}
      >
        서지레코드 일치성 검사
      </button>
      <BibliographicRecordConsistencyModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export function BibliographicRecordConsistencyModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <BibliographicRecordConsistencyBody onHide={onHide} />
    </BaseModal>
  );
}

export function BibliographicRecordConsistencyBody({
  onHide,
}: {
  onHide: () => void;
}) {
  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-info text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          서지레코드 일관성 작업
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="nav nav-tabs" id="marcSyncTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              data-bs-toggle="tab"
              data-bs-target="#marcSyncTarget"
              type="button"
            >
              반영대상 서지
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              data-bs-toggle="tab"
              data-bs-target="#marcSyncLog"
              type="button"
            >
              서지변경 로그
            </button>
          </li>
        </ul>
        <div className="tab-content border border-top-0 p-3">
          <div className="tab-pane fade show active" id="marcSyncTarget">
            <div className="alert alert-info py-2 mb-3 small">
              채택표목(100) 변경사항이 아직 반영되지 않은 서지레코드 목록입니다.
              전거 담당자가 직접 조회하여 반영합니다.
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" aria-hidden="true">
                서지 검색
              </span>
              <label className="visually-hidden" htmlFor="p-marcSyncSearch">
                서지 검색
              </label>
              <input
                type="text"
                className="form-control"
                id="p-marcSyncSearch"
                placeholder="제어번호 또는 서명 입력"
              />
              <button className="btn btn-primary" type="button">
                찾기
              </button>
            </div>
            <table className="table table-bordered table-sm text-center align-middle">
              <caption className="visually-hidden">
                서지레코드 일관성 반영 대상 목록
              </caption>
              <thead className="table-light">
                <tr>
                  <th scope="col">선택</th>
                  <th scope="col">서지제어번호</th>
                  <th scope="col">서명</th>
                  <th scope="col">필드</th>
                  <th scope="col">변경 전</th>
                  <th scope="col">변경 후</th>
                  <th scope="col">상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <label className="visually-hidden" htmlFor="p-marcSync1">
                      진달래꽃 선택
                    </label>
                    <input type="checkbox" id="p-marcSync1" checked />
                  </td>
                  <td>KOR2011004521</td>
                  <td className="text-start">진달래꽃</td>
                  <td>100 $a</td>
                  <td>소월</td>
                  <td className="text-primary fw-bold">김소월, 1902-1934</td>
                  <td>
                    <span className="badge text-bg-warning">대기</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label className="visually-hidden" htmlFor="p-marcSync2">
                      김소월 시집 선택
                    </label>
                    <input type="checkbox" id="p-marcSync2" checked />
                  </td>
                  <td>KOR2018009873</td>
                  <td className="text-start">김소월 시집</td>
                  <td>100 $a</td>
                  <td>소월</td>
                  <td className="text-primary fw-bold">김소월, 1902-1934</td>
                  <td>
                    <span className="badge text-bg-warning">대기</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-between align-items-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="marcSyncSelectAll"
                  checked
                />
                <label className="form-check-label" htmlFor="marcSyncSelectAll">
                  전체 선택
                </label>
              </div>
              <button className="btn btn-success btn-sm">
                선택 서지 일괄 반영
              </button>
            </div>
          </div>
          <div className="tab-pane fade" id="marcSyncLog">
            <table className="table table-bordered table-sm text-center align-middle">
              <caption className="visually-hidden">
                서지레코드 일관성 반영 이력
              </caption>
              <thead className="table-light">
                <tr>
                  <th scope="col">반영일시</th>
                  <th scope="col">처리자</th>
                  <th scope="col">서지제어번호</th>
                  <th scope="col">서명</th>
                  <th scope="col">필드</th>
                  <th scope="col">변경 전</th>
                  <th scope="col">변경 후</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026-07-21 10:15</td>
                  <td>홍길동</td>
                  <td>KOR2009001122</td>
                  <td className="text-start">한국 현대시 연구</td>
                  <td>100 $a</td>
                  <td>金素月</td>
                  <td>김소월, 1902-1934</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-end">
        <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </>
  );
}

// 고정 길이 편집 모달

import { useState } from "react";
import { Modal } from "react-bootstrap";

import BaseModal from "./base-modal";

const LEADER_INPUTS = [
  {
    name: "상태",
    minLength: 0,
    maxLength: 0,
  },
];

export function AuthorityFixedFieldEditButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button className="btn btn-sm btn-light" onClick={handleClick}>
        고정길이편집
      </button>
      <AuthorityFixedFieldEditModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthorityFixedFieldEditModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <>
      <BaseModal show={show} onHide={onHide}>
        <AutohrityFixedFieldEditModalBody onHide={onHide} />
      </BaseModal>
    </>
  );
}

export function AutohrityFixedFieldEditModalBody({
  onHide,
}: {
  onHide: () => void;
}) {
  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-dark text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          고정길이편집 (008)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="box-group border rounded mb-4">
          <div className="bg-light px-3 py-2 fw-bold border-bottom">리더</div>
          <div className="row g-3 p-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="f008_status">
                상 태
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_status"
                value="n"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="f008_type">
                형 태
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_type"
                value="z"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="f008_level">
                입력수준
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_level"
                value="a"
              />
            </div>
          </div>
        </div>
        <div className="box-group border rounded">
          <div className="px-3 py-2 fw-bold border-bottom">
            부호화정보필드(008)
          </div>
          <div className="row g-3 p-3">
            <div className="col">
              <label className="form-label" htmlFor="f008_date">
                입력날짜
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_date"
                value="120224"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_geo">
                지리구분
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_geo"
                value=""
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_roman">
                로마자번자표
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_roman"
                value="a"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_rectype">
                레코드 종류
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_rectype"
                value="z"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_catform">
                목록기술형식
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_catform"
                value="n"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_subjthdg">
                주제명표목표
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_subjthdg"
                value="n"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_sertype">
                총서유형
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_sertype"
                value="n"
              />
            </div>
          </div>
          <div className="row g-3 p-3 pt-0">
            <div className="col">
              <label className="form-label" htmlFor="f008_sernum">
                총서번호유무
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_sernum"
                value="a"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_use">
                표목사용(주표목)
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_use"
                value="a"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_subjadd">
                주제부출표목
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_subjadd"
                value="b"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_seradd">
                총서부출표목
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_seradd"
                value="n"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_subdiv">
                주제세목유형
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_subdiv"
                value=""
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_refeval">
                참조평가
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_refeval"
                value="a"
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_recupd">
                레코드갱신
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_recupd"
                value="a"
              />
            </div>
          </div>
          <div className="row g-3 p-3 pt-0">
            <div className="col">
              <label className="form-label" htmlFor="f008_nametype">
                동명이인
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_nametype"
                value=""
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_hdguse">
                채택표목수준
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_hdguse"
                value=""
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_modrec">
                수정레코드
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_modrec"
                value=""
              />
            </div>
            <div className="col">
              <label className="form-label" htmlFor="f008_catorg">
                목록작성기관
              </label>
              <input
                type="text"
                className="form-control"
                id="f008_catorg"
                value=""
              />
            </div>
            <div className="col"></div>
            <div className="col"></div>
            <div className="col"></div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-primary">
          확인
        </button>
        <button type="button" className="btn btn-secondary">
          닫기
        </button>
      </Modal.Footer>
    </>
  );
}

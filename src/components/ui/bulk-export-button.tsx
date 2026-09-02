import { useState } from "react";
import BaseModal from "./base-modal";
import { Modal } from "react-bootstrap";

export default function BulkExportButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary"
        onClick={handleClick}
      >
        <i className="bi bi-download me-1" aria-hidden="true"></i>
        일괄반출
      </button>
      <BulkExportModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export function BulkExportModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide} size="md">
      <BulkExportModalBody show={show} onHide={onHide} />
    </BaseModal>
  );
}

export function BulkExportModalBody({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-primary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          일괄반출
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tab-pane fade active show" id="export" role="tabpanel">
          <h2 className="fw-bold h5 mb-4">
            <i className="bi bi-download" aria-hidden="true"></i> 전거 일괄반출
          </h2>
          <div className="row g-3 align-items-center mb-2">
            <div className="col-auto">
              <label className="form-label mb-0 fw-bold" htmlFor="fmt_marc">
                반출형식
              </label>
            </div>
            <div className="col-auto">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="e_fmt"
                  id="fmt_marc"
                />
                <label className="form-check-label" htmlFor="fmt_marc">
                  MARC
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="e_fmt"
                  id="fmt_text"
                />
                <label className="form-check-label" htmlFor="fmt_text">
                  TEXT
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="e_fmt"
                  id="fmt_html"
                />
                <label className="form-check-label" htmlFor="fmt_html">
                  HTML
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="e_fmt"
                  id="fmt_xml"
                />
                <label className="form-check-label" htmlFor="fmt_xml">
                  XML
                </label>
              </div>
            </div>
          </div>
          <div className="row g-3 align-items-center ">
            <div className="col-auto">
              <label
                className="form-label mb-0 fw-bold"
                htmlFor="exportFilename"
              >
                파일명
              </label>
            </div>
            <div className="col-auto">
              <input
                type="text"
                className="form-control form-control-sm"
                id="exportFilename"
                value="KSH_Export_20260726"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-outline-primary px-4 fw-bold"
          data-bs-dismiss="modal"
        >
          반출처리
        </button>
        <button
          type="button"
          className="btn btn-secondary px-4 fw-bold"
          data-bs-dismiss="modal"
        >
          닫기
        </button>
      </Modal.Footer>
    </>
  );
}

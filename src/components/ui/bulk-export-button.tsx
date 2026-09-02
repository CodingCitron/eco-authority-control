import { useState } from "react";
import BaseModal from "./base-modal";

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
    <BaseModal show={show} onHide={onHide}>
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
  return <></>;
}

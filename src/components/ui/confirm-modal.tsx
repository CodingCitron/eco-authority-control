import { useState } from "react";

export function ConfirmButton({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <button type="button" onClick={handleShow}>
        {children}
      </button>
      <ConfirmModal show={show} onHide={handleClose} />
    </>
  );
}

function ConfirmModal({ show, onHide }: { show: boolean; onHide: () => void }) {
  return;
}

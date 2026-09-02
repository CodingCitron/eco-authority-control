import { useState } from "react";
import BaseModal from "./base-modal";

export function HanjaToHangulModalButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button className="btn btn-sm btn-outline-dark" onClick={handleClick}>
        한자 {"->"} 한글
      </button>
      <HanjaToHangulModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export function HanjaToHangulModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <>
      <BaseModal title="한자 -> 한글">
        <HanjaToHangulModalBody />
      </BaseModal>
    </>
  );
}

export function HanjaToHangulModalBody() {
  // 전거 레코드 데이터를 받을 수 있어야 한다.
  // 각 행에 한자가 있으면 그 행과 한자를 저장한다.
  // 저장한 배열을 좌측에는 한자 표기 우측에는 한글로 표기한다.

  return <></>;
}

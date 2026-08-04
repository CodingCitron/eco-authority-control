import { useState } from "react";
import { useSearchPage } from "./authority-search-page-context";
import BaseModal from "../ui/base-modal";

export default function AuthorityHistoryModal({ show, onHide }) {
  return (
    <BaseModal title="전거 변경이력" show={show} onHide={onHide} footer={null}>
      test
    </BaseModal>
  );
}

export function AuthorityHistoryButton() {
  const { selectedControlNumbers } = useSearchPage();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedControlNumbers.length !== 1) {
      alert(
        "전거분리는 1건씩 진행합니다. 분리할 전거자료를 정확히 1건 선택해주세요.",
      );
      return;
    }

    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        onClick={handleClick}
      >
        <i className="bi bi-intersect me-1" aria-hidden="true"></i>
        전거분리
      </button>
      <AuthorityHistoryModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

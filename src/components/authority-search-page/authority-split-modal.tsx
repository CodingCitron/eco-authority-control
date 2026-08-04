import { useState } from "react";
import { Button } from "react-bootstrap";

import { useAuthoritySearchByControlNumbersQuery } from "@/hooks/use-authority-search-query";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import BaseModal from "@/components/ui/base-modal";
import MarcFontSizeSelect, {
  fontSizeList,
} from "@/components/ui/marc-font-size-select";
import RecordPreview from "@/components/ui/record-preview";

export function AuthoritySplitButton() {
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
      <AuthoritySplitModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthoritySplitModal({ show, onHide }) {
  const [masterFontSize, setMasterFontSize] = useState(fontSizeList[0]);
  const [targetFontSize, setTargetFontSize] = useState(fontSizeList[0]);

  // 분리 데이터
  const [targetRecord, setTargetRecord] = useState(null);

  const {
    data = [],
    isError,
    isLoading,
  } = useAuthoritySearchByControlNumbersQuery();

  const master = data[0];

  return (
    <BaseModal
      title="전거분리 - 분리화면"
      show={show}
      onHide={onHide}
      footer={
        <>
          <Button className="px-4 fw-bold" variant="outline-primary">
            MARC 분리 실행
          </Button>
          <Button className="px-4 fw-bold" variant="primary">
            저장
          </Button>
          <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
            닫기
          </Button>
        </>
      }
    >
      <div className="row g-3">
        <section className="col-md-6">
          <div className="border p-3 bg-light rounded h-100">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <span className="badge bg-primary">
                통합원본자료({master ? master.controlNumber : ""})
              </span>
              <div className="d-flex gap-2">
                <MarcFontSizeSelect
                  aria-label="주자료 글자크기"
                  value={masterFontSize}
                  onChange={setMasterFontSize}
                  className="form-select-sm w-auto"
                />
                <button className="btn btn-sm btn-outline-dark" type="button">
                  한자 -&gt; 한글
                </button>
              </div>
            </div>
            {master && (
              <RecordPreview
                record={master}
                fontSize={`${masterFontSize}px`}
                className="bg-white"
              />
            )}
          </div>
        </section>
        <section className="col-md-6">
          <div className="border p-3 bg-white rounded h-100">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <span className="badge bg-secondary">분리대상자료</span>
              <div className="d-flex gap-2">
                <MarcFontSizeSelect
                  aria-label="대상자료 글자크기"
                  value={targetFontSize}
                  onChange={setTargetFontSize}
                  className="form-select-sm w-auto"
                />
                <button className="btn btn-sm btn-outline-dark" type="button">
                  한자 -&gt; 한글
                </button>
              </div>
            </div>
            <RecordPreview
              record={targetRecord}
              fontSize={`${targetFontSize}px`}
              message="분리할 자료가 선택되지 않았습니다."
              className="bg-light"
            />
          </div>
        </section>
      </div>
    </BaseModal>
  );
}

import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";
import { useAuthorityDetail } from "@/hooks/use-authority-detail";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import BaseModal from "@/components/ui/base-modal";
import MarcFontSizeSelect, {
  fontSizeList,
} from "@/components/ui/marc-font-size-select";
import MarcRecordPreview from "@/components/ui/record-preview";

export function AuthoritySplitButton() {
  const { selectedRecordKeys } = useSearchPage();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedRecordKeys.length !== 1) {
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

export default function AuthoritySplitModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthoritySplitModalBody show={show} onHide={onHide} />
    </BaseModal>
  );
}

export function AuthoritySplitModalBody({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  const [masterFontSize, setMasterFontSize] = useState(fontSizeList[0]);
  const [targetFontSize, setTargetFontSize] = useState(fontSizeList[0]);

  // 분리 데이터
  const [targetRecord, setTargetRecord] = useState();

  const { data = [], isError, isLoading } = useAuthoritySearchByRecordKeys();

  const reckey = data[0]?.recKey;

  const {
    data: detailData,
    isLoading: isDetailDataLoading,
    isError: isDetailDataError,
  } = useAuthorityDetail(reckey, {
    enabled: show && !!reckey,
  });

  const isRecordFetchComplete = !isLoading && !isError;

  console.log(detailData);

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-primary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거분리 - 분리화면
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <p className="mb-0">선택한 전거자료를 불러오는 중입니다.</p>
        )}

        {!isLoading && isError && (
          <p className="alert alert-danger mb-0" role="alert">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && isDetailDataLoading && (
          <p className="alert alert-info mb-0" role="status">
            선택한 전거의 상세 정보를 불러오는 중입니다.
          </p>
        )}

        {isRecordFetchComplete && !isDetailDataLoading && isDetailDataError && (
          <p className="alert alert-danger mb-0" role="alert">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        {isRecordFetchComplete && detailData && (
          <div className="row g-3">
            <section className="col-md-6">
              <div className="border p-3 bg-light rounded h-100">
                <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                  <span className="badge bg-primary">
                    통합원본자료({detailData.data.acControlNo})
                  </span>
                  <div className="d-flex gap-2">
                    <MarcFontSizeSelect
                      aria-label="주자료 글자크기"
                      value={masterFontSize}
                      onChange={setMasterFontSize}
                      className="form-select-sm w-auto"
                    />
                    <button
                      className="btn btn-sm btn-outline-dark"
                      type="button"
                    >
                      한자 -&gt; 한글
                    </button>
                  </div>
                </div>
                <MarcRecordPreview
                  detail={detailData.data}
                  fontSize={`${masterFontSize}px`}
                  className="bg-white"
                />
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
                    <button
                      className="btn btn-sm btn-outline-dark"
                      type="button"
                    >
                      한자 -&gt; 한글
                    </button>
                  </div>
                </div>
                <MarcRecordPreview
                  detail={targetRecord}
                  fontSize={`${targetFontSize}px`}
                  message="분리할 자료가 선택되지 않았습니다."
                  className="bg-light"
                />
              </div>
            </section>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button className="px-4 fw-bold" variant="primary">
          MARC 분리 실행
        </Button>
        <Button className="px-4 fw-bold" variant="secondary">
          저장
        </Button>
        <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </>
  );
}

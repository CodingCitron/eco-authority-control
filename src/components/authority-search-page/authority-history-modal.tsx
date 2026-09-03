import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { format, isValid, parseISO } from "date-fns";

import BaseModal from "@/components/ui/base-modal";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "@/components/ui/marc-font-size-select";
import OverflowTooltip from "@/components/ui/overflow-tooltip";
import MarcRecordPreview from "@/components/ui/record-preview";
import { useAuthorityHistory } from "@/hooks/use-authority-history";
import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";
import { authorityTypeLabels, isValidAcType } from "@/types/authority.types";
import {
  getAuthorityHeading,
  getAuthorityHeadingTag,
  getMarcAuthorityHeading,
} from "@/utils/authority-record";

import { useSearchPage } from "./authority-search-page-context";
import { HanjaToHangulModalButton } from "../ui/hanja-to-hangul-modal";

const HISTORY_DISPLAY = 10;

function formatFirstInputDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const compactDate = value.replace(/[^0-9]/g, "");
  if (compactDate.length < 8) {
    return value;
  }

  return `${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}`;
}

function formatHistoryUpdateDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const parsedDate = parseISO(value);
  return isValid(parsedDate) ? format(parsedDate, "yyyyMMddHHmm") : value;
}

export function AuthorityHistoryButton() {
  const { selectedRecordKeys } = useSearchPage();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    if (selectedRecordKeys.length !== 1) {
      alert(
        "변경이력보기는 1건씩 조회합니다. 조회할 전거자료를 정확히 1건 선택해주세요.",
      );
      return;
    }

    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-info btn-sm"
        onClick={handleClick}
      >
        <i className="bi bi-clock-history me-1" aria-hidden="true"></i>
        변경이력보기
      </button>
      <AuthorityHistoryModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthorityHistoryModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    // sm, lg, xl, xxl, fullscreen
    <BaseModal show={show} onHide={onHide} dialogClassName="modal-xxl">
      <AuthorityHistoryModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityHistoryModalBody({ onHide }: { onHide: () => void }) {
  const [page, setPage] = useState(1);
  const [selectedHistoryKey, setSelectedHistoryKey] = useState("");
  const [fontSize, setFontSize] = useState(defaultFontSize);

  const {
    data: selectedRecords = [],
    isLoading: isRecordLoading,
    isError: isRecordError,
  } = useAuthoritySearchByRecordKeys();
  const selectedRecord = selectedRecords[0];
  const recKey = selectedRecord?.recKey ?? "";

  const {
    data: historyResponse,
    isError: isHistoryError,
    isLoading: isHistoryLoading,
    isFetching: isHistoryFetching,
  } = useAuthorityHistory(
    {
      recKey,
      page: String(page),
      display: String(HISTORY_DISPLAY),
    },
    { enabled: Boolean(recKey) },
  );

  const history = historyResponse?.data;
  const historyItems = history?.items ?? [];
  const currentPage = history?.page ?? page;
  const totalPages = Math.max(history?.totalPages ?? 1, 1);
  const selectedHistory =
    historyItems.find((item) => item.historyKey === selectedHistoryKey) ??
    historyItems[0];
  const selectedHistoryIndex = selectedHistory
    ? historyItems.findIndex(
        (item) => item.historyKey === selectedHistory.historyKey,
      )
    : -1;

  const { data: nextHistoryPageResponse } = useAuthorityHistory(
    {
      recKey,
      page: String(currentPage + 1),
      display: String(HISTORY_DISPLAY),
    },
    {
      enabled: Boolean(recKey) && currentPage < totalPages,
    },
  );
  const previousHistory =
    selectedHistoryIndex >= 0
      ? (historyItems[selectedHistoryIndex + 1] ??
        (selectedHistoryIndex === historyItems.length - 1
          ? nextHistoryPageResponse?.data.items[0]
          : undefined))
      : undefined;
  const headingTag = getAuthorityHeadingTag(selectedRecord?.acType);
  const authorityTypeLabel =
    selectedRecord && isValidAcType(selectedRecord.acType)
      ? authorityTypeLabels[selectedRecord.acType]
      : "";
  const region = [selectedRecord?.acRegionCode, selectedRecord?.acRegionDesc]
    .filter(Boolean)
    .join(" : ");

  const moveToPage = (nextPage: number) => {
    setSelectedHistoryKey("");
    setPage(nextPage);
  };

  const renderHistoryState = () => {
    if (isRecordLoading) {
      return "선택한 전거자료 정보를 불러오는 중입니다.";
    }
    if (!recKey) {
      return "선택한 전거자료 정보가 없습니다.";
    }
    if (isHistoryLoading) {
      return "변경이력을 불러오는 중입니다.";
    }
    if (isHistoryError) {
      return "변경이력을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
    }
    return "조회된 변경이력이 없습니다.";
  };

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-info text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          <i className="bi bi-clock-history me-1" aria-hidden="true"></i>전거
          변경이력
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isRecordLoading && (
          <div className="alert alert-info py-2" role="status">
            선택한 전거자료 정보를 불러오는 중입니다.
          </div>
        )}
        {isRecordError && (
          <div className="alert alert-danger py-2" role="alert">
            선택한 전거자료 정보를 불러오지 못했습니다.
          </div>
        )}
        {!isRecordLoading && !isRecordError && !selectedRecord && (
          <div className="alert alert-warning py-2" role="alert">
            선택한 전거자료 정보를 찾을 수 없습니다.
          </div>
        )}

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center mb-2">
              <div className="col-md-3">
                <label
                  className="form-label mb-0 fw-bold text-nowrap"
                  htmlFor="histFirstUser"
                >
                  최초입력자
                </label>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="histFirstUser"
                  value={selectedRecord?.firstWorker ?? "-"}
                  readOnly
                />
              </div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-md-3">
                <label
                  className="form-label mb-0 fw-bold text-nowrap"
                  htmlFor="histFirstDate"
                >
                  최초입력일
                </label>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="histFirstDate"
                  value={formatFirstInputDate(selectedRecord?.firstInputDate)}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="row g-2 align-items-center mb-2">
              <div className="col-md-3">
                <label
                  className="form-label mb-0 fw-bold text-nowrap"
                  htmlFor="histTag"
                >
                  전거표시기호
                </label>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="histTag"
                  value={
                    headingTag && authorityTypeLabel
                      ? `${headingTag} : ${authorityTypeLabel}`
                      : "-"
                  }
                  readOnly
                />
              </div>
              <div className="col-md-3">
                <label
                  className="form-label mb-0 fw-bold text-nowrap"
                  htmlFor="histRegion"
                >
                  전거지역구분
                </label>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="histRegion"
                  value={region || "-"}
                  readOnly
                />
              </div>
            </div>
            <div className="row g-2 align-items-center">
              <div className="col-md-3">
                <label
                  className="form-label mb-0 fw-bold text-nowrap"
                  htmlFor="histHeading"
                >
                  채택표목
                </label>
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  id="histHeading"
                  value={getAuthorityHeading(selectedRecord) || "-"}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-5">
            <div className="table-responsive">
              <table
                className="table table-bordered table-sm text-center align-middle mb-2"
                id="historyEntryTable"
                style={{ tableLayout: "fixed" }}
              >
                <caption className="visually-hidden">전거 변경 이력</caption>
                <colgroup>
                  <col style={{ width: "48px" }} />
                  <col style={{ width: "52px" }} />
                  <col style={{ width: "64px" }} />
                  <col />
                  <col style={{ width: "132px" }} />
                </colgroup>
                <thead className="table-light">
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">선택</th>
                    <th scope="col">수정자</th>
                    <th scope="col">표목</th>
                    <th scope="col">수정일시</th>
                  </tr>
                </thead>
                <tbody id="historyEntryBody">
                  {historyItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-secondary">
                        {renderHistoryState()}
                      </td>
                    </tr>
                  ) : (
                    historyItems.map((item, index) => {
                      const isSelected =
                        selectedHistory?.historyKey === item.historyKey;
                      const heading =
                        getMarcAuthorityHeading(
                          item.record,
                          selectedRecord?.acType,
                        ) || "-";
                      const inputId = `history-${index}`;

                      const formattedDate = formatHistoryUpdateDate(
                        item.updateDate,
                      );

                      return (
                        <tr
                          key={item.historyKey}
                          className={isSelected ? "table-primary" : undefined}
                        >
                          <td>
                            {(currentPage - 1) *
                              (history?.display ?? HISTORY_DISPLAY) +
                              index +
                              1}
                          </td>
                          <td>
                            <label
                              className="visually-hidden"
                              htmlFor={inputId}
                            >
                              {heading} 이력 선택
                            </label>
                            <input
                              type="radio"
                              id={inputId}
                              name="historyRefSelect"
                              checked={isSelected}
                              onChange={() =>
                                setSelectedHistoryKey(item.historyKey)
                              }
                            />
                          </td>
                          <td>
                            <OverflowTooltip text={item.worker ?? "-"}>
                              {item.worker ?? "-"}
                            </OverflowTooltip>
                          </td>
                          <td className="text-start">
                            <OverflowTooltip text={heading}>
                              {heading}
                            </OverflowTooltip>
                          </td>
                          <td>
                            <OverflowTooltip text={formattedDate}>
                              {formattedDate}
                            </OverflowTooltip>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="첫 페이지"
                disabled={isHistoryFetching || currentPage <= 1}
                onClick={() => moveToPage(1)}
              >
                <i className="bi bi-chevron-double-left" aria-hidden="true"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="이전 페이지"
                disabled={isHistoryFetching || currentPage <= 1}
                onClick={() => moveToPage(currentPage - 1)}
              >
                <i className="bi bi-chevron-left" aria-hidden="true"></i>
              </button>
              <span className="border rounded px-3 py-1">
                {currentPage}/{totalPages}
              </span>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="다음 페이지"
                disabled={isHistoryFetching || currentPage >= totalPages}
                onClick={() => moveToPage(currentPage + 1)}
              >
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="마지막 페이지"
                disabled={isHistoryFetching || currentPage >= totalPages}
                onClick={() => moveToPage(totalPages)}
              >
                <i
                  className="bi bi-chevron-double-right"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
              <div className="d-flex align-items-center gap-2 small">
                {previousHistory && (
                  <>
                    <span className="bg-danger-subtle border rounded px-2 py-1">
                      삭제
                    </span>
                    <span className="bg-success-subtle border rounded px-2 py-1">
                      추가
                    </span>
                  </>
                )}
              </div>
              <div className="d-flex justify-content-end align-items-center gap-2">
                <span className="fw-bold" aria-hidden="true">
                  글자크기
                </span>
                <MarcFontSizeSelect
                  aria-label="변경이력 MARC 글자크기"
                  className="form-select-sm w-auto"
                  value={fontSize}
                  onChange={setFontSize}
                />
                <HanjaToHangulModalButton record={selectedHistory?.record} />
              </div>
            </div>
            <MarcRecordPreview
              record={selectedHistory?.record}
              previousRecord={previousHistory?.record}
              fontSize={`${fontSize}px`}
              className="bg-light overflow-auto"
              message={renderHistoryState()}
              style={{ minHeight: "380px", maxHeight: "520px" }}
            />
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

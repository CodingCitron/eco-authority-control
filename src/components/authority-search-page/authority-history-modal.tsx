import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { useAuthoritySearchByRecordKeys } from "@/hooks/use-authority-search";

import BaseModal from "../ui/base-modal";
import { useSearchPage } from "./authority-search-page-context";
import { useAuthorityHistory } from "@/hooks/use-authority-history";

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
    <BaseModal show={show} onHide={onHide}>
      <AuthorityHistoryModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityHistoryModalBody({ onHide }: { onHide: () => void }) {
  const { data } = useAuthoritySearchByRecordKeys();

  const {
    recKey,
    acType,
    acRegionCode,
    firstWorker,
    firstInputDate,
    headingName,
    activityField,
  } = data[0];

  // 최초입력자, 전거표시기호, 전거지역구분, 최초입력일, 채택표목

  const {
    data: historyData,
    isError,
    isLoading,
  } = useAuthorityHistory({
    recKey,
  });

  console.log(history);

  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-info text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거변경이력
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && (
          <p className="mb-0">선택한 전거자료를 불러오는 중입니다.</p>
        )}

        {!isLoading && isError && (
          <p className="mb-0">
            선택한 전거자료를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
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
                  value="김영희"
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
                  value="2026/06/25"
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
                  value="150 : 주제명"
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
                  value="1 : 한국"
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
                  value="부작위[不作爲]"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-5">
            <table
              className="table table-bordered table-sm text-center align-middle"
              id="historyEntryTable"
            >
              <caption className="visually-hidden">전거 변경 이력</caption>
              <thead className="table-light">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">선택</th>
                  <th scope="col">수정자</th>
                  <th scope="col">표목</th>
                  <th scope="col">수정일</th>
                </tr>
              </thead>
              <tbody id="historyEntryBody">
                <tr className="table-primary">
                  <td>1</td>
                  <td>
                    <label
                      className="visually-hidden"
                      htmlFor="hist-refSelect1"
                    >
                      홍길동 20260630101530 선택
                    </label>
                    <input
                      type="radio"
                      id="hist-refSelect1"
                      name="historyRefSelect"
                      checked
                    />
                  </td>
                  <td>홍길동</td>
                  <td className="text-start">부작위</td>
                  <td>20260630101530</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <label
                      className="visually-hidden"
                      htmlFor="hist-refSelect2"
                    >
                      김철수 20260628091205 선택
                    </label>
                    <input
                      type="radio"
                      id="hist-refSelect2"
                      name="historyRefSelect"
                    />
                  </td>
                  <td>김철수</td>
                  <td className="text-start">부작위</td>
                  <td>20260628091205</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>4</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="첫 페이지"
              >
                <i className="bi bi-chevron-double-left" aria-hidden="true"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="이전 페이지"
              >
                <i className="bi bi-chevron-left" aria-hidden="true"></i>
              </button>
              <span className="border rounded px-3 py-1">1/1</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="다음 페이지"
              >
                <i className="bi bi-chevron-right" aria-hidden="true"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-label="마지막 페이지"
              >
                <i
                  className="bi bi-chevron-double-right"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="d-flex justify-content-end align-items-center gap-2 mb-2">
              <label className="visually-hidden" htmlFor="histFontSize">
                글자크기
              </label>
              <span className="fw-bold" aria-hidden="true">
                글자크기
              </span>
              <select
                className="form-select form-select-sm w-auto"
                id="histFontSize"
              >
                <option value="14">14 px</option>
                <option value="16" selected>
                  16 px
                </option>
                <option value="18">18 px</option>
                <option value="20">20 px</option>
                <option value="22">22 px</option>
              </select>
              <button type="button" className="btn btn-sm btn-outline-dark">
                한자 -&gt; 한글
              </button>
            </div>
            <div
              className="marc-record-view font-monospace bg-light border rounded p-2"
              id="historyMarcPanel"
              style={{
                fontSize: "16px",
                minHeight: "380px",
              }}
            >
              <div className="marc-line marc-line-control">
                <span className="marc-tag">005</span> 20260630101530
              </div>
              <div className="marc-line marc-line-control">
                <span className="marc-tag">008</span> 120224 b aznnnaabn a
                aaa{" "}
              </div>
              <div className="marc-line marc-line-data bg-danger-subtle">
                <span className="marc-tag">150</span>{" "}
                <span className="marc-sf">$a</span>부작위[不作爲]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data bg-success-subtle">
                <span className="marc-tag">150</span>{" "}
                <span className="marc-sf">$a</span>부작위[不作爲]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">450</span>{" "}
                <span className="marc-sf">$w</span>r
                <span className="marc-sf">$i</span>영어
                <span className="marc-sf">$a</span>nonfeasance
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">450</span>{" "}
                <span className="marc-sf">$w</span>r
                <span className="marc-sf">$i</span>독일어
                <span className="marc-sf">$a</span>Untatigkeit
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">450</span>{" "}
                <span className="marc-sf">$w</span>r
                <span className="marc-sf">$i</span>불어
                <span className="marc-sf">$a</span>negligence
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$w</span>h
                <span className="marc-sf">$a</span>단순부작위[單純不作爲]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$w</span>h
                <span className="marc-sf">$a</span>인용(인정)[認容]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$w</span>h
                <span className="marc-sf">$a</span>입법부작위[立法不作爲]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$a</span>부작위명령[不作爲命令]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$a</span>부작위부담[不作爲負擔]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$a</span>부작위소송[不作爲訴訟]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$a</span>부작위위법[不作爲違法]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">550</span>{" "}
                <span className="marc-sf">$a</span>부작위의무[不作爲義務]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">670</span>{" "}
                <span className="marc-sf">$a</span>법률용어사전
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">680</span>{" "}
                <span className="marc-sf">$a</span>이 표목은 법률상 의무가 있는
                자가 행위를 하지 않음으로써 성립하는 법적 책임.
                <span className="marc-eof">%</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <div>
          <Button type="button" variant="outline-secondary">
            이전
          </Button>{" "}
          <Button type="button" variant="outline-secondary">
            다음
          </Button>
        </div>
        <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
          닫기
        </Button>
      </Modal.Footer>
    </>
  );
}

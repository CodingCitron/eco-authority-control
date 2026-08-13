import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import BaseModal from "../ui/base-modal";

export function AuthorityControlButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-outline-dark btn-sm"
        onClick={handleClick}
      >
        <i className="bi bi-link-45deg me-1" aria-hidden="true"></i>
        전거통제
      </button>
      <AuthorityControlModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export default function AuthorityControlModal({ show, onHide }) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthorityControlModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityControlModalBody({ onHide }) {
  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-secondary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거통제
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" aria-hidden="true">
                검색어
              </span>
              <label className="visually-hidden" htmlFor="ctrlSearch">
                검색어
              </label>
              <input
                type="text"
                className="form-control"
                id="ctrlSearch"
                value="부작위"
              />
              <button className="btn btn-primary" type="button">
                찾기
              </button>
            </div>
            <table className="table table-bordered table-sm text-center align-middle">
              <caption className="visually-hidden">전거 검색 결과 목록</caption>
              <thead className="table-light">
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">선택</th>
                  <th scope="col">전거유형</th>
                  <th scope="col">전거제어번호</th>
                  <th scope="col">채택표목</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <label
                      className="visually-hidden"
                      htmlFor="ctrl-refSelect1"
                    >
                      작위[作爲] 선택
                    </label>
                    <input
                      type="radio"
                      id="ctrl-refSelect1"
                      name="controlRefSelect"
                    />
                  </td>
                  <td>주제명</td>
                  <td>KAS201100002</td>
                  <td className="text-start">작위[作爲]</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <label
                      className="visually-hidden"
                      htmlFor="ctrl-refSelect2"
                    >
                      고의[故意] 선택
                    </label>
                    <input
                      type="radio"
                      id="ctrl-refSelect2"
                      name="controlRefSelect"
                    />
                  </td>
                  <td>주제명</td>
                  <td>KAS201400005</td>
                  <td className="text-start">고의[故意]</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <label
                      className="visually-hidden"
                      htmlFor="ctrl-refSelect3"
                    >
                      법적 책임[法的責任] 선택
                    </label>
                    <input
                      type="radio"
                      id="ctrl-refSelect3"
                      name="controlRefSelect"
                    />
                  </td>
                  <td>주제명</td>
                  <td>KAS201300002</td>
                  <td className="text-start">법적 책임[法的責任]</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    <label
                      className="visually-hidden"
                      htmlFor="ctrl-refSelect4"
                    >
                      단순부작위[單純不作爲] 선택
                    </label>
                    <input
                      type="radio"
                      id="ctrl-refSelect4"
                      name="controlRefSelect"
                      checked
                    />
                  </td>
                  <td>주제명</td>
                  <td>KAS201206266</td>
                  <td className="text-start text-primary fw-bold">
                    단순부작위[單純不作爲]
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>6</td>
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
              <label className="visually-hidden" htmlFor="ctrlFontSize">
                글자크기
              </label>
              <span className="fw-bold" aria-hidden="true">
                글자크기
              </span>
              <select
                className="form-select form-select-sm w-auto"
                id="ctrlFontSize"
              >
                <option>22 px</option>
              </select>
              <button className="btn btn-sm btn-outline-dark">
                한자 -&gt; 한글
              </button>
            </div>
            <div
              className="form-control marc-textarea font-monospace bg-light mb-2"
              style={{
                minHeight: "220px",
              }}
            >
              <div className="marc-line marc-line-control">
                <span className="marc-tag">001</span> KAS201206266
              </div>
              <div className="marc-line marc-line-control">
                <span className="marc-tag">005</span> 20200918145415
              </div>
              <div className="marc-line marc-line-control">
                <span className="marc-tag">008</span> 120224 n aznnnaabn a aaa{" "}
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">150</span>{" "}
                <span className="marc-sf">$a</span>단순부작위[單純不作爲]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">360</span>{" "}
                <span className="marc-sf">$i</span>더 넓은 개념은
                <span className="marc-sf">$a</span>부작위[不作爲]
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">377</span>{" "}
                <span className="marc-sf">$i</span>한국어{" "}
                <span className="marc-eof">%</span>
              </div>
            </div>
            <div className="d-flex justify-content-end align-items-center bg-light p-2 border mb-2">
              <button className="btn btn-success btn-sm">채택표목 복사</button>
            </div>
            <table className="table table-bordered table-sm text-center align-middle mb-2">
              <caption className="visually-hidden">5XX 필드 목록</caption>
              <thead className="table-light">
                <tr>
                  <th scope="col">no</th>
                  <th scope="col">선택</th>
                  <th scope="col">Tag</th>
                  <th scope="col">SB</th>
                  <th scope="col">내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>
                    <label className="visually-hidden" htmlFor="ctrl-5xxRow1">
                      550 단순부작위 선택
                    </label>
                    <input type="checkbox" id="ctrl-5xxRow1" />
                  </td>
                  <td className="fw-bold text-primary">550</td>
                  <td></td>
                  <td className="text-start">
                    <span className="marc-sf">$w</span>b
                    <span className="marc-sf">$a</span>단순부작위[單純不作爲]
                    <span className="marc-sf">$0</span>KAS201206266
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <label className="visually-hidden" htmlFor="ctrl-5xxRow2">
                      550 작위 선택
                    </label>
                    <input type="checkbox" id="ctrl-5xxRow2" />
                  </td>
                  <td className="fw-bold text-primary">550</td>
                  <td></td>
                  <td className="text-start">
                    <span className="marc-sf">$w</span>a
                    <span className="marc-sf">$a</span>작위[作爲]
                    <span className="marc-sf">$0</span>KAS201100002
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="text-end">
              <button className="btn btn-sm btn-outline-danger">삭제</button>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-between">
        <Button variant="secondary">화면 초기화</Button>
        <div>
          <Button className="px-4 fw-bold" variant="primary">
            확인
          </Button>{" "}
          <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
            닫기
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}

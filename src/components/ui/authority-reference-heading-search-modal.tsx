import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import BaseModal from "./base-modal";

export function AuthorityReferenceHeadingSearchButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleClick = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary w-100"
        onClick={handleClick}
      >
        참조표목조회(5XX) 추가
      </button>
      <AuthorityReferenceHeadingSearchModal
        show={modalIsOpen}
        onHide={() => setModalIsOpen(false)}
      />
    </>
  );
}

export function AuthorityReferenceHeadingSearchModal({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) {
  return (
    <BaseModal show={show} onHide={onHide}>
      <AuthorityReferenceHeadingSearchModalBody onHide={onHide} />
    </BaseModal>
  );
}

export function AuthorityReferenceHeadingSearchModalBody({
  onHide,
}: {
  onHide: () => void;
}) {
  return (
    <>
      <Modal.Header
        closeButton
        closeVariant="white"
        className="bg-secondary text-white"
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          참조표목조회(5XX) 추가
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3">
          <div className="col-lg-5">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" aria-hidden="true">
                검색어
              </span>
              <label className="visually-hidden" htmlFor="c-5xxSearch">
                검색어
              </label>
              <input
                type="text"
                className="form-control"
                id="c-5xxSearch"
                value="문화체육부"
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
                    <label className="visually-hidden" htmlFor="c-refSelect1">
                      공보처 선택
                    </label>
                    <input type="radio" id="c-refSelect1" name="refSelect" />
                  </td>
                  <td>단체명</td>
                  <td>KAB201100002</td>
                  <td className="text-start">공보처</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <label className="visually-hidden" htmlFor="c-refSelect2">
                      공보부 선택
                    </label>
                    <input type="radio" id="c-refSelect2" name="refSelect" />
                  </td>
                  <td>단체명</td>
                  <td>KAB201400005</td>
                  <td className="text-start">공보부</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>
                    <label className="visually-hidden" htmlFor="c-refSelect3">
                      문화체육관광부 선택
                    </label>
                    <input type="radio" id="c-refSelect3" name="refSelect" />
                  </td>
                  <td>단체명</td>
                  <td>KAB201300002</td>
                  <td className="text-start">문화체육관광부</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>
                    <label className="visually-hidden" htmlFor="c-refSelect4">
                      한국.문화관광부 선택
                    </label>
                    <input
                      type="radio"
                      id="c-refSelect4"
                      name="refSelect"
                      checked
                    />
                  </td>
                  <td>단체명</td>
                  <td>KAB201206266</td>
                  <td className="text-start text-primary fw-bold">
                    한국.문화관광부
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
              <label className="visually-hidden" htmlFor="c-5xxFontSize">
                글자크기
              </label>
              <span className="fw-bold" aria-hidden="true">
                글자크기
              </span>
              <select
                className="form-select form-select-sm w-auto"
                id="c-5xxFontSize"
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
                minHeight: "220px;",
              }}
            >
              <div className="marc-line marc-line-control">
                <span className="marc-tag">001</span> KAB201206266
              </div>
              <div className="marc-line marc-line-control">
                <span className="marc-tag">005</span> 20200918145415
              </div>
              <div className="marc-line marc-line-control">
                <span className="marc-tag">008</span> 120224 b aznnnaabn a aaa{" "}
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">046</span>{" "}
                <span className="marc-sf">$s</span>20110101
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">110</span>{" "}
                <span className="marc-sf">$a</span>한국.
                <span className="marc-sf">$b</span>문화관광부
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">368</span>{" "}
                <span className="marc-sf">$a</span>정부기관
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">370</span>{" "}
                <span className="marc-sf">$a</span>한국(국명)[韓國]{" "}
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">372</span>{" "}
                <span className="marc-sf">$a</span>사회문화[社會文化]{" "}
                <span className="marc-eof">%</span>
              </div>
              <div className="marc-line marc-line-data">
                <span className="marc-tag">377</span>{" "}
                <span className="marc-sf">$i</span>한국어{" "}
                <span className="marc-eof">%</span>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bg-light p-2 border mb-2">
              <div className="d-flex gap-2">
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio0"
                    checked
                  />
                  <label className="form-check-label" htmlFor="btnradio0">
                    적용안함
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio1"
                  />
                  <label className="form-check-label" htmlFor="btnradio1">
                    이전 (a)
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio2"
                  />
                  <label className="form-check-label" htmlFor="btnradio2">
                    이후(b)
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio3"
                  />
                  <label className="form-check-label" htmlFor="btnradio3">
                    상위 (g)
                  </label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="btnradio"
                    id="btnradio4"
                  />
                  <label className="form-check-label" htmlFor="btnradio4">
                    하위(h)
                  </label>
                </div>
              </div>
              <button className="btn btn-success btn-sm">5XX로 복사</button>
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
                    <label className="visually-hidden" htmlFor="c-5xxRow1">
                      510 한국. 문화관광부 선택
                    </label>
                    <input type="checkbox" id="c-5xxRow1" />
                  </td>
                  <td className="fw-bold text-primary">510</td>
                  <td></td>
                  <td className="text-start">
                    <span className="marc-sf">$w</span>b
                    <span className="marc-sf">$a</span>한국.
                    <span className="marc-sf">$b</span>문화관광부
                    <span className="marc-sf">$0</span>KAB201206266
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>
                    <label className="visually-hidden" htmlFor="c-5xxRow2">
                      510 한국. 공보부 선택
                    </label>
                    <input type="checkbox" id="c-5xxRow2" />
                  </td>
                  <td className="fw-bold text-primary">510</td>
                  <td></td>
                  <td className="text-start">
                    <span className="marc-sf">$w</span>a
                    <span className="marc-sf">$a</span>한국.
                    <span className="marc-sf">$b</span>공보부
                    <span className="marc-sf">$0</span>KAB201400005
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

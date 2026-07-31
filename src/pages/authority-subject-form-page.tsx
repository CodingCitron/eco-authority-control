export default function AuthoritySubjectFormPage() {
  return (
    <main
      id="main-content"
      className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
    >
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2 fw-bold">주제명 전거관리 - 입력/수정</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-primary">서지 목록보기</button>
          <button className="btn btn-sm btn-secondary">화면 초기화</button>
          <label htmlFor="fontSizeSelect" className="visually-hidden">
            글자크기
          </label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            id="fontSizeSelect"
          >
            <option value="">글자크기</option>
            <option value="14">14px</option>
            <option value="16">16px</option>
            <option value="18">18px</option>
            <option value="20">20px</option>
            <option value="22">22px</option>
            <option value="24">24px</option>
          </select>
          <button className="btn btn-sm btn-outline-dark">
            한자 -{">"} 한글
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-7">
          <div className="card marc-form shadow-sm mb-4">
            <div className="card-body">
              <form className="row g-2 form-sm">
                <div className="col-md-6">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-4">
                      <label
                        className="form-label fw-bold mb-0 text-nowrap"
                        htmlFor="fldIndicator"
                      >
                        전거표시기호
                      </label>
                    </div>
                    <div className="col">
                      <select className="form-select" id="fldIndicator">
                        <option>150 : 주제명</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-4">
                      <label
                        className="form-label fw-bold mb-0 text-nowrap"
                        htmlFor="fldRegion"
                      >
                        전거지역구분
                      </label>
                    </div>
                    <div className="col">
                      <select className="form-select" id="fldRegion">
                        <option>1 : 한국</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-2">
                      <label
                        className="form-label fw-bold mb-0 text-nowrap"
                        htmlFor="s-heading150"
                      >
                        채택표목
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        id="s-heading150"
                        value="부작위[不作爲]"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="box-group border rounded p-3">
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-auto">
                        <div className="form-check form-check-inline mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="ref450type"
                            id="ref450none"
                            checked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="ref450none"
                          >
                            적용안함
                          </label>
                        </div>
                        <div className="form-check form-check-inline mb-0">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="ref450type"
                            id="ref450code"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="ref450code"
                          >
                            관계부호
                          </label>
                        </div>
                      </div>
                      <div className="col">
                        <label
                          className="visually-hidden"
                          htmlFor="s-ref450lang"
                        >
                          언어명
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="s-ref450lang"
                          value="영어"
                        />
                      </div>
                    </div>
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="s-ref450"
                        >
                          참조표목(450)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="s-ref450"
                          value="nonfeasance"
                        />
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="box-group border rounded p-3">
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <span className="form-label fw-bold mb-0 text-nowrap">
                          참조표목(550)
                        </span>
                      </div>
                      <div className="col">
                        <button
                          type="button"
                          className="btn btn-secondary w-100"
                          data-bs-toggle="modal"
                          data-bs-target="#modal5XX"
                        >
                          참조표목조회(5XX) 추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="box-group border rounded p-3">
                    <div className="row g-2 align-items-start mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="s-source670"
                        >
                          정보원(670)
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group">
                          <textarea
                            className="form-control"
                            id="s-source670"
                            rows={2}
                          >
                            법률용어사전
                          </textarea>
                          <span className="input-group-text">
                            <i
                              className="bi bi-chevron-expand"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                    <div className="row g-2 align-items-start">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="s-note680"
                        >
                          일반주기(680)
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group">
                          <textarea
                            className="form-control"
                            id="s-note680"
                            rows={2}
                          >
                            이 표목은 법률상 의무가 있는 자가 행위를 하지
                            않음으로써 성립하는 법적 책임.
                          </textarea>
                          <span className="input-group-text">
                            <i
                              className="bi bi-chevron-expand"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </div>
                      </div>
                      <div className="col-auto">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12"></div>

                <div className="col-12">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="s-createdBy"
                      >
                        최초입력자
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        id="s-createdBy"
                        value="김영희"
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="s-createdAt"
                      >
                        최초입력일
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        id="s-createdAt"
                        value="2026/06/25"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row g-2 align-items-center mt-1">
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="s-updatedBy"
                      >
                        마지막수정자
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control bg-secondary-subtle"
                        id="s-updatedBy"
                        value=""
                        disabled
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="s-updatedAt"
                      >
                        마지막수정일
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control bg-secondary-subtle"
                        id="s-updatedAt"
                        value=""
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
              <span>MARC 레코드 뷰</span>
              <button
                className="btn btn-sm btn-light"
                data-bs-toggle="modal"
                data-bs-target="#modal008"
              >
                고정길이편집
              </button>
            </div>
            <div className="card-body p-0">
              <div
                className="form-control marc-textarea marc-record-view h-100 border-0 rounded-0 font-monospace bg-light"
                style={{
                  minHeight: "400px",
                }}
              >
                <div className="marc-line marc-line-data">
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
                  <span className="marc-tag">670</span>{" "}
                  <span className="marc-sf">$a</span>법률용어사전
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">680</span>{" "}
                  <span className="marc-sf">$a</span>이 표목은 법률상 의무가
                  있는 자가 행위를 하지 않음으로써 성립하는 법적 책임.
                  <span className="marc-eof">%</span>
                </div>
              </div>
            </div>
            <div className="card-footer bg-white d-flex justify-content-between">
              <div>
                <button className="btn btn-outline-secondary">이전</button>{" "}
                <button className="btn btn-outline-secondary">다음</button>{" "}
                <button
                  type="button"
                  className="btn btn-light-info ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalMarcSync"
                >
                  서지레코드 일관성 작업
                </button>
              </div>
              <div>
                <button className="btn btn-light-warning">중복조사</button>{" "}
                <button className="btn btn-primary">저장</button>{" "}
                <button className="btn btn-secondary">취소</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

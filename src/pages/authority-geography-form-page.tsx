export default function AuthorityGeographyFormPage() {
  return (
    <main
      id="main-content"
      className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
    >
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2 fw-bold">지리명 전거관리 - 입력/수정</h1>
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
                        <option>151 : 지리명</option>
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
                        지역구분
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
                        htmlFor="g-heading151"
                      >
                        채택표목
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        id="g-heading151"
                        value="울릉도[鬱陵島]"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="box-group border rounded p-3">
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="g-ref451"
                        >
                          참조표목(451)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="g-ref451"
                          value="무릉도[武陵島]"
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
                          참조표목(551)
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
                          htmlFor="g-source670"
                        >
                          정보원(670)
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group">
                          <textarea
                            className="form-control"
                            id="g-source670"
                            rows={2}
                          >
                            국토지리정보원 국가종합전자지도
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
                          htmlFor="g-note680"
                        >
                          일반주기(680)
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group">
                          <textarea
                            className="form-control"
                            id="g-note680"
                            rows={2}
                          >
                            경상북도 울릉군을 이루는 섬. 면적 72.56㎢, 인구 1만
                            426명(2000)이다.
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

                <div className="col-12">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="g-createdBy"
                      >
                        최초입력자
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        id="g-createdBy"
                        value="김영희"
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="g-createdAt"
                      >
                        최초입력일
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        id="g-createdAt"
                        value="2026/06/25"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row g-2 align-items-center mt-1">
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="g-updatedBy"
                      >
                        마지막수정자
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control bg-secondary-subtle"
                        id="g-updatedBy"
                        value=""
                        disabled
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="g-updatedAt"
                      >
                        마지막수정일
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control bg-secondary-subtle"
                        id="g-updatedAt"
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
                style={{ minHeight: "400px" }}
              >
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">151</span>{" "}
                  <span className="marc-sf">$a</span>울릉도[鬱陵島]
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">451</span>{" "}
                  <span className="marc-sf">$a</span>무릉도[武陵島]
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">451</span>{" "}
                  <span className="marc-sf">$a</span>원산우릉도[羽陵島]
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">551</span>{" "}
                  <span className="marc-sf">$w</span>a
                  <span className="marc-sf">$a</span>우산국[于山國]
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">551</span>{" "}
                  <span className="marc-sf">$w</span>g
                  <span className="marc-sf">$a</span>울릉[鬱陵]
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">670</span>{" "}
                  <span className="marc-sf">$a</span>국토지리정보원
                  국가종합전자지도<span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">680</span>{" "}
                  <span className="marc-sf">$i</span>경상북도 울릉군을 이루는
                  섬...<span className="marc-eof">%</span>
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

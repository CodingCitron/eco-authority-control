export default function AuthorityCorporationFormPage() {
  return (
    <main
      id="main-content"
      className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
    >
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
        <h1 className="h2 fw-bold">단체명 전거관리 - 입력/수정</h1>
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
                        <option>110 : 단체명</option>
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
                        htmlFor="c-heading"
                      >
                        채택표목
                      </label>
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        id="c-heading"
                        value="한국헌법재판소. 헌법재판연구원"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-2">
                      <label
                        className="form-label fw-bold mb-0 text-nowrap"
                        htmlFor="c-foundDate"
                      >
                        설립일/종료일
                      </label>
                    </div>
                    <div className="col">
                      <div className="input-group flex-nowrap">
                        <span className="input-group-text" aria-hidden="true">
                          설립일
                        </span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-foundDate"
                        >
                          설립일
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="c-foundDate"
                          value="20110101"
                        />
                        <span className="input-group-text" aria-hidden="true">
                          종료일
                        </span>
                        <label className="visually-hidden" htmlFor="c-endDate">
                          종료일
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="c-endDate"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="box-group border rounded p-3">
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="c-ref410"
                        >
                          참조표목(410)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-ref410"
                          value="憲法裁判所.憲法裁判硏究院"
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
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="c-roman"
                        >
                          원어명
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-roman"
                          value="Constitutional Court of Korea.Constitutional Research Institute"
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
                    <div className="row g-2 align-items-start">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="c-history665"
                        >
                          연혁참조(665)
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group">
                          <textarea
                            className="form-control"
                            id="c-history665"
                            rows={2}
                          >
                            2011년 1월 1일 헌법재판연구원 개원
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
                  <div className="box-group border rounded p-3">
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="c-orgType368"
                        >
                          단체유형(368)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-orgType368"
                          value="학술단체(연구소.연구단체)"
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
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="c-place370"
                        >
                          관련장소(370)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-place370"
                          value="서울 강남구"
                        />
                      </div>
                      <div className="col-auto d-flex align-items-center gap-1">
                        <span className="text-nowrap small text-muted">
                          관련일자
                        </span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-place370DateFrom"
                        >
                          관련장소 관련일자 시작
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="c-place370DateFrom"
                          style={{ width: "90px" }}
                          value="370 $s"
                        />
                        <span>~</span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-place370DateTo"
                        >
                          관련장소 관련일자 종료
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="c-place370DateTo"
                          style={{ width: "90px" }}
                          value="370 $t"
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
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="c-addrType371"
                        >
                          주소(371)
                        </label>
                      </div>
                      <div className="col-md-2">
                        <label
                          className="visually-hidden"
                          htmlFor="c-addrType371"
                        >
                          주소(371) 유형
                        </label>
                        <select
                          className="form-select form-select-sm"
                          id="c-addrType371"
                        >
                          <option>주소</option>
                          <option>전화</option>
                          <option>이메일</option>
                          <option>웹사이트</option>
                        </select>
                      </div>
                      <div className="col">
                        <label className="visually-hidden" htmlFor="c-addr371">
                          주소(371) 입력
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="c-addr371"
                          value=""
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
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="c-field372"
                        >
                          분야(372)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-field372"
                          value="법학[法學]"
                        />
                      </div>
                      <div className="col-auto d-flex align-items-center gap-1">
                        <span className="text-nowrap small text-muted">
                          관련일자
                        </span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-field372DateFrom"
                        >
                          분야 관련일자 시작
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="c-field372DateFrom"
                          style={{ width: "90px" }}
                          value="372 $s"
                        />
                        <span>~</span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-field372DateTo"
                        >
                          분야 관련일자 종료
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="c-field372DateTo"
                          style={{ width: "90px" }}
                          value="372 $t"
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
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="c-org373"
                        >
                          관련단체(373)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-org373"
                          value="헌법재판소"
                        />
                      </div>
                      <div className="col-auto d-flex align-items-center gap-1">
                        <span className="text-nowrap small text-muted">
                          관련일자
                        </span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-org373DateFrom"
                        >
                          관련단체 관련일자 시작
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="c-org373DateFrom"
                          style={{ width: "width:90px" }}
                          value="373 $s"
                        />
                        <span>~</span>
                        <label
                          className="visually-hidden"
                          htmlFor="c-org373DateTo"
                        >
                          관련단체 관련일자 종료
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="c-org373DateTo"
                          style={{ width: "width:90px" }}
                          value="373 $t"
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
                    <div className="row g-2 align-items-center mb-2">
                      <div className="col-md-2">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="c-lang377"
                        >
                          언어(377)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-lang377"
                          value="한국어"
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
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="c-source670"
                        >
                          정보원(670)
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          id="c-source670"
                          value="헌법 연구 자료"
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
                  <div className="row g-2 align-items-center">
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="c-createdBy"
                      >
                        최초입력자
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        id="c-createdBy"
                        value="김영희"
                        readOnly
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="c-createdAt"
                      >
                        최초입력일
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        id="c-createdAt"
                        value="2026/06/25"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="row g-2 align-items-center mt-1">
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="c-updatedBy"
                      >
                        마지막수정자
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control bg-secondary-subtle"
                        id="c-updatedBy"
                        value=""
                        disabled
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        className="form-label mb-0 fw-bold"
                        htmlFor="c-updatedAt"
                      >
                        마지막수정일
                      </label>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control bg-secondary-subtle"
                        id="c-updatedAt"
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
                style={{ minHeight: "200px" }}
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
                <div className="marc-line marc-line-control">
                  <span className="marc-tag">046</span>{" "}
                  <span className="marc-sf">$s</span>20110101
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">110</span>{" "}
                  <span className="marc-sf">$a</span>한국헌법재판소.
                  <span className="marc-sf">$b</span>헌법재판연구원
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">368</span>{" "}
                  <span className="marc-sf">$a</span>학술단체(연구소.연구단체)
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">370</span>{" "}
                  <span className="marc-sf">$a</span>서울 강남구{" "}
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">372</span>{" "}
                  <span className="marc-sf">$a</span>법학[法學]{" "}
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">372</span>{" "}
                  <span className="marc-sf">$a</span>헌법[憲法]{" "}
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">373</span>{" "}
                  <span className="marc-sf">$a</span>헌법재판소{" "}
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">377</span>{" "}
                  <span className="marc-sf">$i</span>한국어{" "}
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">410</span>{" "}
                  <span className="marc-sf">$a</span>憲法裁判所.{" "}
                  <span className="marc-sf">$b</span>憲法裁判硏究院
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">410</span>{" "}
                  <span className="marc-sf">$a</span>Constitutional Court of
                  Korea<span className="marc-sf">$b</span>Constitutional
                  Research Institute<span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">510</span>{" "}
                  <span className="marc-sf">$w</span>a
                  <span className="marc-sf">$a</span>한국.{" "}
                  <span className="marc-sf">$b</span>OOOOOO
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">510</span>{" "}
                  <span className="marc-sf">$w</span>b
                  <span className="marc-sf">$a</span>한국.{" "}
                  <span className="marc-sf">$b</span>OOOOOO
                  <span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">665</span>{" "}
                  <span className="marc-sf">$a</span>2011년 1월 1일
                  헌법재판연구원 개원<span className="marc-eof">%</span>
                </div>
                <div className="marc-line marc-line-data">
                  <span className="marc-tag">670</span>{" "}
                  <span className="marc-sf">$a</span>헌법 연구 자료
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

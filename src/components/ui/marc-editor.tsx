import { AuthorityFixedFieldEditButton } from "./authority-fixed-field-edit-modal";

export default function MarcEditor({ fontSize }: { fontSize: string }) {
  return (
    <>
      <div className="card shadow-sm h-100">
        <div className="card-header bg-dark text-white fw-bold d-flex justify-content-between align-items-center">
          <span>MARC 레코드 뷰</span>
          <div>
            <button>토글</button>
            <AuthorityFixedFieldEditButton />
          </div>
        </div>
        <div className="card-body p-0">
          <div
            className="form-control marc-textarea marc-record-view h-100 border-0 rounded-0 font-monospace bg-light"
            style={{ minHeight: "200px", fontSize }}
          >
            <div className="marc-line marc-line-control">
              <span className="marc-tag">001</span> KAC201206266
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
              <span className="marc-sf">$f</span>1902
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">100</span> 1
              <span className="marc-sf">$a</span>김소월,
              <span className="marc-sf">$g</span>金素月,
              <span className="marc-sf">$d</span>1902-1934
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">370</span>{" "}
              <span className="marc-sf">$c</span>한국(국명)[韓國]{" "}
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">370</span>{" "}
              <span className="marc-sf">$a</span>평안북도 구성
              <span className="marc-sf">$b</span>평안북도 곽산
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">372</span>{" "}
              <span className="marc-sf">$a</span>한국 시[韓國時]{" "}
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">372</span>{" "}
              <span className="marc-sf">$a</span>문학(예술)[문학]{" "}
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">373</span>{" "}
              <span className="marc-sf">$a</span>동아일보 정주지국(설립자){" "}
              <span className="marc-sf">$s</span>1926
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">374</span>{" "}
              <span className="marc-sf">$a</span>작가(사람)[作家]{" "}
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">375</span>{" "}
              <span className="marc-sf">$a</span>남성
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">377</span>{" "}
              <span className="marc-sf">$i</span>한국어
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">400</span>{" "}
              <span className="marc-sf">$a</span>소월,{" "}
              <span className="marc-sf">$g</span>素月,{" "}
              <span className="marc-sf">$d</span>1902-1934
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">400</span>{" "}
              <span className="marc-sf">$a</span>김정식,{" "}
              <span className="marc-sf">$g</span>金廷湜,{" "}
              <span className="marc-sf">$d</span>1902-1934
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">400</span>{" "}
              <span className="marc-sf">$a</span>KIM,Sowol,{" "}
              <span className="marc-sf">$d</span>1902-1934
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">670</span>{" "}
              <span className="marc-sf">$a</span>
              진달래꽃,(Human&amp;Books),2011
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">670</span>{" "}
              <span className="marc-sf">$a</span>김소월 시집,(스타북스),2018
              <span className="marc-eof">%</span>
            </div>
            <div className="marc-line marc-line-data">
              <span className="marc-tag">678</span>{" "}
              <span className="marc-sf">$a</span>시인;
              <span className="marc-sf">$a</span>1920년 등단
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
    </>
  );
}

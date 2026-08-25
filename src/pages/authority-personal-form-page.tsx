//  개인명 등록/수정
import { useState } from "react";
import { useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";

import { fetchAuthorityCreate } from "@/api/authority-create";

import { useAuthorityDetail } from "@/hooks/use-authority-detail";
import MarcFontSizeSelect, {
  defaultFontSize,
} from "@/components/ui/marc-font-size-select";
import MarcEditor from "@/components/ui/marc-editor";
import MarcEditorProvider from "@/components/ui/marc-editor-provider";
import type { MarcField } from "@/components/ui/marc-editor-context";

export type AuthorityPersonalFormMode = "create" | "edit";

interface AuthorityPersonalFormPageProps {
  mode: AuthorityPersonalFormMode;
}

export default function AuthorityPersonalFormPage({
  mode,
}: AuthorityPersonalFormPageProps) {
  const [fontSize, setFontSize] = useState(defaultFontSize);

  const [searchParams] = useSearchParams();
  const isCreatePage = mode === "create";

  // 등록은 대상 레코드가 없고, 수정은 하나 또는 여러 recKey
  const recordKeys = isCreatePage
    ? []
    : parseRecordKeys(
        searchParams.get("recKeys") ?? searchParams.get("recKey"),
      );
  const currentRecordKey = isCreatePage
    ? undefined
    : (searchParams.get("current") ?? recordKeys[0]);
  const currentRecordIndex = currentRecordKey
    ? recordKeys.indexOf(currentRecordKey)
    : -1;

  const { data: authorityDetail } = useAuthorityDetail(currentRecordKey ?? "");
  const initialMarcFields: MarcField[] | undefined = authorityDetail
    ? [
        ...authorityDetail.data.record.control_fields.map((field) => ({
          type: "control" as const,
          tag: field.tag,
          value: field.value,
        })),
        ...authorityDetail.data.record.data_fields.map((field) => ({
          type: "data" as const,
          tag: field.tag,
          indicator1: field.ind1,
          indicator2: field.ind2,
          subfields: field.subfields,
        })),
      ]
    : undefined;

  // 전거 추가
  const { mutate } = useMutation({
    mutationFn: fetchAuthorityCreate,
  });

  // 전거 수정

  return (
    <MarcEditorProvider
      initialFields={initialMarcFields}
      key={`${authorityDetail ? "record" : "loading"}-${currentRecordKey ?? "create"}`}
    >
      <main
        id="main-content"
        className="col-md-9 ms-sm-auto col-lg-10 px-md-4 pt-4 pb-5 min-vh-100"
      >
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2 fw-bold">
            개인명 전거관리 - {isCreatePage ? "입력" : "수정"}
          </h1>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-primary">서지 목록보기</button>
            <button className="btn btn-sm btn-secondary">화면 초기화</button>
            <label htmlFor="fontSizeSelect" className="visually-hidden">
              글자크기
            </label>
            <MarcFontSizeSelect
              aria-label="주자료 글자크기"
              value={fontSize}
              onChange={setFontSize}
              className="form-select-sm w-auto"
            />
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
                          <option>100 : 개인명</option>
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
                          htmlFor="fldHeading"
                        >
                          채택표목
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group flex-nowrap">
                          <input
                            type="text"
                            className="form-control"
                            id="fldHeading"
                            value="김소월"
                          />
                          <span className="input-group-text" aria-hidden="true">
                            한자명
                          </span>
                          <label className="visually-hidden" htmlFor="p-hanja">
                            한자명
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="p-hanja"
                            value="金素月"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row g-2 align-items-center">
                      <div className="col-md-2">
                        <label
                          className="form-label fw-bold mb-0 text-nowrap"
                          htmlFor="p-birthDate"
                        >
                          생몰년
                        </label>
                      </div>
                      <div className="col">
                        <div className="input-group flex-nowrap">
                          <span className="input-group-text" aria-hidden="true">
                            출생일
                          </span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-birthDate"
                          >
                            출생일
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="p-birthDate"
                            value="1902"
                          />
                          <span className="input-group-text" aria-hidden="true">
                            사망일
                          </span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-deathDate"
                          >
                            사망일
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="p-deathDate"
                            value="1934"
                          />
                          <div className="input-group-text text-nowrap">
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              id="birthdatePrivate"
                            />{" "}
                            <label htmlFor="birthdatePrivate">비공개</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="box-group border rounded p-3">
                      <div className="row g-2 align-items-center mb-2">
                        <div className="col-md-2">
                          <label
                            className="form-label fw-bold mb-0"
                            htmlFor="p-ref400"
                          >
                            참조표목(400)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-ref400"
                            value="김정식(400 $a)"
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
                            className="form-label mb-0"
                            htmlFor="p-ref400hanja"
                          >
                            한자명
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-ref400hanja"
                            value="金廷湜(400 $g)"
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
                            className="form-label mb-0"
                            htmlFor="p-ref400roman"
                          >
                            원어명
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-ref400roman"
                            value="KIM, Sowol(400 $a)"
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
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-placeType370"
                          >
                            관련장소(370)
                          </label>
                        </div>
                        <div className="col-md-2">
                          <label
                            className="visually-hidden"
                            htmlFor="p-placeType370"
                          >
                            관련장소(370) 유형
                          </label>
                          <select
                            className="form-select form-select-sm"
                            id="p-placeType370"
                          >
                            <option>출생지</option>
                            <option>사망지</option>
                            <option>활동지</option>
                            <option>거주지</option>
                          </select>
                        </div>
                        <div className="col">
                          <label
                            className="visually-hidden"
                            htmlFor="p-place370"
                          >
                            관련장소(370) 입력
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="p-place370"
                            value="평안북도 구성(370$a)"
                          />
                        </div>
                        <div className="col-auto d-flex align-items-center gap-1">
                          <span className="text-nowrap small text-muted">
                            관련일자
                          </span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-place370DateFrom"
                          >
                            관련장소 관련일자 시작
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-place370DateFrom"
                            style={{ width: "90px" }}
                            value="370 $s"
                          />
                          <span>~</span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-place370DateTo"
                          >
                            관련장소 관련일자 종료
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-place370DateTo"
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
                      <div className="row g-2 align-items-center">
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-addrType371"
                          >
                            주소(371)
                          </label>
                        </div>
                        <div className="col-md-2">
                          <label
                            className="visually-hidden"
                            htmlFor="p-addrType371"
                          >
                            주소(371) 유형
                          </label>
                          <select
                            className="form-select form-select-sm"
                            id="p-addrType371"
                          >
                            <option value="a">주소($a)</option>
                            <option value="b">도시($b)</option>
                            <option value="d">국가($d)</option>
                            <option value="e">우편번호($e)</option>
                            <option value="m">이메일($m)</option>
                          </select>
                        </div>
                        <div className="col">
                          <label
                            className="visually-hidden"
                            htmlFor="p-addr371"
                          >
                            주소(371) 입력
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="p-addr371"
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
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="box-group border rounded p-3">
                      <div className="row g-2 align-items-center mb-2">
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-field372"
                          >
                            분야(372)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-field372"
                            value="한국 시[韓國 時]($a)"
                          />
                        </div>
                        <div className="col-auto d-flex align-items-center gap-1">
                          <span className="text-nowrap small text-muted">
                            관련일자
                          </span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-field372DateFrom"
                          >
                            분야 관련일자 시작
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-field372DateFrom"
                            style={{ width: "90px" }}
                            value="372 $s"
                          />
                          <span>~</span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-field372DateTo"
                          >
                            분야 관련일자 종료
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-field372DateTo"
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
                            htmlFor="p-org373"
                          >
                            단체(373)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-org373"
                            value="동아일보 정주지국(설립자)($a)"
                          />
                        </div>
                        <div className="col-auto d-flex align-items-center gap-1">
                          <span className="text-nowrap small text-muted">
                            관련일자
                          </span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-org373DateFrom"
                          >
                            단체 관련일자 시작
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-org373DateFrom"
                            style={{ width: "90px" }}
                            value="373 $s"
                          />
                          <span>~</span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-org373DateTo"
                          >
                            단체 관련일자 종료
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-org373DateTo"
                            style={{ width: "90px" }}
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
                            htmlFor="p-job374"
                          >
                            직업(374)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-job374"
                            value="작가(사람)[作家]($a)"
                          />
                        </div>
                        <div className="col-auto d-flex align-items-center gap-1">
                          <span className="text-nowrap small text-muted">
                            관련일자
                          </span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-job374DateFrom"
                          >
                            직업 관련일자 시작
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-job374DateFrom"
                            style={{ width: "90px" }}
                            value="374 $s"
                          />
                          <span>~</span>
                          <label
                            className="visually-hidden"
                            htmlFor="p-job374DateTo"
                          >
                            직업 관련일자 종료
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="p-job374DateTo"
                            style={{ width: "90px" }}
                            value="374 $t"
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
                            htmlFor="gender_unknown"
                          >
                            성별(375)
                          </label>
                        </div>
                        <div className="col-md-auto d-flex align-items-center gap-3">
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="gender_unknown"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gender_unknown"
                            >
                              모름
                            </label>
                          </div>
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="gender_male"
                              checked
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gender_male"
                            >
                              남성
                            </label>
                          </div>
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              id="gender_female"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="gender_female"
                            >
                              여성
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row g-2 align-items-center mb-2">
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-lang377"
                          >
                            관련언어(377)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-lang377"
                            value="한국어($i)"
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
                            htmlFor="p-historyVis"
                          >
                            이력사항 공개구분(368)
                          </label>
                        </div>
                        <div className="col-md-3">
                          <select
                            className="form-select form-select-sm"
                            id="p-historyVis"
                          >
                            <option value="e">외부(공개)</option>
                            <option value="i" selected>
                              내부(비공개)
                            </option>
                          </select>
                        </div>
                        <div className="col-auto">
                          <span className="badge text-bg-primary fw-light">
                            전거관리시스템 전용 · 홈페이지/반출 시 제거
                          </span>
                        </div>
                      </div>
                      <div className="row g-2 align-items-center mb-2">
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-edu667"
                          >
                            학력(667)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-edu667"
                            placeholder="$a"
                          />
                        </div>
                      </div>
                      <div className="row g-2 align-items-center mb-2">
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-bio678"
                          >
                            전기(678)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-bio678"
                            value="시인; 1920년 등단($a;$a로 반복)"
                          />
                        </div>
                      </div>
                      <div className="row g-2 align-items-center">
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="p-source670"
                          >
                            정보원(670)
                          </label>
                        </div>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            id="p-source670"
                            value="진달래꽃.(Human & Books).2011"
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
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold">저작권 포괄동의 관리</span>
                        <span className="badge text-bg-primary fw-light">
                          전거관리시스템 전용 · 홈페이지/반출 시 제거
                        </span>
                      </div>
                      <div className="row g-2 align-items-center">
                        <div className="col-md-3">
                          <div className="form-check mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="copyrightConsent"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="copyrightConsent"
                            >
                              포괄동의여부
                            </label>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <label
                            className="form-label mb-0 fw-bold"
                            htmlFor="copyrightConsentDate"
                          >
                            동의일시
                          </label>
                        </div>
                        <div className="col-md-4">
                          <input
                            type="datetime-local"
                            className="form-control"
                            id="copyrightConsentDate"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="row g-2 align-items-center">
                      <div className="col-md-3">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="p-createdBy"
                        >
                          최초입력자
                        </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          id="p-createdBy"
                          value="김영희"
                          readOnly
                        />
                      </div>
                      <div className="col-md-3">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="p-createdAt"
                        >
                          최초입력일
                        </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          id="p-createdAt"
                          value="2026/06/25"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="row g-2 align-items-center mt-1">
                      <div className="col-md-3">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="p-updatedBy"
                        >
                          마지막수정자
                        </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control bg-secondary-subtle"
                          id="p-updatedBy"
                          value=""
                          disabled
                        />
                      </div>
                      <div className="col-md-3">
                        <label
                          className="form-label mb-0 fw-bold"
                          htmlFor="p-updatedAt"
                        >
                          마지막수정일
                        </label>
                      </div>
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control bg-secondary-subtle"
                          id="p-updatedAt"
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
            <MarcEditor fontSize={`${fontSize}px`} />
          </div>
        </div>
      </main>
    </MarcEditorProvider>
  );
}

function parseRecordKeys(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return [
    ...new Set(
      value
        .split(",")
        .map((key) => key.trim())
        .filter(Boolean),
    ),
  ];
}

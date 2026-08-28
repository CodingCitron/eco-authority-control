import { useEffect, type ReactNode } from "react";
import {
  useForm,
  useWatch,
  type FieldPathByValue,
  type UseFormRegister,
} from "react-hook-form";
import { useMarcEditor } from "@/components/ui/marc-editor-context";

import {
  addPersonalFormValuesToMarcFields,
  createEmptyPersonalAuthorityFormValues,
  mapPersonalFormValuesToAuthorityCreateMetadata,
  type PersonalMarcAddTarget,
  type PersonalAuthorityFormValues,
} from "./personal-form.mapper";

type TextFieldName = FieldPathByValue<PersonalAuthorityFormValues, string>;

interface AuthorityPersonalFormProps {
  /** 수정 화면에서는 상세 조회 데이터를 변환한 값을 전달한다. */
  initialValues?: PersonalAuthorityFormValues;
  onSubmit?: (values: PersonalAuthorityFormValues) => void;
}

export default function AuthorityPersonalForm({
  initialValues,
  onSubmit,
}: AuthorityPersonalFormProps) {
  const { register, handleSubmit, getValues, control } =
    useForm<PersonalAuthorityFormValues>({
      defaultValues: initialValues ?? createEmptyPersonalAuthorityFormValues(),
    });
  const { setVariableFields, setAuthorityCreateMetadata } = useMarcEditor();
  const [region, biographyPrivateYn, copyrightConsent, copyrightConsentDate] =
    useWatch({
      control,
      name: [
        "region",
        "biographyPrivateYn",
        "copyrightConsent",
        "copyrightConsentDate",
      ],
    });

  const addToMarcRecord = (target: PersonalMarcAddTarget) => {
    const values = getValues();

    setVariableFields((fields) => {
      return addPersonalFormValuesToMarcFields(fields, target, values);
    });
  };

  // 에디터의 저장 버튼에서도 왼쪽 입력 폼의 API 메타데이터를 사용할 수 있게 한다.
  useEffect(() => {
    setAuthorityCreateMetadata(
      mapPersonalFormValuesToAuthorityCreateMetadata({
        region,
        biographyPrivateYn,
        copyrightConsent,
        copyrightConsentDate,
      }),
    );
  }, [
    biographyPrivateYn,
    copyrightConsent,
    copyrightConsentDate,
    region,
    setAuthorityCreateMetadata,
  ]);

  return (
    <div className="col-lg-7">
      <div className="card marc-form shadow-sm mb-4">
        <div className="card-body">
          <form
            className="row g-2 form-sm"
            onSubmit={handleSubmit((values) => onSubmit?.(values))}
          >
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
                  <select
                    className="form-select"
                    id="fldIndicator"
                    {...register("authorityType")}
                  >
                    <option value="">선택</option>
                    <option value="100">100 : 개인명</option>
                    {initialValues?.authorityType &&
                      initialValues.authorityType !== "100" && (
                        <option value={initialValues.authorityType}>
                          {initialValues.authorityType}
                        </option>
                      )}
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
                  <select
                    className="form-select"
                    id="fldRegion"
                    {...register("region")}
                  >
                    <option value="">선택</option>
                    <option value="1">1 : 한국</option>
                    {initialValues?.region && initialValues.region !== "1" && (
                      <option value={initialValues.region}>
                        {initialValues.region}
                      </option>
                    )}
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
                    채택표목(100)
                  </label>
                </div>
                <div className="col">
                  <div className="input-group flex-nowrap">
                    <input
                      type="text"
                      className="form-control"
                      id="fldHeading"
                      {...register("heading")}
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
                      {...register("hanjaName")}
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
                    생몰년(100)
                  </label>
                </div>
                <div className="col">
                  <div className="input-group flex-nowrap">
                    <span className="input-group-text" aria-hidden="true">
                      출생일
                    </span>
                    <label className="visually-hidden" htmlFor="p-birthDate">
                      출생일
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="p-birthDate"
                      {...register("birthDate")}
                    />
                    <span className="input-group-text" aria-hidden="true">
                      사망일
                    </span>
                    <label className="visually-hidden" htmlFor="p-deathDate">
                      사망일
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="p-deathDate"
                      {...register("deathDate")}
                    />
                    <div className="input-group-text text-nowrap">
                      <input
                        className="form-check-input mt-0"
                        type="checkbox"
                        id="birthdatePrivate"
                        {...register("birthdatePrivate")}
                      />{" "}
                      <label htmlFor="birthdatePrivate">비공개</label>
                    </div>
                  </div>
                </div>
                <AddButton
                  ariaLabel="채택표목 및 생몰년(100) 추가"
                  onClick={() => addToMarcRecord("heading")}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="box-group border rounded p-3">
                <SimpleInputRow
                  id="p-ref400"
                  label="참조표목(400)"
                  name="referenceHeading"
                  register={register}
                  bold
                  showAdd={false}
                />
                <SimpleInputRow
                  id="p-ref400hanja"
                  label="한자명(400)"
                  name="referenceHanja"
                  register={register}
                  addTarget="references"
                  addAriaLabel="참조표목(400) 추가"
                  onAdd={addToMarcRecord}
                />
                <SimpleInputRow
                  id="p-ref400roman"
                  label="원어명(400)"
                  name="referenceOriginalName"
                  register={register}
                  addTarget="referenceOriginalName"
                  onAdd={addToMarcRecord}
                  last
                />
              </div>
            </div>

            <div className="col-12">
              <div className="box-group border rounded p-3">
                <SimpleInputRow
                  id="p-other368"
                  label="기타속성(368)"
                  name="otherAttribute"
                  register={register}
                  addTarget="otherAttribute"
                  onAdd={addToMarcRecord}
                  bold
                />
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
                    <label className="visually-hidden" htmlFor="p-placeType370">
                      관련장소(370) 유형
                    </label>
                    <select
                      className="form-select form-select-sm"
                      id="p-placeType370"
                      {...register("placeType")}
                    >
                      <option value="">선택</option>
                      <option value="birth">출생지</option>
                      <option value="death">사망지</option>
                      <option value="activity">활동지</option>
                      <option value="residence">거주지</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="visually-hidden" htmlFor="p-place370">
                      관련장소(370) 입력
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="p-place370"
                      {...register("place")}
                    />
                  </div>
                  <DateRangeInputs
                    idPrefix="p-place370"
                    label="관련장소 관련일자"
                    fromName="placeDateFrom"
                    toName="placeDateTo"
                    register={register}
                  />
                  <AddButton
                    ariaLabel="관련장소 추가"
                    onClick={() => addToMarcRecord("place")}
                  />
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
                    <label className="visually-hidden" htmlFor="p-addrType371">
                      주소(371) 유형
                    </label>
                    <select
                      className="form-select form-select-sm"
                      id="p-addrType371"
                      {...register("addressType")}
                    >
                      <option value="">선택</option>
                      <option value="a">주소($a)</option>
                      <option value="b">도시($b)</option>
                      <option value="d">국가($d)</option>
                      <option value="e">우편번호($e)</option>
                      <option value="m">이메일($m)</option>
                    </select>
                  </div>
                  <div className="col">
                    <label className="visually-hidden" htmlFor="p-addr371">
                      주소(371) 입력
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="p-addr371"
                      {...register("address")}
                    />
                  </div>
                  <AddButton
                    ariaLabel="주소 추가"
                    onClick={() => addToMarcRecord("address")}
                  />
                </div>
              </div>
            </div>

            <Outline>
              <RelatedDateRow
                idPrefix="p-field372"
                label="분야(372)"
                valueName="activityField"
                fromName="activityFieldDateFrom"
                toName="activityFieldDateTo"
                register={register}
                addTarget="activityField"
                onAdd={addToMarcRecord}
              />
              <RelatedDateRow
                idPrefix="p-org373"
                label="단체(373)"
                valueName="organization"
                fromName="organizationDateFrom"
                toName="organizationDateTo"
                register={register}
                addTarget="organization"
                onAdd={addToMarcRecord}
              />
              <RelatedDateRow
                idPrefix="p-job374"
                label="직업(374)"
                valueName="occupation"
                fromName="occupationDateFrom"
                toName="occupationDateTo"
                register={register}
                addTarget="occupation"
                onAdd={addToMarcRecord}
              />

              <div className="row g-2 align-items-center mb-2">
                <div className="col-md-2">
                  <span className="form-label mb-0 fw-bold">성별(375)</span>
                </div>
                <div className="col d-flex align-items-center gap-3">
                  {[
                    ["unknown", "모름"],
                    ["male", "남성"],
                    ["female", "여성"],
                  ].map(([value, label]) => (
                    <div className="form-check mb-0" key={value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`gender_${value}`}
                        value={value}
                        {...register("gender")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`gender_${value}`}
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
                <AddButton
                  ariaLabel="성별(375) 추가"
                  onClick={() => addToMarcRecord("gender")}
                />
              </div>

              <SimpleInputRow
                id="p-lang377"
                label="관련언어(377)"
                name="language"
                register={register}
                addTarget="language"
                onAdd={addToMarcRecord}
                bold
              />

              <SimpleInputRow
                id="p-edu667"
                label="학력(667)"
                name="education"
                register={register}
                // placeholder="$a"
                addTarget="education"
                onAdd={addToMarcRecord}
                bold
              />
              <SimpleInputRow
                id="p-bio678"
                label="전기(678)"
                name="biography"
                register={register}
                addTarget="biography"
                onAdd={addToMarcRecord}
                bold
              />
              <SimpleInputRow
                id="p-source670"
                label="정보원(670)"
                name="source"
                register={register}
                addTarget="source"
                onAdd={addToMarcRecord}
                bold
                last
              />
              <div className="row g-2 align-items-center mb-2">
                <div className="col-md-2">
                  <label
                    className="form-label mb-0 fw-bold"
                    htmlFor="p-historyVis"
                  >
                    이력사항 공개구분
                  </label>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-select-sm"
                    id="p-historyVis"
                    {...register("biographyPrivateYn")}
                  >
                    <option value="">선택</option>
                    <option value="N">외부(공개)</option>
                    <option value="Y">내부(비공개)</option>
                  </select>
                </div>
                <div className="col-auto">
                  <span className="badge text-bg-primary fw-light">
                    전거관리시스템 전용 · 홈페이지/반출 시 제거
                  </span>
                </div>
              </div>
            </Outline>

            <div className="col-12">
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
                      {...register("copyrightConsent")}
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
                    {...register("copyrightConsentDate")}
                  />
                </div>
              </div>
            </div>

            <AuditFields register={register} />
          </form>
        </div>
      </div>
    </div>
  );
}

interface RegisteredFieldProps {
  register: UseFormRegister<PersonalAuthorityFormValues>;
}

interface SimpleInputRowProps extends RegisteredFieldProps {
  id: string;
  label: string;
  name: TextFieldName;
  bold?: boolean;
  last?: boolean;
  placeholder?: string;
  showAdd?: boolean;
  addAriaLabel?: string;
  addTarget?: PersonalMarcAddTarget;
  onAdd?: (target: PersonalMarcAddTarget) => void;
}

function SimpleInputRow({
  id,
  label,
  name,
  register,
  bold = false,
  last = false,
  placeholder,
  showAdd = true,
  addAriaLabel,
  addTarget,
  onAdd,
}: SimpleInputRowProps) {
  return (
    <div className={`row g-2 align-items-center${last ? "" : " mb-2"}`}>
      <div className="col-md-2">
        <label
          className={`form-label mb-0${bold ? " fw-bold" : ""}`}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
      <div className="col">
        <input
          type="text"
          className="form-control"
          id={id}
          placeholder={placeholder}
          {...register(name)}
        />
      </div>
      {showAdd && addTarget && onAdd && (
        <AddButton
          ariaLabel={addAriaLabel ?? `${label} 추가`}
          onClick={() => onAdd(addTarget)}
        />
      )}
    </div>
  );
}

interface DateRangeInputsProps extends RegisteredFieldProps {
  idPrefix: string;
  label: string;
  fromName: TextFieldName;
  toName: TextFieldName;
}

function DateRangeInputs({
  idPrefix,
  label,
  fromName,
  toName,
  register,
}: DateRangeInputsProps) {
  return (
    <div className="col-auto d-flex align-items-center gap-1">
      <span className="text-nowrap small text-muted">관련일자</span>
      <label className="visually-hidden" htmlFor={`${idPrefix}DateFrom`}>
        {label} 시작
      </label>
      <input
        type="text"
        className="form-control form-control-sm"
        id={`${idPrefix}DateFrom`}
        style={{ width: "90px" }}
        {...register(fromName)}
      />
      <span>~</span>
      <label className="visually-hidden" htmlFor={`${idPrefix}DateTo`}>
        {label} 종료
      </label>
      <input
        type="text"
        className="form-control form-control-sm"
        id={`${idPrefix}DateTo`}
        style={{ width: "90px" }}
        {...register(toName)}
      />
    </div>
  );
}

interface RelatedDateRowProps extends DateRangeInputsProps {
  valueName: TextFieldName;
  addTarget: PersonalMarcAddTarget;
  onAdd: (target: PersonalMarcAddTarget) => void;
}

function RelatedDateRow({
  idPrefix,
  label,
  valueName,
  fromName,
  toName,
  register,
  addTarget,
  onAdd,
}: RelatedDateRowProps) {
  return (
    <div className="row g-2 align-items-center mb-2">
      <div className="col-md-2">
        <label className="form-label mb-0 fw-bold" htmlFor={idPrefix}>
          {label}
        </label>
      </div>
      <div className="col">
        <input
          type="text"
          className="form-control"
          id={idPrefix}
          {...register(valueName)}
        />
      </div>
      <DateRangeInputs
        idPrefix={idPrefix}
        label={`${label} 관련일자`}
        fromName={fromName}
        toName={toName}
        register={register}
      />
      <AddButton ariaLabel={`${label} 추가`} onClick={() => onAdd(addTarget)} />
    </div>
  );
}

function AddButton({
  ariaLabel,
  onClick,
}: {
  ariaLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="col-auto">
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        aria-label={ariaLabel}
        onClick={onClick}
      >
        추가
      </button>
    </div>
  );
}

function AuditFields({ register }: RegisteredFieldProps) {
  return (
    <div className="col-12">
      <div className="row g-2 align-items-center">
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="p-createdBy">
            최초입력자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="p-createdBy"
            readOnly
            {...register("createdBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="p-createdAt">
            최초입력일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="p-createdAt"
            readOnly
            {...register("createdAt")}
          />
        </div>
      </div>
      <div className="row g-2 align-items-center mt-1">
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="p-updatedBy">
            마지막수정자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control bg-secondary-subtle"
            id="p-updatedBy"
            readOnly
            {...register("updatedBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="p-updatedAt">
            마지막수정일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control bg-secondary-subtle"
            id="p-updatedAt"
            readOnly
            {...register("updatedAt")}
          />
        </div>
      </div>
    </div>
  );
}

function Outline({ children }: { children: ReactNode }) {
  return (
    <div className="col-12">
      <div className="box-group border rounded p-3">{children}</div>
    </div>
  );
}

import { useEffect, type ReactNode } from "react";
import {
  useForm,
  useWatch,
  type FieldPathByValue,
  type UseFormRegister,
} from "react-hook-form";

import AuthorityRegionSelect from "@/components/ui/authority-region-select";
import { useMarcEditor } from "@/components/ui/marc-editor-context";

import {
  addCorporationFormValuesToMarcFields,
  createEmptyCorporationAuthorityFormValues,
  type CorporationAuthorityFormValues,
  type CorporationMarcAddTarget,
} from "./corporation-form.mapper";
import { AuthorityReferenceHeadingSearchButton } from "../ui/authority-reference-heading-search-modal";

type TextFieldName = FieldPathByValue<CorporationAuthorityFormValues, string>;

export default function AuthorityCorporationForm({
  initialValues,
}: {
  initialValues?: CorporationAuthorityFormValues;
}) {
  const { register, getValues, control } =
    useForm<CorporationAuthorityFormValues>({
      defaultValues:
        initialValues ?? createEmptyCorporationAuthorityFormValues(),
    });
  const { setVariableFields, setAuthorityCreateMetadata } = useMarcEditor();
  const region = useWatch({ control, name: "region" });

  const addToMarcRecord = (target: CorporationMarcAddTarget) => {
    const values = getValues();
    setVariableFields((fields) =>
      addCorporationFormValuesToMarcFields(fields, target, values),
    );
  };

  useEffect(() => {
    setAuthorityCreateMetadata({
      acRegionCode: region.trim(),
      biographyPrivateYn: "N",
      copyrightBlanketAgreeYn: "N",
    });
  }, [region, setAuthorityCreateMetadata]);

  return (
    <div className="col-lg-7">
      <div className="card marc-form shadow-sm mb-4">
        <div className="card-body">
          <form
            className="row g-2 form-sm"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="col-md-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label
                    className="form-label fw-bold mb-0 text-nowrap"
                    htmlFor="c-indicator"
                  >
                    전거표시기호
                  </label>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    id="c-indicator"
                    {...register("authorityType")}
                  >
                    <option value="110">110 : 단체명</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label
                    className="form-label fw-bold mb-0 text-nowrap"
                    htmlFor="c-region"
                  >
                    전거지역구분
                  </label>
                </div>
                <div className="col">
                  <AuthorityRegionSelect
                    id="c-region"
                    fallbackValue={initialValues?.region}
                    excludeAllOption
                    {...register("region")}
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <SimpleInputRow
                id="c-heading"
                label="채택표목(110)"
                name="heading"
                register={register}
                addTarget="heading"
                onAdd={addToMarcRecord}
                bold
                last
              />
            </div>

            <div className="col-12">
              <div className="row g-2 align-items-center">
                <div className="col-md-2">
                  <label
                    className="form-label fw-bold mb-0 text-nowrap"
                    htmlFor="c-established-date"
                  >
                    설립일/종료일(046)
                  </label>
                </div>
                <div className="col">
                  <div className="input-group flex-nowrap">
                    <span className="input-group-text" aria-hidden="true">
                      설립일
                    </span>
                    <label
                      className="visually-hidden"
                      htmlFor="c-established-date"
                    >
                      설립일
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="c-established-date"
                      {...register("establishedDate")}
                    />
                    <span className="input-group-text" aria-hidden="true">
                      종료일
                    </span>
                    <label className="visually-hidden" htmlFor="c-ended-date">
                      종료일
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="c-ended-date"
                      {...register("endedDate")}
                    />
                  </div>
                </div>
                <AddButton
                  ariaLabel="설립일/종료일(046) 추가"
                  onClick={() => addToMarcRecord("establishmentDates")}
                />
              </div>
            </div>

            <Outline>
              <SimpleInputRow
                id="c-reference-heading"
                label="참조표목(410)"
                name="referenceHeading"
                register={register}
                addTarget="referenceHeading"
                onAdd={addToMarcRecord}
                bold
              />
              <SimpleInputRow
                id="c-original-name"
                label="원어명(410)"
                name="originalName"
                register={register}
                addTarget="originalName"
                onAdd={addToMarcRecord}
                bold
                last
              />
            </Outline>

            <Outline>
              <div className="row g-2 align-items-center mb-2">
                <div className="col-md-2">
                  <span className="form-label fw-bold mb-0 text-nowrap">
                    참조표목(551)
                  </span>
                </div>
                <div className="col">
                  <AuthorityReferenceHeadingSearchButton />
                </div>
              </div>
              <div className="row g-2 align-items-start">
                <div className="col-md-2">
                  <label
                    className="form-label fw-bold mb-0 text-nowrap"
                    htmlFor="c-history"
                  >
                    연혁참조(665)
                  </label>
                </div>
                <div className="col">
                  <textarea
                    className="form-control"
                    id="c-history"
                    rows={2}
                    {...register("history")}
                  />
                </div>
                <AddButton
                  ariaLabel="연혁참조(665) 추가"
                  onClick={() => addToMarcRecord("history")}
                />
              </div>
            </Outline>

            <Outline>
              <SimpleInputRow
                id="c-corporate-type"
                label="단체유형(368)"
                name="corporateType"
                register={register}
                addTarget="corporateType"
                onAdd={addToMarcRecord}
                bold
              />
              <RelatedDateRow
                idPrefix="c-place"
                label="관련장소(370)"
                valueName="place"
                fromName="placeDateFrom"
                toName="placeDateTo"
                register={register}
                addTarget="place"
                onAdd={addToMarcRecord}
              />

              <div className="row g-2 align-items-center mb-2">
                <div className="col-md-2">
                  <label
                    className="form-label mb-0 fw-bold"
                    htmlFor="c-address-type"
                  >
                    주소(371)
                  </label>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select form-select-sm"
                    id="c-address-type"
                    aria-label="주소(371) 유형"
                    {...register("addressType")}
                  >
                    <option value="">선택</option>
                    <option value="address">주소</option>
                    <option value="phone">전화</option>
                    <option value="email">이메일</option>
                    <option value="website">웹사이트</option>
                  </select>
                </div>
                <div className="col">
                  <label className="visually-hidden" htmlFor="c-address">
                    주소(371) 입력
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="c-address"
                    {...register("address")}
                  />
                </div>
                <AddButton
                  ariaLabel="주소(371) 추가"
                  onClick={() => addToMarcRecord("address")}
                />
              </div>

              <RelatedDateRow
                idPrefix="c-activity-field"
                label="분야(372)"
                valueName="activityField"
                fromName="activityFieldDateFrom"
                toName="activityFieldDateTo"
                register={register}
                addTarget="activityField"
                onAdd={addToMarcRecord}
              />
              <RelatedDateRow
                idPrefix="c-related-organization"
                label="관련단체(373)"
                valueName="relatedOrganization"
                fromName="relatedOrganizationDateFrom"
                toName="relatedOrganizationDateTo"
                register={register}
                addTarget="relatedOrganization"
                onAdd={addToMarcRecord}
              />
              <SimpleInputRow
                id="c-language"
                label="언어(377)"
                name="language"
                register={register}
                addTarget="language"
                onAdd={addToMarcRecord}
                bold
              />
              <SimpleInputRow
                id="c-source"
                label="정보원(670)"
                name="source"
                register={register}
                addTarget="source"
                onAdd={addToMarcRecord}
                bold
                last
              />
            </Outline>

            <AuditFields register={register} />
          </form>
        </div>
      </div>
    </div>
  );
}

interface RegisteredFieldProps {
  register: UseFormRegister<CorporationAuthorityFormValues>;
}

interface SimpleInputRowProps extends RegisteredFieldProps {
  id: string;
  label: string;
  name: TextFieldName;
  addTarget: CorporationMarcAddTarget;
  onAdd: (target: CorporationMarcAddTarget) => void;
  bold?: boolean;
  last?: boolean;
}

function SimpleInputRow({
  id,
  label,
  name,
  register,
  addTarget,
  onAdd,
  bold = false,
  last = false,
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
          {...register(name)}
        />
      </div>
      <AddButton ariaLabel={`${label} 추가`} onClick={() => onAdd(addTarget)} />
    </div>
  );
}

interface RelatedDateRowProps extends RegisteredFieldProps {
  idPrefix: string;
  label: string;
  valueName: TextFieldName;
  fromName: TextFieldName;
  toName: TextFieldName;
  addTarget: CorporationMarcAddTarget;
  onAdd: (target: CorporationMarcAddTarget) => void;
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
      <div className="col-auto d-flex align-items-center gap-1">
        <span className="text-nowrap small text-muted">관련일자</span>
        <label className="visually-hidden" htmlFor={`${idPrefix}-date-from`}>
          {label} 시작
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          id={`${idPrefix}-date-from`}
          style={{ width: "90px" }}
          {...register(fromName)}
        />
        <span>~</span>
        <label className="visually-hidden" htmlFor={`${idPrefix}-date-to`}>
          {label} 종료
        </label>
        <input
          type="text"
          className="form-control form-control-sm"
          id={`${idPrefix}-date-to`}
          style={{ width: "90px" }}
          {...register(toName)}
        />
      </div>
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

function Outline({ children }: { children: ReactNode }) {
  return (
    <div className="col-12">
      <div className="box-group border rounded p-3">{children}</div>
    </div>
  );
}

function AuditFields({ register }: RegisteredFieldProps) {
  return (
    <div className="col-12">
      <div className="row g-2 align-items-center">
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="c-created-by">
            최초입력자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="c-created-by"
            readOnly
            {...register("createdBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="c-created-at">
            최초입력일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="c-created-at"
            readOnly
            {...register("createdAt")}
          />
        </div>
      </div>
      <div className="row g-2 align-items-center mt-1">
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="c-updated-by">
            마지막수정자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="c-updated-by"
            readOnly
            {...register("updatedBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="c-updated-at">
            마지막수정일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="c-updated-at"
            readOnly
            {...register("updatedAt")}
          />
        </div>
      </div>
    </div>
  );
}

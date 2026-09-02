import { useEffect, type ReactNode } from "react";
import {
  useForm,
  useWatch,
  type FieldPathByValue,
  type UseFormRegister,
} from "react-hook-form";

import AuthorityRegionSelect from "@/components/ui/authority-region-select";
import { AuthorityReferenceHeadingSearchButton } from "@/components/ui/authority-reference-heading-search-modal";
import { useMarcEditor } from "@/components/ui/marc-editor-context";
import { sortMarcFields } from "@/lib/marc/marc-field.utils";

import {
  addSubjectFormValuesToMarcFields,
  createEmptySubjectAuthorityFormValues,
  type SubjectAuthorityFormValues,
  type SubjectMarcAddTarget,
} from "./subject-form.mapper";

type TextFieldName = FieldPathByValue<SubjectAuthorityFormValues, string>;

export default function AuthoritySubjectForm({
  initialValues,
}: {
  initialValues?: SubjectAuthorityFormValues;
}) {
  const { register, getValues, control } = useForm<SubjectAuthorityFormValues>({
    defaultValues: initialValues ?? createEmptySubjectAuthorityFormValues(),
  });
  const { setVariableFields, setAuthorityCreateMetadata } = useMarcEditor();
  const region = useWatch({ control, name: "region" });

  const addToMarcRecord = (target: SubjectMarcAddTarget) => {
    const values = getValues();
    setVariableFields((fields) =>
      addSubjectFormValuesToMarcFields(fields, target, values),
    );
  };

  useEffect(() => {
    setAuthorityCreateMetadata({
      acRegionCode: region.trim(),
      birthDeathDatePrivateYn: "N",
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
                    htmlFor="s-indicator"
                  >
                    전거표시기호
                  </label>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    id="s-indicator"
                    {...register("authorityType")}
                  >
                    <option value="150">150 : 주제명</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label
                    className="form-label fw-bold mb-0 text-nowrap"
                    htmlFor="s-region"
                  >
                    전거지역구분
                  </label>
                </div>
                <div className="col">
                  <AuthorityRegionSelect
                    id="s-region"
                    fallbackValue={initialValues?.region}
                    excludeAllOption
                    {...register("region")}
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <SimpleInputRow
                id="s-heading"
                label="채택표목(150)"
                name="heading"
                register={register}
                addTarget="heading"
                onAdd={addToMarcRecord}
                last
              />
            </div>

            <Outline>
              <div className="row g-2 align-items-center mb-2">
                <div className="col-md-2">
                  <span className="form-label fw-bold mb-0 text-nowrap">
                    관계부호
                  </span>
                </div>
                <div className="col-auto">
                  <div className="form-check form-check-inline mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="s-reference-relation-none"
                      value=""
                      {...register("referenceRelationCode")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="s-reference-relation-none"
                    >
                      적용안함
                    </label>
                  </div>
                  <div className="form-check form-check-inline mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="s-reference-relation-code"
                      value="r"
                      {...register("referenceRelationCode")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="s-reference-relation-code"
                    >
                      관계부호(r)
                    </label>
                  </div>
                </div>
                <div className="col">
                  <label
                    className="visually-hidden"
                    htmlFor="s-reference-language"
                  >
                    참조표목 언어명
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="s-reference-language"
                    placeholder="언어명"
                    {...register("referenceLanguage")}
                  />
                </div>
              </div>
              <SimpleInputRow
                id="s-reference-heading"
                label="참조표목(450)"
                name="referenceHeading"
                register={register}
                addTarget="referenceHeading"
                onAdd={addToMarcRecord}
                last
              />
            </Outline>

            <Outline>
              <div className="row g-2 align-items-center">
                <div className="col-md-2">
                  <span className="form-label fw-bold mb-0 text-nowrap">
                    참조표목(550)
                  </span>
                </div>
                <div className="col">
                  <AuthorityReferenceHeadingSearchButton
                    defaultAuthorityType="4"
                    referenceTag="550"
                    onConfirm={(referenceFields) =>
                      setVariableFields((fields) =>
                        sortMarcFields([...fields, ...referenceFields]),
                      )
                    }
                  />
                </div>
              </div>
            </Outline>

            <Outline>
              <TextAreaRow
                id="s-source"
                label="정보원(670)"
                name="source"
                register={register}
                addTarget="source"
                onAdd={addToMarcRecord}
              />
              <TextAreaRow
                id="s-note"
                label="일반주기(680)"
                name="note"
                register={register}
                addTarget="note"
                onAdd={addToMarcRecord}
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
  register: UseFormRegister<SubjectAuthorityFormValues>;
}

interface InputRowProps extends RegisteredFieldProps {
  id: string;
  label: string;
  name: TextFieldName;
  addTarget: SubjectMarcAddTarget;
  onAdd: (target: SubjectMarcAddTarget) => void;
  last?: boolean;
}

function SimpleInputRow({
  id,
  label,
  name,
  register,
  addTarget,
  onAdd,
  last = false,
}: InputRowProps) {
  return (
    <div className={`row g-2 align-items-center${last ? "" : " mb-2"}`}>
      <div className="col-md-2">
        <label className="form-label fw-bold mb-0" htmlFor={id}>
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
      <AddButton label={label} onClick={() => onAdd(addTarget)} />
    </div>
  );
}

function TextAreaRow({
  id,
  label,
  name,
  register,
  addTarget,
  onAdd,
  last = false,
}: InputRowProps) {
  return (
    <div className={`row g-2 align-items-start${last ? "" : " mb-2"}`}>
      <div className="col-md-2">
        <label className="form-label fw-bold mb-0" htmlFor={id}>
          {label}
        </label>
      </div>
      <div className="col">
        <textarea
          className="form-control"
          id={id}
          rows={2}
          {...register(name)}
        />
      </div>
      <AddButton label={label} onClick={() => onAdd(addTarget)} />
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="col-auto">
      <button
        type="button"
        className="btn btn-sm btn-outline-primary"
        aria-label={`${label} 추가`}
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
          <label className="form-label mb-0 fw-bold" htmlFor="s-created-by">
            최초입력자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="s-created-by"
            readOnly
            {...register("createdBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="s-created-at">
            최초입력일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="s-created-at"
            readOnly
            {...register("createdAt")}
          />
        </div>
      </div>
      <div className="row g-2 align-items-center mt-1">
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="s-updated-by">
            마지막수정자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control bg-secondary-subtle"
            id="s-updated-by"
            readOnly
            {...register("updatedBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="s-updated-at">
            마지막수정일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control bg-secondary-subtle"
            id="s-updated-at"
            readOnly
            {...register("updatedAt")}
          />
        </div>
      </div>
    </div>
  );
}

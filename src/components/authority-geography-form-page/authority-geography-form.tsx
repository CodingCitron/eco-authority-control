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
  addGeographyFormValuesToMarcFields,
  createEmptyGeographyAuthorityFormValues,
  type GeographyAuthorityFormValues,
  type GeographyMarcAddTarget,
} from "./geography-form.mapper";

type TextFieldName = FieldPathByValue<GeographyAuthorityFormValues, string>;

export default function AuthorityGeographyForm({
  initialValues,
}: {
  initialValues?: GeographyAuthorityFormValues;
}) {
  const { register, getValues, control } =
    useForm<GeographyAuthorityFormValues>({
      defaultValues: initialValues ?? createEmptyGeographyAuthorityFormValues(),
    });
  const { setVariableFields, setAuthorityCreateMetadata } = useMarcEditor();
  const region = useWatch({ control, name: "region" });

  const addToMarcRecord = (target: GeographyMarcAddTarget) => {
    const values = getValues();
    setVariableFields((fields) =>
      addGeographyFormValuesToMarcFields(fields, target, values),
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
                    htmlFor="g-indicator"
                  >
                    전거표시기호
                  </label>
                </div>
                <div className="col">
                  <select
                    className="form-select"
                    id="g-indicator"
                    {...register("authorityType")}
                  >
                    <option value="151">151 : 지리명</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <label
                    className="form-label fw-bold mb-0 text-nowrap"
                    htmlFor="g-region"
                  >
                    전거지역구분
                  </label>
                </div>
                <div className="col">
                  <AuthorityRegionSelect
                    id="g-region"
                    fallbackValue={initialValues?.region}
                    excludeAllOption
                    {...register("region")}
                  />
                </div>
              </div>
            </div>

            <div className="col-12">
              <SimpleInputRow
                id="g-heading"
                label="채택표목(151)"
                name="heading"
                register={register}
                addTarget="heading"
                onAdd={addToMarcRecord}
                last
              />
            </div>

            <Outline>
              <SimpleInputRow
                id="g-reference-heading"
                label="참조표목(451)"
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
                    참조표목(551)
                  </span>
                </div>
                <div className="col">
                  <AuthorityReferenceHeadingSearchButton
                    defaultAuthorityType="5"
                    referenceTag="551"
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
                id="g-source"
                label="정보원(670)"
                name="source"
                register={register}
                addTarget="source"
                onAdd={addToMarcRecord}
              />
              <TextAreaRow
                id="g-note"
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
  register: UseFormRegister<GeographyAuthorityFormValues>;
}

interface InputRowProps extends RegisteredFieldProps {
  id: string;
  label: string;
  name: TextFieldName;
  addTarget: GeographyMarcAddTarget;
  onAdd: (target: GeographyMarcAddTarget) => void;
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
          <label className="form-label mb-0 fw-bold" htmlFor="g-created-by">
            최초입력자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="g-created-by"
            readOnly
            {...register("createdBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="g-created-at">
            최초입력일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            id="g-created-at"
            readOnly
            {...register("createdAt")}
          />
        </div>
      </div>
      <div className="row g-2 align-items-center mt-1">
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="g-updated-by">
            마지막수정자
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control bg-secondary-subtle"
            id="g-updated-by"
            readOnly
            {...register("updatedBy")}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label mb-0 fw-bold" htmlFor="g-updated-at">
            마지막수정일
          </label>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control bg-secondary-subtle"
            id="g-updated-at"
            readOnly
            {...register("updatedAt")}
          />
        </div>
      </div>
    </div>
  );
}

## 폼 수정

### 속성 추가 시 수정해야 하는 부분

1. mapper 파일에서 FormValues에 key를 추가

```ts
// personal-form.mapper.ts
export interface PersonalAuthorityFormValues {
    ...
    추가할 속성 key 추가
}

// 기본값으로 사용되는 함수
export function createEmptyPersonalAuthorityFormValues(): PersonalAuthorityFormValues {
  return {
    ...
    추가할 속성 key + 기본값 추가
  }
}

// 유니온 타입 추가
export type PersonalMarcAddTarget =  | "heading"
  | "birthDeathDate" ... 추가할 속성 key 추가

// 추가할 속성 key 값에 따른 처리 함수 (좌측 폼에서 추가 버튼 클릭시 우측 레코드 뷰에서 필드 추가 액션)
export function addPersonalFormValuesToMarcFields(
  fields: MarcVariableField[],
  target: PersonalMarcAddTarget,
  values: PersonalAuthorityFormValues,
): MarcVariableField[] {
    switch (target) {
    case 추가할 Key:
      return 동작 정의
  }
}


```

### 행별 오류 표시 수정

- marc-editor getMarcRowErrorMessage 함수 수정

### 기타, 추가가 아닌 값 추가 및 수정

- marc-editor-context 파일에서 레코드 뷰가 아닌, 입력 폼에서 작성하는 데이터 중 전거표시기호, 전거지역구분등 데이터는 AuthorityCreateMetadata에 추가

- acType으로 각각 다르게 타입 추가 필요

### 고정 필드 수정

- authority-fixed-field-edit-modal.tsx (고정 값 수정하는 모달)
- marc-editor-context.tsx
  - ControlField008
  - CONTROL_FIELD_008_NAME_BY_CODE_SET

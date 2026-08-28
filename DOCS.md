## 속성 추가

### 1. 입력값 추가

확인할 파일: `src/components/authority-personal-form-page/personal-form.mapper.ts`

- `PersonalAuthorityFormValues`에 key와 타입을 추가한다.
- `createEmptyPersonalAuthorityFormValues`에 기본값을 추가한다.
- 수정 화면에서 기존 값을 보여야 하면 `mapAuthorityDetailToPersonalFormValues`에 상세 API 또는 MARC 필드에서 읽는 로직을 추가한다.

입력 UI는 `src/components/authority-personal-form-page/authority-personal-form.tsx`에 추가한다.

- 입력 요소에 `register("추가한Key")`를 연결한다.
- MARC에 반영하는 항목이면 `추가` 버튼도 추가한다.

### 2. MARC 필드 추가

확인할 파일: `src/components/authority-personal-form-page/personal-form.mapper.ts`

1. `PersonalMarcAddTarget`에 대상 이름을 추가한다.
2. `addPersonalFormValuesToMarcFields`의 `switch`에 MARC 변환을 추가한다.
3. 폼의 추가 버튼에서 `addToMarcRecord("대상")`을 호출한다.

MARC 필드는 `src/lib/marc/marc-field.utils.ts`의 함수를 사용한다.

- 새 행 추가: `appendMarcDataField` + `createMarcDataField`
- 기존 행의 특정 서브필드 수정: `replaceMarcDataFieldSubfields`
- 서브필드 생성: `createMarcSubfield` — 빈 코드나 값은 자동으로 제외된다.

현재 폼의 변환 예시는 `addPersonalFormValuesToMarcFields`에서 확인할 수 있다. 채택표목은 기존 `100`을 수정하고, 참조표목·관련장소·분야 등 반복 가능 항목은 새 행을 추가한다.

### 3. API 메타데이터 추가

MARC가 아닌 API 최상위 필드로 저장하는 값이라면 아래 파일을 모두 확인한다.

1. `src/types/marc-editor.types.ts`
   - `AuthorityCreateMetadata`에 key와 타입을 추가한다.
2. `src/components/authority-personal-form-page/personal-form.mapper.ts`
   - `mapPersonalFormValuesToAuthorityCreateMetadata`의 입력과 반환값에 추가한다.
3. `src/components/authority-personal-form-page/authority-personal-form.tsx`
   - `useWatch` 대상과 `useEffect`의 mapper 인자에 추가한다.
4. `src/pages/authority-personal-form-page.tsx`
   - `buildAuthorityCreateParams`, `buildAuthorityUpdateParams`에 요청 필드를 추가한다.
5. `src/api/authority-create.ts`, `src/api/authority-update.ts`
   - 요청 타입에 필드를 추가한다.

수정 화면에서도 이 값을 보여야 하면 상세 API schema/type과 `mapAuthorityDetailToPersonalFormValues`도 함께 수정한다.

## 기타 수정 위치

### MARC 행 형식 오류

확인할 파일: `src/components/ui/marc-editor.tsx`

- `getMarcRowErrorMessage`에 `MarcError` 코드를 추가한다.
- 이 메시지는 사용자가 MARC 행을 직접 편집할 때의 파싱 오류에만 사용한다.
- 저장 API 오류 표시는 `src/api/authority-save-error.ts`와 `MarcEditorToolbarWithError`가 담당한다.

### Leader·008 고정 필드

확인할 파일:

- `src/components/ui/authority-fixed-field-edit-modal.tsx`: 모달 입력 항목과 위치 라벨
- `src/components/ui/marc-editor-context.tsx`: `ControlField008`, `CONTROL_FIELD_008_NAME_BY_CODE_SET`, 008 파싱·포맷팅

008 위치를 추가할 때는 두 파일을 함께 수정한다. 기존 008의 편집하지 않는 값은 `sourceValue`로 보존되므로, 이를 제거하지 않는다.

## 변경 후 확인

- 등록 화면에서 기본값, 입력, MARC 추가를 확인한다.
- 수정 화면에서 기존 값이 필요한 위치에 표시되는지 확인한다.
- API 메타데이터라면 등록과 수정 요청 모두에 값이 포함되는지 확인한다.
- 관련 테스트는 `src/pages/authority-personal-form-page.test.tsx`에 추가한다.

## 폼 수정

### 속성 추가

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

2.

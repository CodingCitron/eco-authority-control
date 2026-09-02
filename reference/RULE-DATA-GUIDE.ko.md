# KORMARC 규칙 데이터 작성 가이드

이 문서는 `marc-eco`에 KORMARC 규칙을 완전하게 구성하는 방법을 설명합니다. 규칙 데이터는 다음 네 JSON 파일로 나눕니다.

```text
rules/kormarc-authority/
├── fields.json
├── codesets.json
├── leader.json
└── control-fields.json
```

- `fields.json`: 데이터 필드(010~999), 지시기호, 식별기호 규칙
- `codesets.json`: 지시기호와 고정 위치 등에 사용할 허용 코드
- `leader.json`: 리더 24자리의 위치별 규칙
- `control-fields.json`: 제어 필드(001~009)와 고정 위치 규칙

규칙 파일은 서로 연결되어 있습니다. `fields.json`, `leader.json`, `control-fields.json`에서 사용하는 모든 `codeset` 이름은 반드시 `codesets.json`에 정의해야 합니다.

## 1. 공통 작성 원칙

1. MARC 태그는 문자열로 작성합니다. 예: `"008"`, `"100"`.
2. 데이터 필드 태그는 세 자리 숫자여야 하며 `001`~`009`는 사용할 수 없습니다.
3. 제어 필드 태그는 `001`~`009`만 사용할 수 있습니다.
4. 식별기호 코드는 한 글자여야 합니다. 예: `"a"`, `"w"`.
5. 리더 위치는 두 자리 문자열 `"00"`~`"23"`으로 작성합니다.
6. 위치를 나타내는 `start`와 `order`는 0 이상의 정수입니다. `length`는 1 이상의 정수입니다.
7. `required`를 생략하면 선택 항목으로 처리합니다.
8. `repeatable`을 생략하면 반복 불가로 처리합니다.
9. 공백도 하나의 코드 값입니다. 공백 지시기호를 허용하려면 코드셋에 `" "`를 정의해야 합니다.

## 2. `fields.json`

데이터 필드, 지시기호, 식별기호 및 참조관계를 정의합니다.

```json
{
  "version": "1.0",
  "fields": {
    "100": {
      "label": "개인명 표목",
      "required": false,
      "repeatable": false,
      "indicators": {
        "1": {
          "label": "제1지시기호",
          "codeset": "IND_100_1"
        },
        "2": {
          "label": "제2지시기호",
          "codeset": "IND_BLANK"
        }
      },
      "subfields": {
        "a": {
          "label": "개인명",
          "required": true,
          "repeatable": false,
          "order": 1,
          "input": "text"
        },
        "d": {
          "label": "생몰년",
          "required": false,
          "repeatable": false,
          "order": 2,
          "input": "text"
        }
      }
    }
  }
}
```

### 필드 속성

| 속성         | 형식   |   필수 | 설명                                                            |
| ------------ | ------ | -----: | --------------------------------------------------------------- |
| `version`    | 문자열 |     예 | 전체 규칙 버전이며 `RulePack.version`으로 사용됩니다.           |
| `fields`     | 객체   |     예 | 태그를 키로 사용하는 데이터 필드 규칙 모음입니다.               |
| `label`      | 문자열 | 아니요 | 화면 표시용 필드명입니다.                                       |
| `required`   | 불리언 | 아니요 | `true`이면 레코드에 해당 필드가 하나 이상 있어야 합니다.        |
| `repeatable` | 불리언 | 아니요 | `true`이면 같은 태그를 여러 번 사용할 수 있습니다.              |
| `indicators` | 객체   | 아니요 | 제1·제2지시기호 규칙입니다. 키는 `"1"` 또는 `"2"`만 가능합니다. |
| `subfields`  | 객체   | 아니요 | 식별기호 코드를 키로 사용하는 식별기호 규칙입니다.              |
| `reference`  | 객체   | 아니요 | 참조 필드의 관계 메타데이터입니다.                              |

### 지시기호 속성

```json
"indicators": {
  "1": { "label": "성명의 유형", "codeset": "IND_100_1" },
  "2": { "label": "미정의", "codeset": "IND_BLANK" }
}
```

- `label`: 화면 표시용 이름이며 생략할 수 있습니다.
- `codeset`: 필수입니다. 실제 지시기호 한 글자가 해당 코드셋에 있어야 합니다.
- 지시기호 자체는 항상 한 글자여야 합니다.

### 식별기호 속성

| 속성         | 형식   |  기본값 | 설명                                                                           |
| ------------ | ------ | ------: | ------------------------------------------------------------------------------ |
| `label`      | 문자열 |    없음 | 화면 표시용 이름입니다.                                                        |
| `required`   | 불리언 | `false` | 해당 필드 안에 반드시 존재해야 하는지 지정합니다.                              |
| `repeatable` | 불리언 | `false` | 동일 식별기호를 반복할 수 있는지 지정합니다.                                   |
| `order`      | 정수   |    없음 | 필드 안에서 권장·허용되는 순서입니다. 작은 값부터 배치합니다.                  |
| `input`      | 문자열 |    없음 | 편집 UI용 입력 형식 메타데이터입니다. 현재 검증기는 이 값을 검사하지 않습니다. |
| `codeset`    | 문자열 |    없음 | 값 전체가 일치해야 하는 코드셋 이름입니다.                                     |

`order`가 정의된 식별기호는 작은 순서에서 큰 순서로 나타나야 합니다. 예를 들어 `$a`의 순서가 1이고 `$d`가 2이면 `$d` 다음에 `$a`가 나오면 `INVALID_SUBFIELD_ORDER` 오류가 발생합니다. 순서가 같은 반복 식별기호는 허용되지만 `repeatable: true`도 함께 설정해야 합니다.

### 참조관계 속성

```json
"reference": {
  "type": "SEE",
  "relationCodeSet": "REF_400_W"
}
```

- `type`: 참조관계 유형을 나타내는 메타데이터입니다.
- `relationCodeSet`: 반드시 존재하는 코드셋 이름이어야 합니다.
- 현재 `validate()`는 참조관계 자체를 해석하지 않습니다. 다만 연결된 식별기호에도 같은 `codeset`을 지정하면 그 식별기호 값은 검증됩니다.

## 3. `codesets.json`

허용할 코드와 화면 표시명을 정의합니다.

코드셋은 스칼라 코드셋과 위치형 코드셋 중 하나로 작성합니다.

### 스칼라 코드셋

스칼라 코드셋은 전체 값을 `values`의 키와 비교합니다. 지시기호, 리더 위치, 제어필드 고정 위치 및 일반적인 코드형 식별기호에 사용합니다.

```json
{
  "codesets": {
    "IND_BLANK": {
      "label": "미정의 지시기호",
      "values": {
        " ": { "label": "미정의" }
      }
    },
    "LEADER_STATUS": {
      "label": "레코드 상태",
      "values": {
        "n": { "label": "신규 레코드" },
        "c": { "label": "수정 레코드" }
      }
    }
  }
}
```

각 코드셋에는 다음 항목이 필요합니다.

- 코드셋 이름: `codesets` 객체의 키입니다. 프로젝트 전체에서 중복되지 않게 작성합니다.
- `label`: 코드셋의 화면 표시명이며 필수입니다.
- `values`: 하나 이상의 값을 가져야 합니다.
- 각 값의 `label`: 필수입니다.

코드 값은 문자열 그대로 비교합니다. 대소문자, 공백 및 길이가 모두 일치해야 합니다. 여러 글자 코드도 사용할 수 있으므로 언어 코드처럼 `"kor"`와 같은 값을 정의할 수 있습니다.

### 위치형 코드셋

위치형 코드셋은 식별기호 값의 전체 길이와 각 문자 위치를 검사합니다. 400 필드의 `$w`와 같은 제어 식별기호에 사용합니다.

```json
"REF_400_W": {
  "label": "400 제어 식별기호",
  "minLength": 1,
  "maxLength": 4,
  "positions": {
    "0": {
      "label": "특수관계",
      "values": {
        "a": { "label": "이전표목" },
        "b": { "label": "이후표목" },
        "n": { "label": "적용불가" },
        "|": { "label": "채움문자" }
      }
    },
    "1": {
      "label": "부출지시 사용 제한",
      "values": {
        "a": { "label": "이름 참조구조에만" },
        "n": { "label": "적용불가" },
        "|": { "label": "채움문자" }
      }
    },
    "2": {
      "label": "이전 표목형식",
      "values": {
        "a": { "label": "AACR2의 이전 표목형식" },
        "n": { "label": "적용불가" },
        "|": { "label": "채움문자" }
      }
    },
    "3": {
      "label": "참조 출력",
      "values": {
        "a": { "label": "참조를 출력하지 않음" },
        "n": { "label": "적용불가" },
        "|": { "label": "채움문자" }
      }
    }
  }
}
```

- `minLength`와 `maxLength`는 양의 정수이며 `minLength <= maxLength`여야 합니다.
- 길이 제한은 최솟값과 최댓값을 모두 포함합니다.
- 위치 키는 0부터 시작하는 정수 문자열입니다.
- `"0"`부터 `String(maxLength - 1)`까지 모든 위치를 정의해야 합니다.
- 각 위치에는 한 글자로 된 값이 하나 이상 있어야 하며 모든 값에 `label`이 필요합니다.
- 위치형 코드셋에는 최상위 `values`를 함께 정의할 수 없습니다.
- 위치형 코드셋은 식별기호의 `codeset`과 필드의 `relationCodeSet`에서만 참조할 수 있습니다.

값이 `maxLength`보다 짧으면 실제로 존재하는 위치만 검사합니다. 예를 들어 `minLength: 1`, `maxLength: 4`이면 각 위치의 문자가 허용되는 한 1~4자 값을 사용할 수 있습니다.

## 4. `leader.json`

24자리 리더 중 코드 검사가 필요한 위치를 정의합니다. 위치 번호는 0부터 시작합니다.

```json
{
  "positions": {
    "05": {
      "label": "레코드 상태",
      "codeset": "LEADER_STATUS"
    },
    "06": {
      "label": "레코드 유형",
      "codeset": "LEADER_TYPE"
    }
  }
}
```

- 위치 키는 반드시 `"00"`~`"23"` 형식이어야 합니다.
- `label`은 선택 항목입니다.
- `codeset`은 필수이며, 한 위치의 한 글자를 검사합니다.
- 리더 자체는 항상 정확히 24자여야 합니다.

## 5. `control-fields.json`

제어 필드의 필수 여부, 반복 여부, 전체 길이 및 내부 고정 위치를 정의합니다.

```json
{
  "fields": {
    "008": {
      "label": "부호화정보필드",
      "required": true,
      "repeatable": false,
      "length": 40,
      "positions": [
        {
          "start": 0,
          "length": 6,
          "label": "입력일자"
        },
        {
          "start": 6,
          "length": 1,
          "label": "날짜 유형",
          "codeset": "DATE_TYPE"
        }
      ]
    }
  }
}
```

### 제어 필드 속성

| 속성         | 형식   |  기본값 | 설명                                          |
| ------------ | ------ | ------: | --------------------------------------------- |
| `label`      | 문자열 |    없음 | 화면 표시용 필드명입니다.                     |
| `required`   | 불리언 | `false` | 레코드에 반드시 있어야 하는지 지정합니다.     |
| `repeatable` | 불리언 | `false` | 같은 제어 필드를 반복할 수 있는지 지정합니다. |
| `length`     | 정수   |    없음 | 값의 정확한 전체 길이입니다.                  |
| `positions`  | 배열   |    없음 | 값 안의 고정 위치 구간입니다.                 |

### 고정 위치 속성

- `start`: 0부터 시작하는 위치입니다. 예를 들어 일곱 번째 문자는 `6`입니다.
- `length`: 구간 길이입니다.
- `label`: 화면 표시용 이름이며 생략할 수 있습니다.
- `codeset`: 선택 항목입니다. 있으면 해당 구간 전체 문자열을 코드셋과 비교합니다.

위치 구간끼리는 겹칠 수 없습니다. `length`가 정의된 필드에서는 `start + length`가 필드의 전체 길이를 넘을 수 없습니다.

## 6. 완전한 연결 예제

400 필드의 `$w` 값을 검증하려면 두 파일을 함께 작성합니다.

`codesets.json`:

```json
{
  "codesets": {
    "IND_BLANK": {
      "label": "미정의 지시기호",
      "values": { " ": { "label": "미정의" } }
    },
    "REF_400_W": {
      "label": "400 제어 식별기호",
      "minLength": 1,
      "maxLength": 4,
      "positions": {
        "0": {
          "label": "특수관계",
          "values": {
            "a": { "label": "이전표목" },
            "b": { "label": "이후표목" },
            "n": { "label": "적용불가" },
            "|": { "label": "채움문자" }
          }
        },
        "1": {
          "label": "부출지시 사용 제한",
          "values": {
            "n": { "label": "적용불가" },
            "|": { "label": "채움문자" }
          }
        },
        "2": {
          "label": "이전 표목형식",
          "values": {
            "n": { "label": "적용불가" },
            "|": { "label": "채움문자" }
          }
        },
        "3": {
          "label": "참조 출력",
          "values": {
            "n": { "label": "적용불가" },
            "|": { "label": "채움문자" }
          }
        }
      }
    }
  }
}
```

`fields.json`의 `fields` 안:

```json
"400": {
  "label": "이형표목",
  "required": false,
  "repeatable": true,
  "indicators": {
    "1": { "codeset": "IND_BLANK" },
    "2": { "codeset": "IND_BLANK" }
  },
  "reference": {
    "type": "SEE",
    "relationCodeSet": "REF_400_W"
  },
  "subfields": {
    "w": {
      "label": "참조관계",
      "required": false,
      "repeatable": false,
      "order": 1,
      "codeset": "REF_400_W"
    },
    "a": {
      "label": "표목",
      "required": true,
      "repeatable": false,
      "order": 2,
      "input": "text"
    }
  }
}
```

이 규칙에서는 400 필드를 여러 번 사용할 수 있고, 각 필드에 `$a`가 반드시 있어야 합니다. `$w`를 사용하면 값은 1~4자여야 하며 각 문자는 해당 위치의 허용 값과 일치해야 합니다. 또한 `$w`는 `$a`보다 앞에 위치해야 합니다.

## 7. 라이브러리가 시작할 때 검사하는 규칙 오류

규칙 문서가 잘못되면 모듈을 불러오는 단계에서 `MarcError`의 `INVALID_RULE_PACK` 오류가 발생합니다.

- `fields.json`에 `version`이 없음
- 코드셋의 `label` 또는 `values`가 없음
- 코드 값에 `label`이 없음
- 잘못된 데이터 필드 또는 제어 필드 태그
- `"1"`, `"2"` 이외의 지시기호 위치
- 존재하지 않는 코드셋 참조
- 한 글자가 아닌 식별기호 코드
- 음수 또는 정수가 아닌 `order`, `start`, `length`
- `"00"`~`"23"` 범위를 벗어난 리더 위치
- 제어 필드의 위치 범위 중첩 또는 전체 길이 초과

## 8. 레코드 검증 결과

```ts
import { validate } from "marc-eco";

const result = validate(record);

if (!result.valid) {
  for (const diagnostic of result.diagnostics) {
    console.error(diagnostic.code, diagnostic.path, diagnostic.message);
  }
}
```

주요 오류 코드는 다음과 같습니다.

| 오류 코드                        | 의미                                              |
| -------------------------------- | ------------------------------------------------- |
| `MISSING_REQUIRED_FIELD`         | 필수 필드가 없습니다.                             |
| `NON_REPEATABLE_FIELD`           | 반복 불가 필드가 반복되었습니다.                  |
| `INVALID_INDICATOR`              | 지시기호가 코드셋에 없습니다.                     |
| `MISSING_REQUIRED_SUBFIELD`      | 필수 식별기호가 없습니다.                         |
| `NON_REPEATABLE_SUBFIELD`        | 반복 불가 식별기호가 반복되었습니다.              |
| `INVALID_SUBFIELD_ORDER`         | 식별기호 순서가 규칙과 다릅니다.                  |
| `INVALID_SUBFIELD_CODE`          | 식별기호 값이 코드셋에 없습니다.                  |
| `INVALID_SUBFIELD_LENGTH`        | 위치형 식별기호 값이 허용 길이를 벗어났습니다.    |
| `INVALID_SUBFIELD_POSITION_CODE` | 특정 위치의 문자가 코드셋에 없습니다.             |
| `INVALID_LEADER_CODE`            | 리더 위치 값이 코드셋에 없습니다.                 |
| `INVALID_FIXED_FIELD_LENGTH`     | 제어 필드 길이가 규칙과 다릅니다.                 |
| `INVALID_CONTROL_FIELD_CODE`     | 제어 필드의 고정 위치 값이 코드셋에 없습니다.     |
| `UNKNOWN_FIELD`                  | 정의되지 않은 필드입니다. 오류가 아닌 경고입니다. |

## 9. 규칙 추가 작업 순서

1. KORMARC 공식 문서에서 태그, 반복 여부, 지시기호, 식별기호 및 고정 위치를 확인합니다.
2. 필요한 허용 값을 `codesets.json`에 먼저 정의합니다.
3. 데이터 필드는 `fields.json`, 제어 필드는 `control-fields.json`에 추가합니다.
4. 필요한 리더 위치를 `leader.json`에 추가합니다.
5. 모든 `codeset`과 `relationCodeSet` 이름이 정확히 연결되는지 확인합니다.
6. `fields.json`의 `version`을 올립니다.
7. `pnpm typecheck`, `pnpm test`, `pnpm build`를 실행합니다.
8. 새 라이브러리 버전을 태그하고 사내 Gitea에 배포합니다.

현재 규칙 JSON은 빌드 시 라이브러리에 포함됩니다. JSON 파일만 수정한 뒤 기존 `dist`를 계속 사용하면 변경 사항이 반영되지 않으므로 반드시 다시 빌드하고 사용하는 프로젝트의 의존성 버전을 갱신해야 합니다.

## 10. 규칙 조회

```ts
import { getCodeSet, getFieldRule, kormarcAuthorityRulePack } from "marc-eco";

const field100 = getFieldRule("100");
const field008 = getFieldRule("008");
const relationCodes = getCodeSet("REF_400_W");

console.log(kormarcAuthorityRulePack.version);
```

`getFieldRule()`은 데이터 필드와 제어 필드를 모두 조회합니다. 정의되지 않은 태그나 코드셋은 `undefined`를 반환합니다.

위치형 코드셋을 안전하게 구분하려면 `isPositionalCodeSet()`을 사용합니다.

```ts
import { getCodeSet, isPositionalCodeSet } from "marc-eco";

const codeSet = getCodeSet("REF_400_W");

if (codeSet && isPositionalCodeSet(codeSet)) {
  console.log(codeSet.minLength, codeSet.maxLength);
  console.log(codeSet.positions["0"]?.values.a?.label);
} else if (codeSet) {
  console.log(codeSet.values);
}
```

## 11. 레코드 비교

규칙 검증과 구조 비교는 별도 작업입니다. `diff()`는 값을 정규화하거나 규칙 팩을 적용하지 않고 구조적으로 올바른 두 `MarcRecord` 객체를 그대로 비교합니다.

```ts
import { diff, fromJson } from "marc-eco";

const before = fromJson(beforeJson);
const after = fromJson(afterJson);
const result = diff(before, after);

for (const change of result.changes) {
  if (change.kind === "subfield-value") {
    console.log(change.tag, change.code, change.before, change.after);
  }
}
```

실제 상대 순서가 바뀐 항목은 이동으로 보고합니다. 단순한 추가 또는 삭제 때문에 인덱스만 밀린 항목은 이동으로 처리하지 않습니다.

## 12. ISO 2709 리더 생성

필드를 변경한 뒤 메모리의 레코드에도 최신 구조 리더 값이 필요하면 `buildLeader()`를 사용합니다.

```ts
import { buildLeader } from "marc-eco";

const updated = buildLeader(record);
```

이 함수는 새로운 `MarcRecord`를 반환합니다. 기존 24자리 리더의 의미 위치는 유지하고, 레코드의 UTF-8 바이트를 기준으로 레코드 길이와 데이터 기본번지를 계산합니다. 문자부호화체계와 디렉터리 엔트리 맵 위치도 표준값으로 설정합니다. `toIso2709()`도 같은 계산을 사용합니다.

## 13. 오류 및 진단 메시지

모든 `MarcError`, 파서 경고 및 `validate()` 진단의 사람이 읽는 메시지는 한국어로 제공됩니다. 프로그램에서는 번역된 문장 대신 `INVALID_LEADER`, `INVALID_SUBFIELD`와 같은 안정적인 `code` 값을 기준으로 오류를 처리하십시오. `path`, `tag`, `subfieldCode`, `actual`, `offset` 등의 구조화된 정보도 기존 형식을 유지합니다.

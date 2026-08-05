### 개발 검증 메모

#### 현재 검사 차단 원인 (2026-08-04)

- `pnpm run lint`는 `oxlint-plugin-query` 설치 후 설정을 정상적으로 읽는다. 현재는 기존 코드의
  미사용 변수·JSX `key` 누락 등 경고만 9건이며 오류는 없다.
- `pnpm run build`는 기존 TypeScript 오류 때문에 실패한다. 대표적으로 모달 컴포넌트의
  암시적 `any`, 사용하지 않는 변수, `record-preview.tsx`의 동적 키 인덱싱,
  `PrintButton`의 ref 타입 불일치가 있다.

#### 검사 및 수동 테스트 방법

```bash
# 의존성 설치 상태를 lockfile 기준으로 복원
pnpm install --frozen-lockfile

# 정적 검사와 프로덕션 빌드
pnpm run lint
pnpm run build

# 개발 서버 실행
pnpm dev
```

전체 선택 기능 수동 테스트:

1. 전거관리 기본화면에서 결과가 있는 탭을 연다.
2. `전체` 체크박스를 클릭하면 현재 탭의 모든 행이 선택되고 선택 건수가 전체 건수와 같아지는지 확인한다.
3. 다시 클릭하면 현재 탭의 선택이 모두 해제되는지 확인한다.
4. 행 하나만 선택했을 때 전체 체크박스가 `indeterminate` 상태인지, 이후 전체 체크 시 나머지 행도 선택되는지 확인한다.
5. 탭을 변경했을 때 선택 건수가 0으로 초기화되는지 확인한다.

#### 자동 테스트 사용 방법

테스트 도구는 이미 개발 의존성으로 추가되어 있다.

```bash
# 전체 테스트를 한 번 실행
pnpm run test

# 파일 변경을 감지하며 테스트 실행
pnpm run test:watch

# 특정 테스트 파일만 실행
pnpm run test -- src/components/authority-search-page/authority-search-page-provider.test.tsx
```

현재 실행 환경의 `NODE_ENV`가 `production`이므로, 테스트 스크립트는 React 테스트 API가
개발 모드로 로드되도록 `NODE_ENV=test`를 명시한다.

#### 자동 테스트 도구와 공식 사이트

- [**Vitest**](https://vitest.dev/): Vite 설정을 재사용해 `*.test.ts`·`*.test.tsx` 파일을 실행하는
  테스트 러너다. 테스트 실행, assertion, mock·watch 모드를 제공한다.
- [**jsdom**](https://github.com/jsdom/jsdom): Node.js에서 `window`, `document` 등 브라우저 DOM을
  흉내 낸다. 실제 브라우저를 띄우지 않고 React 컴포넌트를 테스트할 수 있게 한다.
- [**React Testing Library**](https://testing-library.com/docs/react-testing-library/intro/): React
  컴포넌트를 렌더링하고, 사용자가 보는 텍스트·역할·label 기준으로 화면을 찾고 검증한다.
- [`**user-event**`](https://testing-library.com/docs/user-event/intro/): click, type, tab처럼 실제
  사용자 순서에 가까운 상호작용을 발생시킨다. 단순 DOM event 호출보다 UI 동작 테스트에 적합하다.
- [`**jest-dom**`](https://github.com/testing-library/jest-dom): `toBeInTheDocument`, `toBeChecked` 같은
  DOM 전용 matcher를 Vitest assertion에 추가한다. `src/test/setup.ts`에서 등록한다.
- [**MSW (Mock Service Worker)**](https://mswjs.io/docs/): 테스트 또는 개발 중 HTTP 요청을
  가로채 가짜 API 응답을 제공한다. 실제 Axios API 모듈은 유지한 채 mock 응답만 교체할 수 있다.
- 작은 Axios 단위 테스트만 필요할 때는
  **[axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter)**도 가능하지만,
  화면과 API를 함께 검증하려면 MSW를 우선한다.

권장 구조:

```text
컴포넌트 → React Query → Axios API 함수 → MSW handler
```

현재 `fetchAuthoritySearchResults`는 Axios로 `/api/authority-search`를 호출하며, 개발 환경에서는 MSW가
`src/mocks/handlers.ts`의 `authoritySearchMockData` 응답으로 이를 처리한다. 실제 백엔드가 준비되면
`VITE_API_BASE_URL`을 실제 API 주소로 설정하고 `VITE_USE_MSW=false`로 실행한다.

MSW 개발 mock 사용 방법:

```bash
# 기본값: 개발 서버에서 MSW를 자동 시작한다.
pnpm dev

# 실제 백엔드 API를 호출하려면 MSW를 끈다.
VITE_USE_MSW=false pnpm dev
```

- mock endpoint와 필터링 규칙은 `src/mocks/handlers.ts`에 추가한다.
- mock 원본 데이터는 `src/api/authority-search.mock.ts`에 둔다.
- 테스트는 `src/test/server.ts`에서 같은 handler를 Node 환경으로 시작하므로, handler를 한 번만 작성하면
  브라우저 개발과 Vitest 테스트에 함께 적용된다.
- `src/mocks/mockServiceWorker.js`는 MSW가 생성한 브라우저 worker 파일이다. 수정하지 말고 MSW 업데이트 시
  `pnpm exec msw init src/mocks --save`로 다시 생성한다. Vite development middleware가 이 파일을
  `/mockServiceWorker.js`로만 제공하므로 production `dist/`에는 포함되지 않는다.

테스트 예시는 `src/api/authority-search.test.ts`와
`src/components/authority-search-page/authority-search-page-provider.test.tsx`에 있다.
첫 테스트는 API 함수가 MSW handler의 응답을 실제로 사용하는지 검증한다. 두 번째 테스트는 현재 목록 전체 선택,
중복 제어번호 제거, 다시 클릭했을 때 현재 목록만 해제하는 동작을 검증한다.

#### 복사

##### 모달

```tsx
import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";

import { Button, Form, Modal, Table } from "react-bootstrap";

<Modal show={show} onHide={onHide} size="xl" backdrop="static" centered>
  <Modal.Header
    closeButton
    closeVariant="white"
    className="bg-primary text-white"
  >
    <Modal.Title as="h2" className="h5 fw-bold">
      전거통합 - 통합화면
    </Modal.Title>
  </Modal.Header>
  <Modal.Body></Modal.Body>
  <Modal.Footer className="justify-content-center">
    <Button
      className="px-4 fw-bold"
      variant="outline-primary"
      disabled={!canMerge}
      onClick={() => canMerge && onPreview?.(master, target)}
    >
      MARC 통합
    </Button>
    <Button
      className="px-4 fw-bold"
      variant="primary"
      disabled={!canMerge}
      onClick={() => canMerge && onMerge?.(master, target)}
    >
      통합
    </Button>
    <Button className="px-4 fw-bold" variant="secondary" onClick={onHide}>
      닫기
    </Button>
  </Modal.Footer>
</Modal>;
```

### 복사용

#### 모달

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

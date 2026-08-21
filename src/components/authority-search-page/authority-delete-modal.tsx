import { useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAuthorityRecord } from "@/api/authority-delete";
import { authoritySearchQueryKeys } from "@/hooks/use-authority-search";
import BaseModal from "@/components/ui/base-modal";
import { useSearchPage } from "./authority-search-page-context";

interface AuthorityDeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  reckey?: string;
  controlNumber?: string;
  showIcon?: boolean;
}

export function AuthorityDeleteButton({
  reckey,
  controlNumber,
  showIcon = false,
  onClick,
  children = "삭제",
  ...props
}: AuthorityDeleteButtonProps) {
  const { selectedRecordKeys } = useSearchPage();
  const [show, setShow] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!reckey && selectedRecordKeys.length === 0) {
      alert("삭제할 전거자료를 선택해주세요.");
      return;
    }

    setShow(true);
  };

  return (
    <>
      <button {...props} type={props.type ?? "button"} onClick={handleClick}>
        {showIcon && <i className="bi bi-trash me-1" aria-hidden="true" />}
        {children}
      </button>

      <AuthorityDeleteModal
        reckey={reckey}
        controlNumber={controlNumber}
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
}

interface AuthorityDeleteModalProps {
  reckey?: string;
  controlNumber?: string;
  show: boolean;
  onHide: () => void;
}

export default function AuthorityDeleteModal({
  reckey,
  controlNumber,
  show,
  onHide,
}: AuthorityDeleteModalProps) {
  return (
    <BaseModal size="lg" show={show} onHide={onHide}>
      {reckey ? (
        <AuthorityDeleteOneModalBody
          reckey={reckey}
          controlNumber={controlNumber}
          show={show}
          onHide={onHide}
        />
      ) : (
        <AuthorityDeleteModalBody onHide={onHide} />
      )}
    </BaseModal>
  );
}

export function AuthorityDeleteModalBody({ onHide }: { onHide: () => void }) {
  const { selectedRecordKeys } = useSearchPage();

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5 fw-bold">
          전거자료 일괄 삭제
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">일괄 삭제 기능 준비 중</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
      </Modal.Footer>
    </>
  );
}

export function AuthorityDeleteOneModalBody({
  reckey,
  controlNumber,
  onHide,
}: AuthorityDeleteModalProps & { reckey: string }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: deleteAuthorityRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authoritySearchQueryKeys.all,
      });
      onHide();
    },
  });

  const handleHide = () => {
    if (!isPending) {
      reset();
      onHide();
    }
  };

  return (
    <>
      <Modal.Header
        closeButton={!isPending}
        closeVariant="white"
        className="bg-primary text-white"
        onHide={handleHide}
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거자료 삭제
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {isError && (
          <Alert variant="danger" role="alert">
            전거자료를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.
          </Alert>
        )}

        <p className="mb-2">전거자료({controlNumber})를 삭제하시겠습니까?</p>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          variant="danger"
          className="px-4 fw-bold"
          disabled={isPending}
          onClick={() => mutate(reckey)}
        >
          {isPending ? "삭제 중..." : "삭제"}
        </Button>
        <Button
          variant="secondary"
          className="px-4 fw-bold"
          disabled={isPending}
          onClick={handleHide}
        >
          취소
        </Button>
      </Modal.Footer>
    </>
  );
}

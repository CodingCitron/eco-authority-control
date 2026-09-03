import { useState, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { Button, Modal } from "react-bootstrap";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchDeleteAuthorityRecord,
  fetchDeleteAuthorityRecords,
} from "@/api/authority-delete";
import { authoritySearchQueryKeys } from "@/hooks/use-authority-search";
import BaseModal from "@/components/ui/base-modal";
import { useSearchPage } from "./authority-search-page-context";

interface AuthorityDeleteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  recKey?: string;
  controlNumber?: string;
  showIcon?: boolean;
}

export function AuthorityDeleteButton({
  recKey,
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

    if (!recKey && selectedRecordKeys.length === 0) {
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
        recKey={recKey}
        controlNumber={controlNumber}
        show={show}
        onHide={() => setShow(false)}
      />
    </>
  );
}

interface AuthorityDeleteModalProps {
  recKey?: string;
  controlNumber?: string;
  show: boolean;
  onHide: () => void;
}

export default function AuthorityDeleteModal({
  recKey,
  controlNumber,
  show,
  onHide,
}: AuthorityDeleteModalProps) {
  return (
    <BaseModal size="lg" show={show} onHide={onHide}>
      {recKey ? (
        <AuthorityDeleteOneModalBody
          recKey={recKey}
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
  const queryClient = useQueryClient();
  const { selectedRecordKeys, clearSelectedRecordKeys } = useSearchPage();

  const {
    mutate,
    data: deleteResults,
    isPending,
    isError,
    reset,
  } = useMutation({
    mutationFn: () => fetchDeleteAuthorityRecords([...selectedRecordKeys]),
    onSuccess: async (results) => {
      await queryClient.invalidateQueries({
        queryKey: authoritySearchQueryKeys.all,
      });

      const deletedItems = results.data.items;
      const isEveryRecordDeleted =
        deletedItems.length === selectedRecordKeys.length &&
        deletedItems.every((item) => item.deleted);
      if (!isEveryRecordDeleted) {
        return;
      }

      const deletedCount = selectedRecordKeys.length;
      clearSelectedRecordKeys();
      window.alert(`전거자료 ${deletedCount}건을 삭제했습니다.`);
      onHide();
    },
  });

  const handleHide = () => {
    if (!isPending) {
      reset();
      onHide();
    }
  };

  const deletedCount =
    deleteResults?.data.items.filter((item) => item.deleted).length ?? 0;
  const incompleteDeleteCount = deleteResults
    ? Math.max(selectedRecordKeys.length - deletedCount, 0)
    : 0;

  return (
    <>
      <Modal.Header
        closeVariant="white"
        className="bg-primary text-white"
        closeButton={!isPending}
        onHide={handleHide}
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          전거자료 일괄 삭제
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isError && (
          <p role="alert">
            선택한 전거자료를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}
        {incompleteDeleteCount > 0 && (
          <p role="alert">
            선택한 전거자료 중 {incompleteDeleteCount}건이 삭제되지 않았습니다.
            검색 결과를 확인해 주세요.
          </p>
        )}

        <p className="mb-2">
          선택한 전거자료 {selectedRecordKeys.length}건을 일괄 삭제하시겠습니까?
        </p>
        <p className="mb-0 text-danger small">
          삭제한 전거자료는 복구할 수 없습니다.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          variant="danger"
          className="px-4 fw-bold"
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending ? "삭제 중..." : "일괄 삭제"}
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

export function AuthorityDeleteOneModalBody({
  recKey,
  controlNumber,
  onHide,
}: AuthorityDeleteModalProps & { recKey: string }) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, reset } = useMutation({
    mutationFn: fetchDeleteAuthorityRecord,
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
          <p role="alert">
            전거자료를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        <p className="mb-2">전거자료({controlNumber})를 삭제하시겠습니까?</p>
        <p className="mb-0 text-danger small">
          삭제한 전거자료는 복구할 수 없습니다.
        </p>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          variant="danger"
          className="px-4 fw-bold"
          disabled={isPending}
          onClick={() => mutate(recKey)}
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

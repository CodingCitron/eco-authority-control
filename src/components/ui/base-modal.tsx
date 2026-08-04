import { useState, type ReactNode } from "react";
import { Modal, type ModalProps } from "react-bootstrap";

export interface BaseModalProps extends ModalProps {
  children: ReactNode;
}

// 모달 껍데기
export default function BaseModal({
  show,
  children,
  size = "xl",
  backdrop = "static",
  centered = true,
  unmountBodyOnExit = true,
  onEnter,
  onExited,
  ...props
}: BaseModalProps) {
  const [isBodyMounted, setIsBodyMounted] = useState(show);

  const shouldRenderBody = !unmountBodyOnExit || show || isBodyMounted;

  return (
    <Modal
      {...props}
      size={size}
      backdrop={backdrop}
      centered={centered}
      show={show}
      onEnter={(...args) => {
        setIsBodyMounted(true);
        onEnter?.(...args);
      }}
      onExited={(...args) => {
        setIsBodyMounted(false);
        onExited?.(...args);
      }}
    >
      {shouldRenderBody && children}
    </Modal>
  );
}

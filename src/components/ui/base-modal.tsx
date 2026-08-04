import type { ReactNode } from "react";
import { Modal, type ModalProps } from "react-bootstrap";

export interface BaseModalProps extends ModalProps {
  children: ReactNode;
  title: string;
  headerClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
}

export default function BaseModal({
  children,
  title,
  headerClassName = "bg-primary text-white",
  footer,
  footerClassName = "justify-content-center",
  size = "xl",
  backdrop = "static",
  centered = true,
  ...props
}: BaseModalProps) {
  return (
    <Modal size={size} backdrop={backdrop} centered={centered} {...props}>
      <Modal.Header
        closeButton
        closeVariant="white"
        className={headerClassName}
      >
        <Modal.Title as="h2" className="h5 fw-bold">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      {footer !== undefined && (
        <Modal.Footer className={footerClassName}>{footer}</Modal.Footer>
      )}
    </Modal>
  );
}

import { useEffect } from "react";
import { ToastContainer } from "react-bootstrap";

import {
  useToastStore,
  type ToastMessage,
  type ToastType,
} from "@/stores/toast-store";

const TOAST_STYLE: Record<
  ToastType,
  { label: string; icon: string; background: "success" | "danger" | "info" }
> = {
  success: {
    label: "완료",
    icon: "bi-check-circle-fill",
    background: "success",
  },
  error: {
    label: "오류",
    icon: "bi-exclamation-circle-fill",
    background: "danger",
  },
  info: {
    label: "안내",
    icon: "bi-info-circle-fill",
    background: "info",
  },
};

export default function GlobalToastContainer() {
  const messages = useToastStore((state) => state.messages);
  const remove = useToastStore((state) => state.remove);

  return (
    <ToastContainer
      aria-label="알림"
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1090 }}
    >
      {messages.map((message) => (
        <GlobalToast
          key={message.id}
          message={message}
          onClose={remove}
        />
      ))}
    </ToastContainer>
  );
}

function GlobalToast({
  message,
  onClose,
}: {
  message: ToastMessage;
  onClose: (id: string) => void;
}) {
  const style = TOAST_STYLE[message.type];
  const isError = message.type === "error";

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => onClose(message.id),
      message.duration,
    );
    return () => window.clearTimeout(timeoutId);
  }, [message.duration, message.id, onClose]);

  return (
    <div
      className={`toast show border-0 text-white shadow bg-${style.background}`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="toast-body d-flex align-items-start gap-2">
        <i className={`bi ${style.icon} mt-1`} aria-hidden="true" />
        <div className="flex-grow-1">
          <strong className="d-block mb-1">{style.label}</strong>
          <span>{message.message}</span>
        </div>
        <button
          aria-label="알림 닫기"
          className="btn-close btn-close-white flex-shrink-0"
          onClick={() => onClose(message.id)}
          type="button"
        />
      </div>
    </div>
  );
}

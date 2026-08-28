import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

interface ToastState {
  messages: ToastMessage[];
  add: (
    type: ToastType,
    message: string,
    duration?: number,
  ) => string;
  remove: (id: string) => void;
  clear: () => void;
}

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 3000,
  info: 4000,
  error: 5000,
};

const MAX_TOAST_COUNT = 5;
let toastSequence = 0;

function createToastId() {
  toastSequence += 1;
  return `toast-${Date.now()}-${toastSequence}`;
}

export const useToastStore = create<ToastState>((set) => ({
  messages: [],
  add: (type, message, duration = DEFAULT_DURATION[type]) => {
    const id = createToastId();
    const nextMessage: ToastMessage = {
      id,
      type,
      message,
      duration,
    };

    set((state) => ({
      messages: [...state.messages, nextMessage].slice(-MAX_TOAST_COUNT),
    }));

    return id;
  },
  remove: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  clear: () => set({ messages: [] }),
}));

function showToast(type: ToastType, message: string, duration?: number) {
  return useToastStore.getState().add(type, message, duration);
}

export const toast = {
  success: (message: string, duration?: number) =>
    showToast("success", message, duration),
  error: (message: string, duration?: number) =>
    showToast("error", message, duration),
  info: (message: string, duration?: number) =>
    showToast("info", message, duration),
  dismiss: (id: string) => useToastStore.getState().remove(id),
  clear: () => useToastStore.getState().clear(),
};

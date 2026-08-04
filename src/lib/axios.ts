import { create } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("VITE_API_BASE_URL 값이 설정되지 않았습니다.");
}

export const apiClient = create({
  baseURL,
});

apiClient.interceptors.request.use();

apiClient.interceptors.response.use();

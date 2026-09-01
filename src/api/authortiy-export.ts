import { apiClient } from "@/lib/axios";

// 전거 반출 데이터 가져오기
// 전거 반출 데이터를 가져와서 다운로드를 진행하게 한다.
export async function fetchAuthorityExport() {
  const { data } = await apiClient.post("/ac/export");
  return data;
}

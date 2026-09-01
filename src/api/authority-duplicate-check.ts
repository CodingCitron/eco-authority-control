import { apiClient } from "@/lib/axios";

//

export async function fetchAuthorityDuplicateCheck() {
  const { data } = await apiClient.post("/ac/duplicate-check");

  return;
}

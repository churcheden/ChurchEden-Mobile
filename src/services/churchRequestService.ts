import { apiClient, apiUrl } from "../lib/apiClient";
import type { ChurchRequestForm } from "../types/api";

export interface ChurchRequestSubmit {
  churchName: string;
  city: string;
  leaderName: string;
  phoneContact: string;
  email: string;
}

export async function submitChurchRequest(data: ChurchRequestSubmit) {
  const res = await apiClient.post<{ status: string; message: string }>(
    apiUrl("/churches"),
    data
  );
  return res;
}
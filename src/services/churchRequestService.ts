// src/services/churchRequestService.ts
import { apiClient } from '../lib/apiClient';

export interface ChurchRequestSubmit {
  churchName: string;
  city: string;
  leaderName: string;
  phoneContact?: string;
  emailContact?: string;
}

export async function submitChurchRequest(data: ChurchRequestSubmit) {
  const res = await apiClient.post<{ status: string; message: string; churchRequest?: any }>(
    '/church-requests',
    data
  );
  return res;
}

export const churchRequestService = {
  submit: submitChurchRequest,
};
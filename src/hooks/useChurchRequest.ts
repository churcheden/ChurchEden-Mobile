// src/hooks/useChurchRequest.ts
import { useMutation } from '@tanstack/react-query';
import { churchRequestService, type ChurchRequestSubmit } from '../services/churchRequestService';
import { router } from 'expo-router';

export function useChurchRequest() {
  return useMutation({
    mutationFn: (data: ChurchRequestSubmit) => churchRequestService.submit(data),
    onSuccess: () => {
      router.push('/church-request-confirmation');
    },
  });
}
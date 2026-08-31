// src/hooks/useChurchRequest.ts
import { useMutation } from '@tanstack/react-query';
import { churchRequestService, type ChurchRequestSubmit } from '../services/churchRequestService';
import { router } from 'expo-router';

export function useChurchRequest() {
  return useMutation({
    mutationFn: (data: ChurchRequestSubmit) => churchRequestService.submit(data),
    onSuccess: (_, data) => {
      router.push({
        pathname: '/church-request-confirmation',
        params: {
          churchName: data.churchName,
          city: data.city,
          leaderName: data.leaderName,
          contactMode: data.phoneContact ? 'phone' : data.emailContact ? 'email' : '',
          phone: data.phoneContact ?? '',
          email: data.emailContact ?? '',
        },
      });
    },
  });
}
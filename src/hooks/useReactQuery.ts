import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, apiUrl } from "../lib/apiClient";
import type {
  User,
  MemberProfile,
  ChurchMembership,
  ChurchOnboardingDraft,
  CongregationSize,
  ChurchLanguage,
  MembershipStatus,
} from "../types/api";

export function useAuthQuery() {
  return useQuery<User, Error>({
    queryKey: ["/auth/me"],
    queryFn: async () => {
      const res = await apiClient.get<User>("/auth/me");
      return res;
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useOnboardingDraftQuery() {
  return useQuery<ChurchOnboardingDraft | null, Error>({
    queryKey: ["/onboarding/church/draft"],
    queryFn: async () => {
      const res = await apiClient.get<ChurchOnboardingDraft>("/onboarding/church/draft");
      return res;
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useMemberProfileQuery() {
  return useQuery<MemberProfile | null, Error>({
    queryKey: ["/members/profile"],
    queryFn: async () => {
      const res = await apiClient.get<MemberProfile>("/members/profile");
      return res;
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useJoinRequestsQuery(filters?: { status?: MembershipStatus; churchId?: string }) {
  return useQuery<ChurchMembership[], Error>({
    queryKey: ["/join-requests", filters],
    queryFn: async () => {
      const res = await apiClient.get<ChurchMembership[]>("/join-requests", { params: filters });
      return res;
    },
    staleTime: 60_000,
    retry: false,
  });
}

export function useBanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { membershipId: string; banReason?: string }) => {
      const res = await apiClient.post<{ status: string; message: string; membership: ChurchMembership }>(apiUrl("/join-requests/ban"), {
        membershipId: vars.membershipId,
        banReason: vars.banReason,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/join-requests"] });
    },
  });
}

export function useUnbanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { membershipId: string }) => {
      const res = await apiClient.post<{ status: string; message: string; membership: ChurchMembership }>(apiUrl("/join-requests/unban"), {
        membershipId: vars.membershipId,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/join-requests"] });
    },
  });
}

export function useApproveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { membershipId: string }) => {
      const res = await apiClient.post<{ status: string; message: string }>(apiUrl("/join-requests/approve"), {
        membershipId: vars.membershipId,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/join-requests"] });
    },
  });
}

export function useRejectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vars: { membershipId: string; rejectionReason?: string }) => {
      const res = await apiClient.post<{ status: string; message: string }>(apiUrl("/join-requests/reject"), {
        membershipId: vars.membershipId,
        rejectionReason: vars.rejectionReason,
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/join-requests"] });
    },
  });
}

export function useCompleteOnboardingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post<{ status: string; message: string }>(apiUrl("/onboarding/church/complete"));
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/onboarding/church/draft"] });
    },
  });
}

export function useSaveStep1Mutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      firstName: string;
      lastName: string;
      churchName: string;
      denomination: string;
      congregationSize: CongregationSize;
      foundedYear?: number;
    }) => {
      const res = await apiClient.patch<{ status: string }>(apiUrl("/onboarding/church/step-1"), payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/onboarding/church/draft"] });
    },
  });
}

export function useSaveStep2Mutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      country: string;
      city: string;
      address: string;
      phone: string;
      email: string;
      primaryLanguage: ChurchLanguage;
      timeZone: string;
    }) => {
      const res = await apiClient.patch<{ status: string }>(apiUrl("/onboarding/church/step-2"), payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/onboarding/church/draft"] });
    },
  });
}

export function useSaveStep3Mutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      serviceTimes: { label: string; dayOfWeek: number; time: string }[];
      logoFile?: File | null;
    }) => {
      const formData = new FormData();
      formData.append("serviceTimes", JSON.stringify(payload.serviceTimes));
      if (payload.logoFile) {
        formData.append("logo", payload.logoFile);
      }
      const res = await apiClient.patch<{ status: string }>(apiUrl("/onboarding/church/step-3"), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/onboarding/church/draft"] });
    },
  });
}

export function useSaveStep4Mutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      ministryIds: string[];
      customMinistries: {
        name: string;
        type: "MINISTRY" | "DEPARTMENT";
        description?: string;
        icon?: string;
      }[];
    }) => {
      const res = await apiClient.patch<{ status: string }>(apiUrl("/onboarding/church/step-4"), payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/onboarding/church/draft"] });
    },
  });
}
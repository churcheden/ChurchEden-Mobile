import { useState, useEffect, useCallback } from "react";
import { apiClient, AppError } from "../lib/apiClient";
import type {
  User,
  MemberProfile,
  ChurchMembership,
  ChurchOnboardingDraft,
  MembershipStatus,
} from "../types/api";

export function useCurrentUser() {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<User>("/auth/me");
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof AppError ? err : new AppError("UNKNOWN_ERROR", (err as Error).message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { data, isLoading, error, refetch: fetchUser };
}

export function useOnboardingDraft() {
  const [data, setData] = useState<ChurchOnboardingDraft | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchDraft = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<ChurchOnboardingDraft>("/onboarding/church/draft");
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof AppError ? err : new AppError("UNKNOWN_ERROR", (err as Error).message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  return { data, isLoading, error, refetch: fetchDraft };
}

export function useMemberProfile() {
  const [data, setData] = useState<MemberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<MemberProfile>("/members/profile");
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof AppError ? err : new AppError("UNKNOWN_ERROR", (err as Error).message));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, isLoading, error, refetch: fetchProfile };
}

export function useJoinRequests(filters?: { status?: MembershipStatus; churchId?: string }) {
  const [data, setData] = useState<ChurchMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get<ChurchMembership[]>("/join-requests", { params: filters });
      setData(res || []);
      setError(null);
    } catch (err) {
      setError(err instanceof AppError ? err : new AppError("UNKNOWN_ERROR", (err as Error).message));
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.churchId]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { data, isLoading, error, refetch: fetchRequests };
}

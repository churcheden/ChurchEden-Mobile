import { apiClient } from '../lib/apiClient';
import type { AttendanceRecord, ApiResponse } from '../types';

export const AttendanceService = {
  async recordScanCheckIn(qrData: string, serviceId: string): Promise<ApiResponse<AttendanceRecord>> {
    try {
      const data = await apiClient.post<AttendanceRecord>('/attendance/scan', {
        qrData,
        serviceId,
        scannedAt: new Date().toISOString(),
      });
      return { success: true, data: (data as any)?.data ?? data };
    } catch (err: any) {
      return { success: false, data: null as unknown as AttendanceRecord, error: err.message || 'Scan failed' };
    }
  },

  async getRecentAttendanceHistory(): Promise<ApiResponse<AttendanceRecord[]>> {
    try {
      const data = await apiClient.get<AttendanceRecord[]>('/attendance/history');
      return { success: true, data: (data as any)?.data ?? data };
    } catch (err: any) {
      return { success: false, data: [], error: err.message || 'Failed to fetch history' };
    }
  },

  async getActiveServiceSession(): Promise<ApiResponse<{ serviceId: string; name: string; date: string }>> {
    try {
      const data = await apiClient.get<{ serviceId: string; name: string; date: string }>('/attendance/active-session');
      return { success: true, data: (data as any)?.data ?? data };
    } catch (err: any) {
      return { success: false, data: null as any, error: err.message || 'Failed to fetch active session' };
    }
  },
};

export default AttendanceService;

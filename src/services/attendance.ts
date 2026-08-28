import api from './api';
import { AttendanceRecord, ApiResponse } from '../types';

export const AttendanceService = {
  async recordScanCheckIn(qrData: string, serviceId: string): Promise<ApiResponse<AttendanceRecord>> {
    // Call ChurchEden API endpoint for attendance registration
    return api.post<AttendanceRecord>('/attendance/scan', {
      qrData,
      serviceId,
      scannedAt: new Date().toISOString()
    });
  },

  async getRecentAttendanceHistory(): Promise<ApiResponse<AttendanceRecord[]>> {
    return api.get<AttendanceRecord[]>('/attendance/history');
  },

  async getActiveServiceSession(): Promise<ApiResponse<{ serviceId: string; name: string; date: string }>> {
    return api.get('/attendance/active-session');
  }
};

export default AttendanceService;

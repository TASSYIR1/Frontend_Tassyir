import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const analyticsService = {
  async getDashboard(): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>('/api/analytics/dashboard');
    return res.data;
  },

  async getPaymentsSummary(): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>('/api/analytics/payments/summary');
    return res.data;
  },

  async getClassSizes(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/analytics/classes/size');
    return res.data;
  },

  async getTeacherWorkload(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/analytics/teachers/workload');
    return res.data;
  },

  async getActiveSubscriptions(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/analytics/subscriptions/active');
    return res.data;
  },

  // ─── Exports ────────────────────────────────────────────────────────────

  async exportPdf(): Promise<void> {
    await apiClient.download('/api/analytics/export/pdf', 'analytics.pdf');
  },

  async exportExcel(): Promise<void> {
    await apiClient.download('/api/analytics/export/excel', 'analytics.xlsx');
  },
};

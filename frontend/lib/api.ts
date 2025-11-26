import axios from 'axios';
import { Course, CreateOrderRequest, CreateOrderResponse, CapturePaymentRequest, CapturePaymentResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const courseApi = {
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/courses');
    return response.data;
  },

  getCourse: async (id: number): Promise<Course> => {
    const response = await api.get<Course>(`/courses/${id}`);
    return response.data;
  },
};

export const paymentApi = {
  createOrder: async (request: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await api.post<CreateOrderResponse>('/payment/create-order', request);
    return response.data;
  },

  captureOrder: async (request: CapturePaymentRequest): Promise<CapturePaymentResponse> => {
    const response = await api.post<CapturePaymentResponse>('/payment/capture-order', request);
    return response.data;
  },
};

export const adminApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },

  getCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/admin/courses');
    return response.data;
  },

  createCourse: async (data: Omit<Course, 'id' | 'finalPrice' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/admin/courses', data);
    return response.data;
  },

  updateCourse: async (id: number, data: Partial<Course>) => {
    const response = await api.put(`/admin/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: number) => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getPurchases: async (page = 1, pageSize = 20) => {
    const response = await api.get('/admin/purchases', {
      params: { page, pageSize },
    });
    return response.data;
  },

  getCourseCustomers: async (courseId: number) => {
    const response = await api.get(`/admin/courses/${courseId}/customers`);
    return response.data;
  },
};

export type { Course };

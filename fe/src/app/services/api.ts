import axios, { AxiosResponse } from 'axios';
import { ApiResponse, User, Product, Order, DashboardStats } from '../types';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.bopi.vercel.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  profile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};

// Products API
export const productsApi = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get(`/products?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'variants'>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  getAll: async (page = 1, limit = 10, status = ''): Promise<ApiResponse<Order[]>> => {
    const response = await apiClient.get(`/orders?page=${page}&limit=${limit}&status=${status}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Order>> => {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (page = 1, limit = 10, search = ''): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get(`/users?page=${page}&limit=${limit}&search=${search}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  dashboardApi, 
  productsApi, 
  ordersApi, 
  usersApi 
} from '../services/api';

// Dashboard Hook
export const useDashboardStats = () => {
  return useQuery('dashboard-stats', dashboardApi.getStats, {
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });
};

// Products Hooks
export const useProducts = (page = 1, limit = 10, search = '') => {
  return useQuery(
    ['products', page, limit, search], 
    () => productsApi.getAll(page, limit, search),
    { keepPreviousData: true }
  );
};

export const useProduct = (id: string) => {
  return useQuery(['product', id], () => productsApi.getById(id));
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(productsApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: any }) => productsApi.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      },
    }
  );
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(productsApi.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};

// Orders Hooks
export const useOrders = (page = 1, limit = 10, status = '') => {
  return useQuery(
    ['orders', page, limit, status], 
    () => ordersApi.getAll(page, limit, status),
    { keepPreviousData: true }
  );
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, status }: { id: string; status: any }) => ordersApi.updateStatus(id, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      },
    }
  );
};

// Users Hooks
export const useUsers = (page = 1, limit = 10, search = '') => {
  return useQuery(
    ['users', page, limit, search], 
    () => usersApi.getAll(page, limit, search),
    { keepPreviousData: true }
  );
};

// Local Storage Hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};
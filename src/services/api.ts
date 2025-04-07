import axios from 'axios';
import { MenuItem } from '../types/types';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://whatever-relief-graphs-sims.trycloudflare.com',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add user data
api.interceptors.request.use((config) => {
    const userDataStr = localStorage.getItem('telegram_user');
    if (userDataStr) {
        config.headers.user = userDataStr; // Send as string since backend expects it that way
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    response => response.data,
    error => {
        console.error('API Error:', error);
        if (error.response) {
            // Server responded with error
            throw error.response.data;
        } else if (error.request) {
            // Request made but no response
            throw { message: 'No response from server' };
        }
        // Other errors
        throw { message: 'Request failed' };
    }
);

interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

interface OrderResponse extends ApiResponse {
    orderId?: string;
}

interface AdminVerifyResponse extends ApiResponse {
    isAdmin: boolean;
}

// API methods
export const createOrder = async (orderData: any): Promise<OrderResponse> => {
    try {
        return await api.post('/orders', orderData);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const getMenu = async (): Promise<MenuItem[]> => {
    try {
        return await api.get('/menu');
    } catch (error) {
        console.error('Error fetching menu:', error);
        throw error;
    }
};

// Admin API methods
export const verifyAdmin = async (userData: any): Promise<AdminVerifyResponse> => {
    try {
        return await api.post('/admin/verify', userData);
    } catch (error: any) {
        console.error('Admin verification error:', error);
        return {
            success: false,
            isAdmin: false,
            message: error?.message || 'Admin verification failed'
        };
    }
};

export const adminLogin = async (userData: any): Promise<AdminVerifyResponse> => {
    try {
        return await api.post('/admin/login', userData);
    } catch (error) {
        console.error('Admin login error:', error);
        throw error;
    }
};

export const addProduct = async (productData: FormData): Promise<ApiResponse> => {
    try {
        return await api.post('/admin/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

export const updateProduct = async (id: number, productData: FormData): Promise<ApiResponse> => {
    try {
        return await api.put(`/admin/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id: number): Promise<ApiResponse> => {
    try {
        return await api.delete(`/admin/products/${id}`);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

export const getOrders = async () => {
    try {
        return await api.get('/admin/orders');
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (id: string, status: string): Promise<ApiResponse> => {
    try {
        return await api.put(`/admin/orders/${id}/status`, { status });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};
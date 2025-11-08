// src/services/posOrderService.js
import { getAuthToken } from '../utils/auth';

const API_BASE_URL = 'https://vercel-mr-clement-pos-backend.vercel.app/api/restaurant/pos_order';

const getHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    console.warn('No authentication token found');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    throw new Error('Authentication failed. Please ensure you are logged in.');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const posOrderService = {
  // Create a new POS order
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update an existing POS order
  updateOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/update`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(orderData)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/getbyid/${orderId}`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getall`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // Get my orders (authenticated user's orders)
  getMyOrders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/my-orders`, {
        method: 'GET',
        headers: getHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching my orders:', error);
      throw error;
    }
  }
};
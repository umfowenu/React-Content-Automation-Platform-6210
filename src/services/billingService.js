import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const billingService = {
  async getSubscription() {
    try {
      const response = await api.get('/billing/subscription');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch subscription' };
    }
  },

  async getPlans() {
    try {
      const response = await api.get('/billing/plans');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch plans' };
    }
  },

  async createSubscription(planId, paymentMethodId) {
    try {
      const response = await api.post('/billing/subscription', {
        planId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create subscription' };
    }
  },

  async updateSubscription(subscriptionId, planId) {
    try {
      const response = await api.put(`/billing/subscription/${subscriptionId}`, {
        planId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update subscription' };
    }
  },

  async cancelSubscription(subscriptionId) {
    try {
      const response = await api.delete(`/billing/subscription/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to cancel subscription' };
    }
  },

  async getPaymentMethods() {
    try {
      const response = await api.get('/billing/payment-methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch payment methods' };
    }
  },

  async addPaymentMethod(paymentMethodId) {
    try {
      const response = await api.post('/billing/payment-methods', {
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add payment method' };
    }
  },

  async deletePaymentMethod(paymentMethodId) {
    try {
      const response = await api.delete(`/billing/payment-methods/${paymentMethodId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete payment method' };
    }
  },

  async getInvoices() {
    try {
      const response = await api.get('/billing/invoices');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch invoices' };
    }
  },

  async downloadInvoice(invoiceId) {
    try {
      const response = await api.get(`/billing/invoices/${invoiceId}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to download invoice' };
    }
  },

  async getUsage() {
    try {
      const response = await api.get('/billing/usage');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch usage data' };
    }
  }
};
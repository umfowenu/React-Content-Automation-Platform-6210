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

export const campaignService = {
  async getCampaigns(params = {}) {
    try {
      const response = await api.get('/campaigns', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch campaigns' };
    }
  },

  async getCampaign(id) {
    try {
      const response = await api.get(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch campaign' };
    }
  },

  async createCampaign(campaignData) {
    try {
      const response = await api.post('/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create campaign' };
    }
  },

  async updateCampaign(id, campaignData) {
    try {
      const response = await api.put(`/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update campaign' };
    }
  },

  async deleteCampaign(id) {
    try {
      const response = await api.delete(`/campaigns/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete campaign' };
    }
  },

  async cloneCampaign(id) {
    try {
      const response = await api.post(`/campaigns/${id}/clone`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to clone campaign' };
    }
  },

  async pauseCampaign(id) {
    try {
      const response = await api.post(`/campaigns/${id}/pause`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to pause campaign' };
    }
  },

  async resumeCampaign(id) {
    try {
      const response = await api.post(`/campaigns/${id}/resume`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to resume campaign' };
    }
  },

  async getCampaignContent(id, params = {}) {
    try {
      const response = await api.get(`/campaigns/${id}/content`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch campaign content' };
    }
  },

  async getCampaignAnalytics(id, dateRange = {}) {
    try {
      const response = await api.get(`/campaigns/${id}/analytics`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch campaign analytics' };
    }
  },

  async testCampaign(id) {
    try {
      const response = await api.post(`/campaigns/${id}/test`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to test campaign' };
    }
  }
};
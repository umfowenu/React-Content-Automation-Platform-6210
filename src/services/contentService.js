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

export const contentService = {
  async generateContent(params) {
    try {
      const response = await api.post('/content/generate', params);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate content' };
    }
  },

  async getContent(id) {
    try {
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  },

  async updateContent(id, contentData) {
    try {
      const response = await api.put(`/content/${id}`, contentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update content' };
    }
  },

  async publishContent(id, publishData) {
    try {
      const response = await api.post(`/content/${id}/publish`, publishData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to publish content' };
    }
  },

  async scheduleContent(id, scheduleData) {
    try {
      const response = await api.post(`/content/${id}/schedule`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to schedule content' };
    }
  },

  async analyzeContent(id) {
    try {
      const response = await api.post(`/content/${id}/analyze`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze content' };
    }
  },

  async generateImages(contentId, imageParams) {
    try {
      const response = await api.post(`/content/${contentId}/images`, imageParams);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate images' };
    }
  },

  async optimizeSEO(contentId, seoParams) {
    try {
      const response = await api.post(`/content/${contentId}/seo`, seoParams);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to optimize SEO' };
    }
  },

  async getTemplates() {
    try {
      const response = await api.get('/content/templates');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch templates' };
    }
  },

  async createTemplate(templateData) {
    try {
      const response = await api.post('/content/templates', templateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create template' };
    }
  }
};
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

export const integrationService = {
  // RSS Feed Integration
  async parseRSSFeed(url) {
    try {
      const response = await api.post('/integrations/rss/parse', { url });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to parse RSS feed' };
    }
  },

  async getRSSFeeds() {
    try {
      const response = await api.get('/integrations/rss');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch RSS feeds' };
    }
  },

  async addRSSFeed(feedData) {
    try {
      const response = await api.post('/integrations/rss', feedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add RSS feed' };
    }
  },

  // YouTube Integration
  async getYouTubeVideoData(videoId) {
    try {
      const response = await api.get(`/integrations/youtube/video/${videoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch YouTube video data' };
    }
  },

  async searchYouTubeVideos(query, params = {}) {
    try {
      const response = await api.get('/integrations/youtube/search', {
        params: { query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search YouTube videos' };
    }
  },

  // Amazon Integration
  async getAmazonProductData(productId) {
    try {
      const response = await api.get(`/integrations/amazon/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch Amazon product data' };
    }
  },

  async searchAmazonProducts(query, params = {}) {
    try {
      const response = await api.get('/integrations/amazon/search', {
        params: { query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search Amazon products' };
    }
  },

  // WordPress Integration
  async getWordPressSites() {
    try {
      const response = await api.get('/integrations/wordpress/sites');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch WordPress sites' };
    }
  },

  async addWordPressSite(siteData) {
    try {
      const response = await api.post('/integrations/wordpress/sites', siteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add WordPress site' };
    }
  },

  async testWordPressConnection(siteId) {
    try {
      const response = await api.post(`/integrations/wordpress/sites/${siteId}/test`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to test WordPress connection' };
    }
  },

  async publishToWordPress(siteId, postData) {
    try {
      const response = await api.post(`/integrations/wordpress/sites/${siteId}/publish`, postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to publish to WordPress' };
    }
  },

  // AI Integration
  async generateWithAI(prompt, params = {}) {
    try {
      const response = await api.post('/integrations/ai/generate', {
        prompt,
        ...params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate with AI' };
    }
  },

  async analyzeWithAI(content, analysisType) {
    try {
      const response = await api.post('/integrations/ai/analyze', {
        content,
        analysisType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze with AI' };
    }
  },

  // SEO Integration
  async getKeywordData(keyword) {
    try {
      const response = await api.get(`/integrations/seo/keyword/${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch keyword data' };
    }
  },

  async analyzeSEO(content) {
    try {
      const response = await api.post('/integrations/seo/analyze', { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to analyze SEO' };
    }
  }
};
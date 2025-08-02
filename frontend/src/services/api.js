import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const recommendationAPI = {
  // Basic recommendation
  getBasicRecommendation: async (jobDescription, topK = 10) => {
    const response = await api.post('/recommend', {
      job_description: jobDescription,
      top_k: topK,
    });
    return response.data;
  },

  // Weighted recommendation
  getWeightedRecommendation: async (jobDescription, weights, topK = 10) => {
    const response = await api.post('/recommend/weighted', {
      job_description: jobDescription,
      top_k: topK,
      weights: weights,
    });
    return response.data;
  },
};

export default api; 
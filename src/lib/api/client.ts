import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError } from '../utils';
import { API_ENDPOINTS } from './endpoints';

// Create a base API client
const apiClient: AxiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

// Generic API methods
export const api = {
  /**
   * Make a GET request
   */
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Make a POST request
   */
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Upload a file using FormData
   */
  uploadFile: async <T>(url: string, file: File, fieldName: string = 'file', extraData?: Record<string, any>): Promise<T> => {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      // Add any extra form data if provided
      if (extraData) {
        Object.entries(extraData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      
      const response: AxiosResponse<T> = await apiClient.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default api; 
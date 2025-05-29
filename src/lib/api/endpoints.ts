// Base API URL - should be configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // PDF upload and processing endpoints
  UPLOAD_PDF: `${API_BASE_URL}/upload`,
  SAVE_CONFIG: `${API_BASE_URL}/save`,
  GET_CONFIG: `${API_BASE_URL}/configurations`,
  GET_CONFIG_BY_NAME: `${API_BASE_URL}/edit`,
  DELETE_CONFIG: `${API_BASE_URL}/delete`,
  EXTRACT_PDF: `${API_BASE_URL}/extract`,
}; 
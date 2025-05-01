// Base API URL - should be configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // PDF upload and processing endpoints
  UPLOAD_PDF: `${API_BASE_URL}/upload`,
  CHECK_STATUS: `${API_BASE_URL}/status`,
  DOWNLOAD_EXCEL: `${API_BASE_URL}/download`,
}; 
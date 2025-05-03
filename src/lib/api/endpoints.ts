// Base API URL - should be configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  // Base URL
  BASE_URL: API_BASE_URL,
  
  // PDF upload and processing endpoints
  UPLOAD_PDF: `${API_BASE_URL}/upload`,
  SUBMIT_SELECTIONS: `${API_BASE_URL}/submit-selections`,
}; 
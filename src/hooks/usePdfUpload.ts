import api from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ConfigurePdfResponse } from '@/types/api';
import { useState } from 'react';
import { toast } from 'sonner';

export type UploadResult = ConfigurePdfResponse;

export function usePdfUpload() {
  const [isLoading, setIsLoading] = useState(false);

  const configurePdf = async (file: File): Promise<ConfigurePdfResponse> => {
    setIsLoading(true);

    try {
      // Use our API client to upload the file
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('mode', 'configure');
      
      const response = await api.post<ConfigurePdfResponse>(
        API_ENDPOINTS.UPLOAD_PDF,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Data configuration initiated successfully');
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error('Configuration upload failed:', error);
      toast.error('Failed to process file for configuration. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const extractPdf = async (file: File, configName: string): Promise<Blob> => {
    setIsLoading(true);

    try {
      // Use our API client to upload the file for extraction
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('mode', 'extract');
      formData.append('config_name', configName);
      
      // Log extraction details for debugging
      console.warn('Extracting PDF:', {
        configName,
        fileName: file.name,
        fileSize: file.size,
        formData: formData
      });
      
      const response = await api.post<Blob>(
        API_ENDPOINTS.EXTRACT_PDF,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
          timeout: 60000 // 1 minute timeout
        }
      );

      toast.success('Data extracted successfully');
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error('Extraction failed:', error);
      toast.error('Failed to extract data. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    configurePdf,
    extractPdf,
    isLoading
  };
}

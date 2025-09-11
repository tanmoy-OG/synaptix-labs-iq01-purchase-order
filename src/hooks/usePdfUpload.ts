import api from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ConfigurePdfResponse } from '@/types/api';
import { useState } from 'react';
import { toast } from 'sonner';

export type UploadResult = ConfigurePdfResponse;

export function usePdfUpload() {
  const [isLoading, setIsLoading] = useState(false);

  const configurePdf = async (file: File, uid: string): Promise<ConfigurePdfResponse> => {
    setIsLoading(true);

    try {
      // Use our API client to upload the file
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('mode', 'configure');
      formData.append('uid', uid);

      const response = await api.post<ConfigurePdfResponse>(API_ENDPOINTS.UPLOAD_PDF, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Data configuration initiated successfully');
      return response;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const extractPdf = async (file: File, configName: string, uid: string): Promise<Blob> => {
    setIsLoading(true);

    try {
      // Use our API client to upload the file for extraction
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('mode', 'extract');
      formData.append('config_name', configName);
      formData.append('uid', uid);

      // Log extraction details for debugging
      console.warn('Extracting PDF:', {
        configName,
        fileName: file.name,
        fileSize: file.size,
        uid,
        formData: formData,
      });

      const response = await api.post<Blob>(API_ENDPOINTS.EXTRACT_PDF, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
        timeout: 300000, // 5 minutes timeout
      });

      toast.success('Data extracted successfully');
      return response;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    configurePdf,
    extractPdf,
    isLoading,
  };
}

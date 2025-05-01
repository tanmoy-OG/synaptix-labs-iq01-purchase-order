import api from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { UploadResponse } from '@/types/api';
import { useState } from 'react';
import { toast } from "sonner";

export type UploadResult = UploadResponse;

export function usePdfUpload() {
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const uploadPdf = async (file: File): Promise<UploadResult> => {
    setIsLoading(true);
    // setError(null);
    
    try {
      // Use our API client to upload the file
      console.log("Uploading file:", file);
      const response = await api.uploadFile<UploadResult>(
        API_ENDPOINTS.UPLOAD_PDF,
        file
      );
      
      setResult(response);
      toast.success("File uploaded successfully");
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error("Upload failed:", error);
      toast.error("Failed to upload file. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const checkProcessingStatus = async (id: string): Promise<UploadResult> => {
  //   setIsLoading(true);
  //   // setError(null);
    
  //   try {
  //     const response = await api.get<UploadResult>(
  //       `${API_ENDPOINTS.CHECK_STATUS}/${id}`
  //     );
      
  //     setResult(response);
  //     return response;
  //   } catch (err) {
  //     const error = err instanceof Error ? err : new Error('An unknown error occurred');
  //     // setError(error);
  //     console.error("Upload failed:", error);
  //     toast.error("Failed to upload file. Please try again.");
  //     // throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return {
    uploadPdf,
    // checkProcessingStatus,
    isLoading,
    // error,
    result,
  };
} 
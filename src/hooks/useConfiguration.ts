import api from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ConfigurePdfResponse } from "@/types/api";
import { useState } from "react";
import { toast } from "sonner";

export function useConfiguration() {
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState<ConfigurePdfResponse | null>(null);

  const saveConfiguration = async (config: ConfigurePdfResponse): Promise<void> => {
    setIsLoading(true);
    try {
      const configString = JSON.stringify(config);
      const res = await api.post(API_ENDPOINTS.SAVE, configString, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConfiguration(config);
      console.log(res);
      console.log(config);
      toast.success(`Configuration "${config.name}" saved successfully`);
    } catch (error) {
      console.error('Failed to save configuration:', error);
      toast.error('Failed to save configuration. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfiguration = (config: ConfigurePdfResponse) => {
    setConfiguration(config);
  };

  const resetConfiguration = () => {
    setConfiguration(null);
  };

  return {
    configuration,
    isLoading,
    saveConfiguration,
    updateConfiguration,
    resetConfiguration
  };
} 
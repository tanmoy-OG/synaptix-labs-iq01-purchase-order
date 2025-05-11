import api from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ConfigurePdfResponse } from "@/types/api";
import axios from "axios";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export interface Configuration {
  id: string;
  name: string;
}

export function useConfiguration() {
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState<ConfigurePdfResponse | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const isFetching = useRef(false);

  const fetchConfigurations = useCallback(async (): Promise<Configuration[]> => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) {
      return configurations;
    }

    isFetching.current = true;
    setIsLoading(true);

    try {
      const response = await api.get<Configuration[]>(API_ENDPOINTS.GET_CONFIG);
      
      // Ensure response is an array
      if (!Array.isArray(response)) {
        throw new Error('Invalid response format from server');
      }

      // Validate each configuration has required fields
      const validConfigurations = response.filter(config => 
        config && typeof config === 'object' && 
        'id' in config && 'name' in config
      );

      setConfigurations(validConfigurations);
      return validConfigurations;
    } catch (error) {
      console.error('Failed to fetch configurations:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch configurations';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [configurations]);

  const saveConfiguration = useCallback(async (config: ConfigurePdfResponse): Promise<void> => {
    setIsLoading(true);
    try {
      const configString = JSON.stringify(config);
      const res = await api.post(API_ENDPOINTS.SAVE_CONFIG, configString, {
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
      
      // Handle 409 Conflict error specifically
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(`A configuration with the name "${config.name}" already exists. Please choose a different name.`);
      } else {
        toast.error('Failed to save configuration. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfiguration = useCallback((config: ConfigurePdfResponse) => {
    setConfiguration(config);
  }, []);

  const resetConfiguration = useCallback(() => {
    setConfiguration(null);
  }, []);

  return {
    configuration,
    configurations,
    isLoading,
    saveConfiguration,
    updateConfiguration,
    resetConfiguration,
    fetchConfigurations
  };
} 
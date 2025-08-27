import api from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { ConfigurePdfResponse } from '@/types/api';
import axios from 'axios';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

export interface Configuration {
  id: string;
  name: string;
}

export function useConfiguration() {
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState<ConfigurePdfResponse | null>(null);
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const isFetching = useRef(false);

  const fetchConfigurations = useCallback(
    async (uid: string): Promise<Configuration[]> => {
      // Prevent multiple simultaneous fetches
      if (isFetching.current) {
        return configurations;
      }

      isFetching.current = true;
      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append('uid', uid);
        const response = await api.post<Configuration[]>(API_ENDPOINTS.GET_CONFIG, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Ensure response is an array
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format from server');
        }

        // Validate each configuration has required fields
        const validConfigurations = response.filter(
          config => config && typeof config === 'object' && 'id' in config && 'name' in config
        );

        setConfigurations(validConfigurations);
        return validConfigurations;
      } catch (error) {
        console.error('Failed to fetch configurations:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch configurations';
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    },
    [configurations]
  );

  const saveConfiguration = useCallback(
    async (config: ConfigurePdfResponse, uid: string): Promise<void> => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        const configString = JSON.stringify(config);
        console.log("🚀 ~ useConfiguration ~ configString:", configString)
        formData.append('config', configString)
        formData.append('uid', uid);
        console.log("🚀 ~ useConfiguration ~ uid:", uid)

        const res = await api.post(
          API_ENDPOINTS.SAVE_CONFIG,
          formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
          toast.error(
            `A configuration with the name "${config.name}" already exists. Please choose a different name.`
          );
        } else {
          toast.error('Failed to save configuration. Please try again.');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const editConfiguration = useCallback(
    async (name: string, uid: string): Promise<ConfigurePdfResponse> => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('config_name', name);
        formData.append('uid', uid);
        const response = await api.post<ConfigurePdfResponse>(
          API_ENDPOINTS.GET_CONFIG_BY_NAME,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        setConfiguration(response);
        return response;
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          toast.error('Configuration does not exist');
        } else {
          toast.error('Failed to fetch configuration details. Please try again.');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteConfiguration = useCallback(async (name: string, uid: string): Promise<void> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('config_name', name);
      formData.append('uid', uid);

      await api.post(API_ENDPOINTS.DELETE_CONFIG, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setConfigurations(prev => prev.filter(config => config.name !== name));
      toast.success(`Configuration "${name}" deleted successfully`);
    } catch (error) {
      console.error('Failed to delete configuration:', error);
      toast.error('Failed to delete configuration. Please try again.');
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
    fetchConfigurations,
    editConfiguration,
    deleteConfiguration,
  };
}

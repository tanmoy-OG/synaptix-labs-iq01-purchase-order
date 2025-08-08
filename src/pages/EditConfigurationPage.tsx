import { FieldConfigurationView } from "@/components/FieldConfigurationView";
import { FieldsSelectionView } from "@/components/FieldsSelectionView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfiguration } from "@/hooks/useConfiguration";
import { usePdfUpload } from "@/hooks/usePdfUpload";
import { auth } from "@/lib/firebase";
import { ConfigurePdfResponse } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function EditConfigurationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { editConfiguration, saveConfiguration, isLoading: isSaving } = useConfiguration();
  const { isLoading: isExtracting } = usePdfUpload();
  const [config, setConfig] = useState<ConfigurePdfResponse | null>(null);
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  const configName = location.state?.name as string;

  useEffect(() => {
    if (!configName) {
      toast.error("No configuration selected");
      navigate('/configurations');
      return;
    }

    if (!auth.currentUser?.uid) {
      toast.error("User not authenticated");
      navigate('/configurations');
      return;
    }

    const loadConfiguration = async () => {
      try {
        const data = await editConfiguration(configName, auth.currentUser.uid);
        setConfig(data);
      } catch (error) {
        console.error('Error loading configuration:', error);
        navigate('/configurations');
      }
    };

    loadConfiguration();
  }, [configName, editConfiguration, navigate]);

  const handleFieldSelect = useCallback((section: "header" | "item", fieldId: string, selected: boolean) => {
    if (!config) return;

    setConfig(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [fieldId]: {
            ...prev[section][fieldId],
            selected
          }
        }
      };
    });
  }, [config]);

  const handleSubmit = () => {
    if (!config) return;

    const hasSelectedFields = Object.values(config.header).some(field => field.selected) ||
                            Object.values(config.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error("Please select at least one field");
      return;
    }

    setShowFieldConfig(true);
  };

  const handleSave = async (newConfig: ConfigurePdfResponse) => {
    if (!auth.currentUser?.uid) {
      toast.error("User not authenticated");
      return;
    }

    try {
      // First save the configuration
      await saveConfiguration(newConfig, auth.currentUser.uid);
      
      // Navigate back to the edit configuration page
      navigate('/configurations');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration. Please try again.');
    }
  };

  const handleCancel = useCallback(() => {
    navigate('/configurations');
  }, [navigate]);

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Edit Configuration: {config.name}</CardTitle>
        </CardHeader>
        <CardContent>
        {showFieldConfig ? (
            <FieldConfigurationView
              fieldConfig={config}
              onSave={handleSave}
              onCancel={() => setShowFieldConfig(false)}
              isSaving={isSaving}
              isExtracting={isExtracting}
            />
          ) : (
            <FieldsSelectionView
              config={config}
              onFieldSelect={handleFieldSelect}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
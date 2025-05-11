import { FieldConfigurationView } from "@/components/FieldConfigurationView";
import { FieldsSelectionView } from "@/components/FieldsSelectionView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfiguration } from "@/hooks/useConfiguration";
import { usePdfUpload } from "@/hooks/usePdfUpload";
import { ConfigurePdfResponse } from "@/types/api";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function DataConfigurationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { configuration, updateConfiguration, saveConfiguration } = useConfiguration();
  const { extractPdf } = usePdfUpload();
  const [showFieldConfig, setShowFieldConfig] = useState(false);
  
  // Get initial configuration from location state
  const initialConfig = location.state?.data as ConfigurePdfResponse;

  useEffect(() => {
    if (!initialConfig) {
      toast.error("No configuration data available");
      navigate('/');
      return;
    }
    updateConfiguration(initialConfig);
  }, [initialConfig, navigate, updateConfiguration]);

  const handleFieldSelect = (section: "header" | "item", fieldId: string, selected: boolean) => {
    if (!configuration) return;

    const updatedConfig = { ...configuration };
    const field = updatedConfig[section][fieldId];
    
    if (field) {
      updatedConfig[section][fieldId] = {
        ...field,
        selected,
        logic: selected ? "1" : "0"
      };
    }
    
    updateConfiguration(updatedConfig);
  };

  const handleSubmit = () => {
    if (!configuration) return;

    const hasSelectedFields = Object.values(configuration.header).some(field => field.selected) ||
                            Object.values(configuration.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error("Please select at least one field");
      return;
    }

    setShowFieldConfig(true);
  };

  const handleSave = async (newConfig: ConfigurePdfResponse) => {
    try {
      // First save the configuration
      await saveConfiguration(newConfig);
      
      // Then extract the PDF with the saved configuration
      const extractionResult = await extractPdf(newConfig);
      
      // Navigate to results page with the extraction data
      navigate('/extract-results', { 
        state: { 
          data: extractionResult,
          name: newConfig.name 
        } 
      });
    } catch (error) {
      console.error('Failed to process configuration:', error);
      toast.error('Failed to process configuration. Please try again.');
    }
  };

  const handleCancel = () => {
    toast.error("Configuration cancelled");
    navigate('/');
  };

  if (!configuration) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {showFieldConfig ? "Configure Field Mapping" : "Select Fields"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showFieldConfig ? (
            <FieldConfigurationView
              fieldConfig={configuration}
              onSave={handleSave}
              onCancel={() => setShowFieldConfig(false)}
            />
          ) : (
            <FieldsSelectionView
              config={configuration}
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
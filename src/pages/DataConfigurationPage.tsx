import { FieldConfigurationView } from '@/components/FieldConfigurationView';
import { FieldsSelectionView } from '@/components/FieldsSelectionView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConfiguration } from '@/hooks/useConfiguration';
import { usePdfUpload } from '@/hooks/usePdfUpload';
import { auth } from '@/lib/firebase';
import { ConfigurePdfResponse } from '@/types/api';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function DataConfigurationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    configuration,
    updateConfiguration,
    saveConfiguration,
    isLoading: isSaving,
  } = useConfiguration();
  const { extractPdf, isLoading: isExtracting } = usePdfUpload();
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  // Get initial configuration and file from location state
  const initialConfig = location.state?.data as ConfigurePdfResponse;
  const pdfFile = location.state?.file as File;

  useEffect(() => {
    if (!initialConfig || !pdfFile) {
      toast.error('No configuration data or file available');
      navigate('/');
      return;
    }
    updateConfiguration(initialConfig);
  }, [initialConfig, pdfFile, navigate, updateConfiguration]);

  const handleFieldSelect = (section: 'header' | 'item', fieldId: string, selected: boolean) => {
    if (!configuration) return;

    const updatedConfig = { ...configuration };
    const field = updatedConfig[section][fieldId];

    if (field) {
      updatedConfig[section][fieldId] = {
        ...field,
        selected,
        logic: selected ? 1 : 0,
      };
    }

    updateConfiguration(updatedConfig);
  };

  const handleSubmit = () => {
    if (!configuration) return;

    const hasSelectedFields =
      Object.values(configuration.header).some(field => field.selected) ||
      Object.values(configuration.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error('Please select at least one field');
      return;
    }

    setShowFieldConfig(true);
  };

  const handleSave = async (newConfig: ConfigurePdfResponse) => {
    if (!auth.currentUser?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // First save the configuration
      await saveConfiguration(newConfig, auth.currentUser.uid);

      // Then extract the PDF with the saved configuration
      const extractionResult = await extractPdf(pdfFile, newConfig.name, auth.currentUser.uid);

      // Navigate to results page with the extraction data
      navigate('/extract-results', {
        state: {
          data: extractionResult,
          name: newConfig.name,
        },
      });
    } catch (error: any) {
      console.error('Failed to process configuration:', error?.status);
      toast.error(error?.message);
    }
  };

  const handleCancel = () => {
    toast.error('Configuration cancelled');
    navigate('/');
  };

  if (!configuration) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{showFieldConfig ? 'Configure Field Mapping' : 'Select Fields'}</CardTitle>
        </CardHeader>
        <CardContent>
          {showFieldConfig ? (
            <FieldConfigurationView
              fieldConfig={configuration}
              onSave={handleSave}
              onCancel={() => setShowFieldConfig(false)}
              isSaving={isSaving}
              isExtracting={isExtracting}
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

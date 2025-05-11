import { FieldConfigurationView } from "@/components/FieldConfigurationView";
import { FieldsSelectionView } from "@/components/FieldsSelectionView";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockConfigureResponse } from "@/lib/mockData";
import { ConfigurePdfResponse } from "@/types/api";
import { useState } from "react";
import { toast } from "sonner";
import { ExtractResultsPage } from "./ExtractResultsPage";

export function DevTestPage() {
  const [activeComponent, setActiveComponent] = useState<"upload" | "data-config" | "extract-results" | "field-config">("upload");
  const [config, setConfig] = useState<ConfigurePdfResponse>(mockConfigureResponse);
  const [showFieldConfig, setShowFieldConfig] = useState(false);

  const handleFieldSelect = (section: "header" | "item", fieldId: string, selected: boolean) => {
    const updatedConfig = { ...config };
    const field = updatedConfig[section][fieldId];
      
    if (field) {
      updatedConfig[section][fieldId] = {
        ...field,
        selected,
        logic: selected ? "1" : "0"
        };
      }
      
    setConfig(updatedConfig);
  };

  const handleSubmit = () => {
    const hasSelectedFields = Object.values(config.header).some(field => field.selected) ||
                            Object.values(config.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error("Please select at least one field");
      return;
    }

    setShowFieldConfig(true);
  };

  const handleSaveConfig = async (newConfig: ConfigurePdfResponse) => {
    console.log('Field Configuration:', newConfig);
    
    // Simulate API call
    setTimeout(() => {
      setConfig(newConfig);
      toast.success(`Configuration "${newConfig.name}" saved successfully`);
      setActiveComponent("extract-results");
    }, 1000);
  };

  const handleMockData = () => {
    setConfig(mockConfigureResponse);
    setActiveComponent("data-config");
    setShowFieldConfig(false);
  };

  const handleCancel = () => {
    toast.error("Configuration cancelled");
    setShowFieldConfig(false);
  };

  const renderDataConfiguration = () => {
    return (
      <div className="w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>
              {showFieldConfig ? "Configure Field Mapping" : "Select Fields"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showFieldConfig ? (
              <FieldConfigurationView
                fieldConfig={config}
                onSave={handleSaveConfig}
                onCancel={handleCancel}
              />
            ) : (
              <FieldsSelectionView
                config={config}
                onFieldSelect={handleFieldSelect}
                onSubmit={handleSubmit}
                onCancel={() => setActiveComponent("upload")}
              />
                        )}
                    </CardContent>
                  </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inforium Test Page</h1>
        <p className="mt-2 text-lg text-gray-600 mb-4">
          Development testing page for components
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            onClick={() => setActiveComponent("upload")} 
            variant={activeComponent === "upload" ? "default" : "outline"}
          >
            Upload Component
          </Button>
          <Button 
            onClick={() => setActiveComponent("data-config")} 
            variant={activeComponent === "data-config" ? "default" : "outline"}
          >
            Data Configuration
          </Button>
          <Button 
            onClick={() => setActiveComponent("extract-results")} 
            variant={activeComponent === "extract-results" ? "default" : "outline"}
          >
            Extract Results
          </Button>
          <Button 
            onClick={handleMockData}
            variant="outline"
          >
            Load Mock Data
          </Button>
        </div>
      </header>
      
      <main className="w-full max-w-4xl">
        {activeComponent === "upload" && (
          <div className="flex justify-center">
            <FileUpload />
          </div>
        )}
        {activeComponent === "data-config" && renderDataConfiguration()}
        {activeComponent === "extract-results" && (
          <ExtractResultsPage />
        )}
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Inforium - Development Mode</p>
      </footer>
    </div>
  );
} 
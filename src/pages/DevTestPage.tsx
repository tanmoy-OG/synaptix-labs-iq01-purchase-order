import { FieldConfigurationView } from "@/components/FieldConfigurationView";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockConfigureResponse } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ExtractedPdfData, FieldConfigurationData } from "@/types/api";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExtractResultsPage } from "./ExtractResultsPage";

export function DevTestPage() {
  const [activeComponent, setActiveComponent] = useState<"upload" | "data-config" | "extract-results" | "field-config">("upload");
  const [selectedData, setSelectedData] = useState<ExtractedPdfData | null>(null);
  const [fieldConfig, setFieldConfig] = useState<FieldConfigurationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleHeaderSelection = (key: string) => {
    if (!fieldConfig) return;

    setFieldConfig((prev) => {
      if (!prev) return prev;

      const headerConfig = { ...prev.header };
      const fieldId = Object.entries(headerConfig).find(([, field]) => field.fieldname === key)?.[0];
      
      if (fieldId) {
        headerConfig[fieldId] = {
          ...headerConfig[fieldId],
          selected: !headerConfig[fieldId].selected
        };
      }
      
      return { ...prev, header: headerConfig };
    });
  };

  const toggleItemSelection = (key: string) => {
    if (!fieldConfig) return;

    setFieldConfig((prev) => {
      if (!prev) return prev;

      const itemConfig = { ...prev.item };
      const fieldId = Object.entries(itemConfig).find(([, field]) => field.fieldname === key)?.[0];
      
      if (fieldId) {
        itemConfig[fieldId] = {
          ...itemConfig[fieldId],
          selected: !itemConfig[fieldId].selected
        };
      }
      
      return { ...prev, item: itemConfig };
    });
  };

  const handleSubmit = () => {
    if (!fieldConfig) return;

    const hasSelectedFields = Object.values(fieldConfig.header).some(field => field.selected) ||
                            Object.values(fieldConfig.item).some(field => field.selected);

    if (!hasSelectedFields) {
      toast.error("Please select at least one field");
      return;
    }

    setActiveComponent("field-config");
  };

  const handleSaveConfig = async (config: FieldConfigurationData) => {
    setIsSubmitting(true);
    console.log('Field Configuration:', config);
    
    // Simulate API call
    setTimeout(() => {
      setFieldConfig(config);
      toast.success("Configuration saved successfully");
      setIsSubmitting(false);
      setActiveComponent("extract-results");
    }, 1000);
  };

  const handleReset = () => {
    setActiveComponent("upload");
    setSelectedData(null);
    setFieldConfig(null);
  };

  const handleMockData = () => {
    setSelectedData(mockConfigureResponse.extractedData);
    setFieldConfig(mockConfigureResponse.fieldConfig);
    setActiveComponent("data-config");
  };

  const renderDataConfiguration = () => {
    if (!selectedData || !fieldConfig) return null;

    return (
      <div className="w-full max-w-4xl">
        <div className="space-y-8 w-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Header</h2>
              <div className="text-sm text-gray-500">
                {Object.values(fieldConfig.header).filter(field => field.selected).length} item(s) selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(selectedData.header).map(([key, value]) => {
                const fieldId = Object.entries(fieldConfig.header).find(([, field]) => field.fieldname === key)?.[0];
                const isSelected = fieldId ? fieldConfig.header[fieldId].selected : false;

                return (
                  <Card 
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary", 
                      isSelected ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                    )}
                    onClick={() => toggleHeaderSelection(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm text-gray-500">{key}</div>
                          <div className="text-lg font-semibold mt-1">{value}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Line Items</h2>
              <div className="text-sm text-gray-500">
                {Object.values(fieldConfig.item).filter(field => field.selected).length} item(s) selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(selectedData.item).map(([key, value]) => {
                const fieldId = Object.entries(fieldConfig.item).find(([, field]) => field.fieldname === key)?.[0];
                const isSelected = fieldId ? fieldConfig.item[fieldId].selected : false;

                return (
                  <Card 
                    key={key}
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary", 
                      isSelected ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                    )}
                    onClick={() => toggleItemSelection(key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm text-gray-500">{key}</div>
                          <div className="text-lg font-semibold mt-1">{value}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleReset}>
              Upload Another PDF
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Configure Selected Fields"}
            </Button>
          </div>
        </div>
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
        {activeComponent === "field-config" && fieldConfig && (
          <div className="space-y-6">
            <header className="text-center mb-8">
              <h2 className="text-2xl font-bold">Configure Field Mapping</h2>
              <p className="text-gray-600 mt-2">Configure how each field should be processed</p>
            </header>
            <FieldConfigurationView
              fieldConfig={fieldConfig}
              onSave={handleSaveConfig}
              onCancel={() => setActiveComponent("data-config")}
            />
          </div>
        )}
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
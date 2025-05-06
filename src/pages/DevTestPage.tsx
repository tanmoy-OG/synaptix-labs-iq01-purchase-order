import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockExtractedData } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { SelectedData } from "@/types/api";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExtractResultsPage } from "./ExtractResultsPage";

export function DevTestPage() {
  const [activeComponent, setActiveComponent] = useState<"upload" | "data-config" | "extract-results">("upload");
  const [selectedData, setSelectedData] = useState<SelectedData>({
    headerData: {},
    itemData: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleHeaderSelection = (key: string, value: string) => {
    setSelectedData((prev) => {
      const headerData = { ...prev.headerData };
      
      if (headerData[key]) {
        delete headerData[key];
      } else {
        headerData[key] = value;
      }
      
      return { ...prev, headerData };
    });
  };

  const toggleItemSelection = (key: string, value: string) => {
    setSelectedData((prev) => {
      const itemData = { ...prev.itemData };
      
      if (itemData[key]) {
        delete itemData[key];
      } else {
        itemData[key] = value;
      }
      
      return { ...prev, itemData };
    });
  };

  const handleSubmit = () => {
    if (Object.keys(selectedData.headerData).length === 0 && 
        Object.keys(selectedData.itemData).length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Data submitted successfully");
      setIsSubmitting(false);
      setSelectedData({
        headerData: {},
        itemData: {},
      });
    }, 1000);
  };

  const handleReset = () => {
    setActiveComponent("upload");
    setSelectedData({
      headerData: {},
      itemData: {},
    });
  };

  const renderDataConfiguration = () => {
    return (
      <div className="w-full max-w-4xl">
        <div className="space-y-8 w-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Header</h2>
              <div className="text-sm text-gray-500">
                {Object.keys(selectedData.headerData).length} item(s) selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(mockExtractedData.header).map(([key, value]) => (
                <Card 
                  key={key}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary", 
                    selectedData.headerData[key] ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                  )}
                  onClick={() => toggleHeaderSelection(key, value)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm text-gray-500">{key}</div>
                        <div className="text-lg font-semibold mt-1">{value}</div>
                      </div>
                      {selectedData.headerData[key] && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Line Items</h2>
              <div className="text-sm text-gray-500">
                {Object.keys(selectedData.itemData).length} item(s) selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(mockExtractedData.item).map(([key, value]) => (
                <Card 
                  key={key}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary", 
                    selectedData.itemData[key] ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                  )}
                  onClick={() => toggleItemSelection(key, value)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm text-gray-500">{key}</div>
                        <div className="text-lg font-semibold mt-1">{value}</div>
                      </div>
                      {selectedData.itemData[key] && (
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleReset}>
              Upload Another PDF
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Selected Data"}
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
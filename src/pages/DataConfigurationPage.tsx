import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { cn } from "@/lib/utils";
import { ExtractedPdfData, SelectedData } from "@/types/api";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function DataConfigurationPage() {
  const [selectedData, setSelectedData] = useState<SelectedData>({
    headerData: {},
    itemData: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.data as ExtractedPdfData;
  
  // Redirect to home page if no data is available
  useEffect(() => {
    if (!data) {
      toast.error("No data available for configuration");
      navigate('/');
    }
  }, [data, navigate]);

  // Reset selection state when new data arrives
  useEffect(() => {
    setSelectedData({
      headerData: {},
      itemData: {},
    });
  }, [data]);

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

  const handleSubmit = async () => {
    if (Object.keys(selectedData.headerData).length === 0 && 
        Object.keys(selectedData.itemData).length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await api.post(API_ENDPOINTS.SUBMIT_SELECTIONS, selectedData);
      toast.success("Data submitted successfully");
      // Handle post-submission logic here
    } catch (error) {
      toast.error("Failed to submit data");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    navigate('/');
  };

  // If no data, show loading or return null
  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inforium</h1>
        <p className="mt-2 text-lg text-gray-600 mb-4">
          Configure Data Extraction
        </p>
      </header>
      
      <main className="w-full max-w-4xl">
        <div className="space-y-8 w-full">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Header</h2>
              <div className="text-sm text-gray-500">
                {Object.keys(selectedData.headerData).length} item(s) selected
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(data.header).map(([key, value]) => (
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
              {Object.entries(data.item).map(([key, value]) => (
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
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Inforium. All rights reserved.</p>
      </footer>
    </div>
  );
} 
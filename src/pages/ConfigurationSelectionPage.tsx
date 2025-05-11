import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfiguration } from "@/hooks/useConfiguration";
import { usePdfUpload } from "@/hooks/usePdfUpload";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ConfigurationSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { configurations, fetchConfigurations, isLoading } = useConfiguration();
  const { extractPdf } = usePdfUpload();
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasLoaded = useRef(false);

  // Get the PDF file from location state
  const pdfFile = location.state?.file as File | undefined;

  useEffect(() => {
    if (!pdfFile) {
      toast.error("No PDF file selected");
      navigate('/');
      return;
    }
  }, [pdfFile, navigate]);

  const loadConfigurations = useCallback(async () => {
    if (hasLoaded.current) return;
    
    try {
      setError(null);
      await fetchConfigurations();
      hasLoaded.current = true;
    } catch (err) {
      setError('Failed to load configurations. Please try again.');
      console.error('Error loading configurations:', err);
    }
  }, [fetchConfigurations]);

  useEffect(() => {
    loadConfigurations();
  }, [loadConfigurations]);

  const handleExtract = useCallback(async () => {
    if (!selectedConfig) {
      toast.error("Please select a configuration");
      return;
    }

    if (!pdfFile) {
      toast.error("No PDF file selected");
      navigate('/');
      return;
    }

    try {
      const result = await extractPdf(pdfFile, selectedConfig);
      navigate('/extract-results', { 
        state: { 
          data: result,
          name: selectedConfig 
        } 
      });
    } catch (error) {
      console.error('Failed to extract PDF:', error);
      toast.error('Failed to extract PDF. Please try again.');
    }
  }, [selectedConfig, pdfFile, extractPdf, navigate]);

  const handleConfigSelect = useCallback((configName: string) => {
    setSelectedConfig(configName);
  }, []);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Select Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error ? (
              <div className="text-center py-4 text-red-500">
                {error}
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Return to Upload
                  </Button>
                </div>
              </div>
            ) : isLoading && !hasLoaded.current ? (
              <div className="text-center py-4">Loading configurations...</div>
            ) : configurations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>No configurations found. Please create a configuration first.</p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                  >
                    Return to Upload
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {configurations.map((config) => (
                  <div
                    key={config.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedConfig === config.name
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleConfigSelect(config.name)}
                  >
                    <div className="font-medium">{config.name}</div>
                  </div>
                ))}
              </div>
            )}

            {!error && configurations.length > 0 && (
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  onClick={handleExtract}
                  disabled={!selectedConfig || isLoading}
                >
                  Extract PDF
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
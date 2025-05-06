import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { usePdfUpload } from "@/hooks/usePdfUpload";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileText } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UploadMode = "configure" | "extract";

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedMode, setSelectedMode] = useState<UploadMode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { configurePdf, extractPdf, isLoading } = usePdfUpload();
  const navigate = useNavigate();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      // Check if file is a PDF
      if (!selectedFile.type.includes("pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }
      
      setFile(selectedFile);
      toast.success(`File "${selectedFile.name}" selected`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    if (!selectedMode) {
      toast.error("Please select an option: Configure Data Extraction or Extract Data");
      return;
    }

    try {
      if (selectedMode === "configure") {
        const data = await configurePdf(file);
        // Pass the extracted data to the data configuration page
        navigate('/data-configuration', { state: { data } });
      } else {
        await extractPdf(file);
        navigate('/extract-results');
      }

      setFile(null); // Reset file after successful upload
      setSelectedMode(null); // Reset mode selection
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.includes("pdf")) {
      setFile(droppedFile);
      toast.success(`File "${droppedFile.name}" selected`);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  // Common option button styles
  const optionButtonClasses = (mode: UploadMode) => cn(
    "border rounded-lg p-4 h-[60px] cursor-pointer transition-all hover:border-primary",
    selectedMode === mode 
      ? "border-2 border-primary bg-primary/5 shadow-sm" 
      : "border-dashed border-gray-300"
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Purchase Order PDF</CardTitle>
        <CardDescription>
          Upload a PDF file to process purchase order data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors h-[160px] flex flex-col items-center justify-center"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? (
            <div className="flex flex-col items-center space-y-2">
              <FileText className="h-10 w-10 text-primary" />
              <div className="text-sm font-medium text-primary truncate max-w-[280px]">
                {file.name}
              </div>
              <div className="text-xs text-gray-500">
                Click to change file
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-gray-400"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="text-sm font-medium">
                Drag & drop your PDF here or click to browse
              </div>
              <div className="text-xs text-gray-500">
                Supports: PDF files up to 10MB
              </div>
            </div>
          )}
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500 mb-2">Select an option:</p>
          <div className="grid grid-cols-2 gap-4">
            <div 
              className={optionButtonClasses("configure")}
              onClick={() => setSelectedMode("configure")}
            >
              <div className="flex items-center justify-between w-full h-full">
                <span className="font-medium">Configure Data</span>
                {selectedMode === "configure" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <div className="w-5"></div>
                )}
              </div>
            </div>
            <div 
              className={optionButtonClasses("extract")}
              onClick={() => setSelectedMode("extract")}
            >
              <div className="flex items-center justify-between w-full h-full">
                <span className="font-medium">Extract Data</span>
                {selectedMode === "extract" ? (
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <div className="w-5"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Processing..." : "Process PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
} 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UploadResult, usePdfUpload } from "@/hooks/usePdfUpload";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadSuccess?: (result: UploadResult) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPdf, isLoading } = usePdfUpload();

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

    setIsUploading(true);
    
    try {
      const result = await uploadPdf(file);
      toast.success("File uploaded successfully");
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
      setFile(null); // Reset file after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Purchase Order PDF</CardTitle>
        <CardDescription>
          Upload a PDF file to extract purchase order data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
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
              {file ? file.name : "Drag & drop your PDF here or click to browse"}
            </div>
            {!file && (
              <div className="text-xs text-gray-500">
                Supports: PDF files up to 10MB
              </div>
            )}
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isLoading}
        >
          {isLoading ? "Uploading..." : "Process PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
} 
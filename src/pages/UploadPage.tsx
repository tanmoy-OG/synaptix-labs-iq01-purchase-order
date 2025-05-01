import { FileUpload } from '@/components/FileUpload';
import { ProcessingStatus } from '@/components/ProcessingStatus';
import { UploadResult } from '@/hooks/usePdfUpload';
import { useState } from 'react';
import { toast } from 'sonner';

export function UploadPage() {
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  
  const handleUploadSuccess = (result: UploadResult) => {
    setUploadResult(result);
    toast.success('File uploaded successfully!');
  };
  
  const handleProcessingComplete = (result: UploadResult) => {
    setUploadResult(result);
    toast.success('Processing completed!');
  };
  
  const resetUpload = () => {
    setUploadResult(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inforium</h1>
        <p className="mt-2 text-lg text-gray-600">
          Extract purchase order data from PDF files
        </p>
      </header>
      
      <main className="w-full max-w-3xl flex flex-col items-center space-y-8">
        {!uploadResult ? (
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <>
            <ProcessingStatus 
              initialStatus={uploadResult}
              onComplete={handleProcessingComplete}
            />
            
            <button
              onClick={resetUpload}
              className="text-sm text-gray-500 hover:text-gray-700 mt-4"
            >
              Upload another file
            </button>
          </>
        )}
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Inforium. All rights reserved.</p>
      </footer>
    </div>
  );
} 
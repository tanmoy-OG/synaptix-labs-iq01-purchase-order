import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadResult, usePdfUpload } from '@/hooks/usePdfUpload';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ProcessingStatusProps {
  initialStatus: UploadResult;
  onComplete?: (result: UploadResult) => void;
}

export function ProcessingStatus({ initialStatus, onComplete }: ProcessingStatusProps) {
  const [status, setStatus] = useState<UploadResult>(initialStatus);
  const { checkProcessingStatus, isLoading } = usePdfUpload();
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  // Set up polling to check status
  useEffect(() => {
    // Only poll if the status is 'processing'
    if (status.status === 'processing') {
      const interval = window.setInterval(async () => {
        try {
          const updatedStatus = await checkProcessingStatus(status.id);
          setStatus(updatedStatus);
          
          // If processing is complete, stop polling and notify parent
          if (updatedStatus.status !== 'processing') {
            if (pollingInterval) clearInterval(pollingInterval);
            setPollingInterval(null);
            
            if (updatedStatus.status === 'completed' && onComplete) {
              onComplete(updatedStatus);
            }
            
            if (updatedStatus.status === 'failed') {
              toast.error('Processing failed: ' + updatedStatus.message);
            }
          }
        } catch (error) {
          console.error('Error checking status:', error);
          toast.error('Failed to check processing status');
          
          // Stop polling on error
          if (pollingInterval) clearInterval(pollingInterval);
          setPollingInterval(null);
        }
      }, 5000); // Check every 5 seconds
      
      setPollingInterval(interval);
      
      // Clean up interval on unmount
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [status.id, status.status, checkProcessingStatus, onComplete]);

  // Status icon based on current status
  const renderStatusIcon = () => {
    switch (status.status) {
      case 'processing':
        return (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        );
      case 'completed':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'failed':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{renderStatusIcon()}</span>
          <span>
            {status.status === 'processing' && 'Processing Your PDF'}
            {status.status === 'completed' && 'Processing Complete'}
            {status.status === 'failed' && 'Processing Failed'}
          </span>
        </CardTitle>
        <CardDescription>
          {status.status === 'processing' && 'Please wait while we extract data from your PDF...'}
          {status.status === 'completed' && 'Your PDF has been processed successfully!'}
          {status.status === 'failed' && status.message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500">
          {status.status === 'processing' && (
            <div className="flex justify-center">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse rounded-full"></div>
              </div>
            </div>
          )}
          
          {status.status === 'completed' && status.downloadUrl && (
            <div className="text-center text-green-600">
              Your Excel file is ready for download!
            </div>
          )}
          
          {status.status === 'failed' && (
            <div className="text-center text-red-600">
              There was an error processing your file. Please try again.
            </div>
          )}
        </div>
      </CardContent>
      {status.status === 'completed' && status.downloadUrl && (
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.open(status.downloadUrl, '_blank')}>
            Download Excel File
          </Button>
        </CardFooter>
      )}
      
      {status.status === 'failed' && (
        <CardFooter className="flex justify-center">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 
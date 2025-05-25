import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";

export function ExtractResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const csvBlob = location.state?.data as Blob;
  const configName = location.state?.name as string;

  if (!csvBlob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">No extraction data available</p>
            <Button 
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    const url = window.URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${configName}_extracted_data.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Extraction Complete!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center">
              <div className="p-6 bg-green-50 rounded-full inline-block">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-20 w-20 text-green-500" 
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
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Configuration Selected: {configName}
              </h2>
              <p className="mt-2 text-gray-600">
                Your data has been successfully extracted and is ready for download.
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-6">
              <Button 
                onClick={handleDownload}
                className="px-8 py-3 text-lg"
              >
                Download CSV
              </Button>
              <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="px-8 py-3 text-lg"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
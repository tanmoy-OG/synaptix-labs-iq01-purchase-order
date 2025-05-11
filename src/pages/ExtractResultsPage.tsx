import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigurePdfResponse } from "@/types/api";
import { useLocation, useNavigate } from "react-router-dom";

export function ExtractResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const extractionData = location.state?.data as ConfigurePdfResponse;
  const configName = location.state?.name as string;

  if (!extractionData) {
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
                Configuration: {configName}
              </h2>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Header Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(extractionData.header)
                  .filter(([, field]) => field.selected)
                  .map(([key, field]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-500">{field.label || field.fieldname}</div>
                      <div className="mt-1 font-medium">{field.first}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Item Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(extractionData.item)
                  .filter(([, field]) => field.selected)
                  .map(([key, field]) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow">
                      <div className="text-sm text-gray-500">{field.label || field.fieldname}</div>
                      <div className="mt-1 font-medium">{field.first}</div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button 
                onClick={() => navigate("/")}
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
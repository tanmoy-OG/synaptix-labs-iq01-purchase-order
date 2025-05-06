import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function ExtractResultsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Extraction Complete!</h1>
        
        <div className="py-8 text-xl text-gray-700">
          Your purchase order data has been successfully extracted and processed.
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="p-6 bg-indigo-50 rounded-full">
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
          
          <p className="text-gray-600 max-w-lg">
            The data has been saved to our system and is now ready for further processing or integration with your other systems.
          </p>
        </div>
        
        <div className="mt-12">
          <Button 
            onClick={() => navigate("/")}
            className="px-8 py-3 text-lg"
          >
            Return to Home
          </Button>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Inforium. All rights reserved.</p>
      </footer>
    </div>
  );
} 
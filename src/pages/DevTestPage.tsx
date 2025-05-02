import { FileUpload } from "@/components/FileUpload";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { mockExtractedData } from "@/lib/mockData";
import { useState } from "react";

export function DevTestPage() {
  const [showMock, setShowMock] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inforium Test Page</h1>
        <p className="mt-2 text-lg text-gray-600 mb-4">
          Development testing page for components
        </p>
        
        <div className="flex space-x-4">
          <Button 
            onClick={() => setShowMock(false)} 
            variant={!showMock ? "default" : "outline"}
          >
            Show Upload Component
          </Button>
          <Button 
            onClick={() => setShowMock(true)} 
            variant={showMock ? "default" : "outline"}
          >
            Show Results Component
          </Button>
        </div>
      </header>
      
      <main className="w-full max-w-4xl flex flex-col items-center">
        {showMock ? (
          <ResultsDisplay 
            data={mockExtractedData} 
            onReset={() => setShowMock(false)}
          />
        ) : (
          <FileUpload />
        )}
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Inforium - Development Mode</p>
      </footer>
    </div>
  );
} 
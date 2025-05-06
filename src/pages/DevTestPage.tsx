import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { mockExtractedData } from "@/lib/mockData";
import { useState } from "react";
import { DataConfigurationPage } from "./DataConfigurationPage";
import { ExtractResultsPage } from "./ExtractResultsPage";

export function DevTestPage() {
  const [activeComponent, setActiveComponent] = useState<"upload" | "data-config" | "extract-results">("upload");

  // Configure react router mock location state for DataConfigurationPage
  if (activeComponent === "data-config") {
    // Mock the location object that would be passed by react-router
    (window as any).history.replaceState({
      state: { data: mockExtractedData }
    }, '');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <header className="w-full max-w-4xl mb-8 text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Inforium Test Page</h1>
        <p className="mt-2 text-lg text-gray-600 mb-4">
          Development testing page for components
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            onClick={() => setActiveComponent("upload")} 
            variant={activeComponent === "upload" ? "default" : "outline"}
          >
            Upload Component
          </Button>
          <Button 
            onClick={() => setActiveComponent("data-config")} 
            variant={activeComponent === "data-config" ? "default" : "outline"}
          >
            Data Configuration
          </Button>
          <Button 
            onClick={() => setActiveComponent("extract-results")} 
            variant={activeComponent === "extract-results" ? "default" : "outline"}
          >
            Extract Results
          </Button>
        </div>
      </header>
      
      <main className="w-full max-w-4xl flex flex-col items-center">
        {activeComponent === "upload" && (
          <FileUpload />
        )}
        {activeComponent === "data-config" && (
          <DataConfigurationPage />
        )}
        {activeComponent === "extract-results" && (
          <ExtractResultsPage />
        )}
      </main>
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Inforium - Development Mode</p>
      </footer>
    </div>
  );
} 
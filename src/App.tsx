import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigurationSelectionPage } from './pages/ConfigurationSelectionPage';
import { ConfigurationsPage } from './pages/ConfigurationsPage';
import { DataConfigurationPage } from './pages/DataConfigurationPage';
import { DevTestPage } from './pages/DevTestPage';
import { EditConfigurationPage } from './pages/EditConfigurationPage';
import { ExtractResultsPage } from './pages/ExtractResultsPage';
import { UploadPage } from './pages/UploadPage';

// Create a client
const queryClient = new QueryClient();

// Check if in development mode
const isDev = import.meta.env.DEV;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {isDev && import.meta.env.VITE_ENABLE_TEST_PAGE === "true" ? (
          <DevTestPage />
        ) : (
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/data-configuration" element={<DataConfigurationPage />} />
            <Route path="/select-configuration" element={<ConfigurationSelectionPage />} />
            <Route path="/extract-results" element={<ExtractResultsPage />} />
            <Route path="/configurations" element={<ConfigurationsPage />} />
            <Route path="/edit-configuration" element={<EditConfigurationPage />} />
          </Routes>
        )}
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

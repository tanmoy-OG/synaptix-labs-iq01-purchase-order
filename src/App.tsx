import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DevTestPage } from './pages/DevTestPage';
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
            <Route path="/extract-results" element={<ExtractResultsPage />} />
          </Routes>
        )}
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

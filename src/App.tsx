import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DevTestPage } from './pages/DevTestPage';
import { UploadPage } from './pages/UploadPage';

// Create a client
const queryClient = new QueryClient();

// Check if in development mode
const isDev = import.meta.env.DEV;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {isDev && import.meta.env.VITE_ENABLE_TEST_PAGE === "true" ? (
        <DevTestPage />
      ) : (
        <UploadPage />
      )}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;

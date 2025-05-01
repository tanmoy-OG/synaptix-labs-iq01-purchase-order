import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UploadPage } from './pages/UploadPage';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UploadPage />
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;

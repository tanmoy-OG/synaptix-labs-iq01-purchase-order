import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ConfigurationSelectionPage } from './pages/ConfigurationSelectionPage';
import { ConfigurationsPage } from './pages/ConfigurationsPage';
import { DataConfigurationPage } from './pages/DataConfigurationPage';
import { DevTestPage } from './pages/DevTestPage';
import { EditConfigurationPage } from './pages/EditConfigurationPage';
import { ExtractResultsPage } from './pages/ExtractResultsPage';
import { LoginPage } from './pages/LoginPage';
import { UploadPage } from './pages/UploadPage';
import { SortConfigurationPage } from './pages/SortConfigurationPage';

// Create a client
const queryClient = new QueryClient();

// Check if in development mode
const isDev = import.meta.env.DEV;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {isDev && import.meta.env.VITE_ENABLE_TEST_PAGE === 'true' ? (
          <DevTestPage />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute requireAuth={false}>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-configuration"
              element={
                <ProtectedRoute>
                  <DataConfigurationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sort-configuration"
              element={
                <ProtectedRoute>
                  <SortConfigurationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/select-configuration"
              element={
                <ProtectedRoute>
                  <ConfigurationSelectionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/extract-results"
              element={
                <ProtectedRoute>
                  <ExtractResultsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configurations"
              element={
                <ProtectedRoute>
                  <ConfigurationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-configuration"
              element={
                <ProtectedRoute>
                  <EditConfigurationPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        )}
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

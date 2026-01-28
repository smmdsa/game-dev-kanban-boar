import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { DataProviderWrapper, createSupabaseProvider } from '@/data'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

const supabaseProvider = createSupabaseProvider({
  userId: 'test-user-123',
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <DataProviderWrapper customProvider={supabaseProvider} >
      <App />
    </DataProviderWrapper>
   </ErrorBoundary>
)

import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { DataProviderWrapper } from '@/data'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthenticatedApp } from './AuthenticatedApp.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
   </ErrorBoundary>
)

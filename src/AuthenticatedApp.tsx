import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/AuthForm';
import { DataProviderWrapper, createSupabaseProvider } from '@/data';
import App from './App';
import { useMemo } from 'react';

export function AuthenticatedApp() {
  const { user, loading } = useAuth();

  // Crear provider dinámico basado en el usuario autenticado
  const supabaseProvider = useMemo(() => {
    if (!user) return null;
    return createSupabaseProvider({
      userId: user.id,
    });
  }, [user]);

  // Mostrar loading mientras verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, mostrar formulario de autenticación
  if (!user || !supabaseProvider) {
    return <AuthForm />;
  }

  // Si hay usuario, mostrar la app con el provider configurado
  return (
    <DataProviderWrapper customProvider={supabaseProvider}>
      <App />
    </DataProviderWrapper>
  );
}

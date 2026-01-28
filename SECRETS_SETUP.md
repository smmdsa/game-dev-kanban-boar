# 🔐 Guía de Configuración de Secrets

Este documento explica cómo configurar las credenciales de Supabase tanto para desarrollo local como para GitHub Actions.

## 📋 Requisitos Previos

1. ✅ Cuenta en [Supabase](https://supabase.com/)
2. ✅ Proyecto Supabase creado
3. ✅ Schema SQL ejecutado (ver `supabase/schema.sql`)

## 🏠 Configuración Local (Desarrollo)

### Paso 1: Obtener Credenciales de Supabase

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a `Settings > API`
4. Copia estos valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Project API keys > anon public** → `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

![Supabase API Settings](https://supabase.com/docs/img/api/api-url-and-key.png)

### Paso 2: Crear Archivo `.env`

```bash
# En la raíz del proyecto
cp .env.example .env
```

### Paso 3: Completar Variables

Edita el archivo `.env` con tus credenciales:

```env
# .env
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Paso 4: Verificar Configuración

```bash
# Reinicia el servidor
npm run dev
```

Si la configuración es correcta, verás en la consola:
```
[SupabaseProvider] Initialized and connected
```

---

## 🐙 Configuración en GitHub (CI/CD)

### Paso 1: Ir a GitHub Secrets

1. Ve a tu repositorio en GitHub
2. Click en `Settings`
3. En el menú lateral, ve a `Secrets and variables > Actions`
4. Click en `New repository secret`

![GitHub Secrets](https://docs.github.com/assets/cb-28528/mw-1440/images/help/settings/actions-secrets-actions-overview.webp)

### Paso 2: Agregar Secrets

Crea **2 secrets** con estos nombres exactos:

#### Secret 1: `VITE_SUPABASE_URL`
- **Name:** `VITE_SUPABASE_URL`
- **Secret:** Tu URL de Supabase (`https://xxx.supabase.co`)

#### Secret 2: `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **Name:** `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **Secret:** Tu anon/public key de Supabase

### Paso 3: Configurar GitHub Actions

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: ${{ secrets.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY }}
        run: npm run build
        
      # Agregar steps de deploy según tu plataforma
```

---

## 🔄 Cambiar entre Providers

### Usar Spark (Local Storage - Default)

No necesitas configurar nada. Funciona out-of-the-box.

```tsx
// main.tsx - ya configurado
<DataProviderWrapper>
  <App />
</DataProviderWrapper>
```

### Usar Supabase

1. **Configura variables de entorno** (pasos anteriores)

2. **Modifica `main.tsx`:**

```tsx
import { DataProviderWrapper } from '@/data';
import { createSupabaseProvider } from '@/data';

// Crear provider de Supabase
const supabaseProvider = createSupabaseProvider({
  userId: 'anonymous' // o ID real si tienes autenticación
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <DataProviderWrapper customProvider={supabaseProvider}>
      <App />
    </DataProviderWrapper>
  </ErrorBoundary>
);
```

3. **Asegúrate de ejecutar el schema SQL** en Supabase:
   - Ve a `SQL Editor` en tu dashboard
   - Copia el contenido de `supabase/schema.sql`
   - Ejecuta el script

---

## 🗄️ Ejecutar Schema SQL

### Opción 1: SQL Editor (Recomendado)

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Click en `SQL Editor` en el menú lateral
4. Click en `New query`
5. Copia todo el contenido de `supabase/schema.sql`
6. Click en `Run` o `Ctrl+Enter`

### Opción 2: Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Linkar proyecto
supabase link --project-ref your-project-ref

# Ejecutar migraciones
supabase db push
```

---

## ✅ Verificación

### Comprobar Conexión Local

```bash
npm run dev
```

Abre la consola del navegador y busca:
```
[SupabaseProvider] Initialized and connected
```

### Comprobar en Supabase Dashboard

1. Ve a `Table Editor`
2. Deberías ver las tablas:
   - `columns`
   - `tasks`
   - `user_settings`

### Test de Operaciones

Crea una columna desde la UI. Luego verifica en Supabase:

1. Ve a `Table Editor > columns`
2. Deberías ver la columna creada

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

- ✅ Usa `anon` key para el cliente (público)
- ✅ NUNCA expongas el `service_role` key en el cliente
- ✅ Configura Row Level Security (RLS) en Supabase
- ✅ `.env` está en `.gitignore` - nunca lo commitees
- ✅ Usa GitHub Secrets para CI/CD

### ⚠️ Advertencias

- ⚠️ La `anon` key es segura para exponer en el cliente
- ⚠️ RLS protege tus datos incluso con la `anon` key expuesta
- ⚠️ Para operaciones admin, usa Supabase Functions con `service_role`

---

## � Configuración de Auth URL (GitHub Pages)

Esta configuración es **CRÍTICA** para que la autenticación funcione correctamente en producción (GitHub Pages).

### El Problema

Por defecto, Supabase envía emails de confirmación con URLs que apuntan a `localhost:3000`, lo cual no funciona en producción.

### Solución: Configurar URLs en Supabase

1. Ve a tu [Dashboard de Supabase](https://app.supabase.com/)
2. Selecciona tu proyecto
3. Ve a `Authentication > URL Configuration`

### Paso 1: Configurar Site URL

En **Site URL**, pon la URL de tu GitHub Pages:

```
https://TU_USUARIO.github.io/TU_REPOSITORIO
```

Ejemplo:
```
https://smmdsa.github.io/game-dev-kanban-boar
```

### Paso 2: Configurar Redirect URLs

En **Redirect URLs**, agrega las mismas URLs:

```
https://TU_USUARIO.github.io/TU_REPOSITORIO
https://TU_USUARIO.github.io/TU_REPOSITORIO/
```

> ⚠️ **Importante**: Agrega ambas versiones (con y sin `/` al final)

### Paso 3: (Opcional) Desarrollo Local

Si también necesitas probar localmente, agrega:

```
http://localhost:5000
http://localhost:5000/
```

### Verificación

Después de configurar:

1. Regístrate con un email nuevo
2. Revisa el email de confirmación
3. El link debe apuntar a tu GitHub Pages, no a localhost

### Screenshot de Referencia

```
┌─────────────────────────────────────────────────┐
│ URL Configuration                                │
├─────────────────────────────────────────────────┤
│ Site URL                                         │
│ ┌─────────────────────────────────────────────┐ │
│ │ https://smmdsa.github.io/game-dev-kanban... │ │
│ └─────────────────────────────────────────────┘ │
│                                                  │
│ Redirect URLs                                    │
│ ┌─────────────────────────────────────────────┐ │
│ │ https://smmdsa.github.io/game-dev-kanban... │ │
│ │ http://localhost:5000                        │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## �🐛 Troubleshooting

### Error: "Supabase credentials not configured"

**Causa:** Variables de entorno no encontradas.

**Solución:**
```bash
# Verifica que .env existe
ls -la .env

# Verifica el contenido
cat .env

# Debe contener:
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...

# Reinicia el servidor
npm run dev
```

### Error: "Connection check failed"

**Causa:** URL o key incorrecta, o schema no ejecutado.

**Solución:**
1. Verifica URL y key en Supabase dashboard
2. Ejecuta el schema SQL si no lo has hecho
3. Verifica que el proyecto Supabase esté activo

### Error: "PGRST116 - No rows returned"

**Causa:** Tabla vacía o query incorrecta.

**Solución:** Esto es normal en una base de datos nueva. Ignóralo.

### Datos no aparecen en Supabase

**Causa:** Puede estar usando Spark provider en lugar de Supabase.

**Solución:**
1. Verifica que hayas modificado `main.tsx` para usar `createSupabaseProvider()`
2. Revisa la consola del navegador para confirmar el provider activo

### GitHub Actions falla al buildear

**Causa:** Secrets no configurados correctamente.

**Solución:**
1. Verifica que los nombres de los secrets coincidan exactamente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
2. Verifica que los secrets estén en `Settings > Secrets and variables > Actions`
3. Re-ejecuta el workflow

---

## 📚 Referencias

- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💡 Próximos Pasos

Una vez configurado:

1. ✅ Verifica que la conexión funcione
2. ✅ Crea algunas columnas y tareas de prueba
3. ✅ Revisa los datos en Supabase Table Editor
4. 🔄 (Opcional) Implementa autenticación con Supabase Auth
5. 🔄 (Opcional) Habilita Realtime para sincronización en tiempo real
6. 🚀 Despliega tu aplicación

¿Necesitas ayuda? Revisa `src/data/README.md` para la documentación de la API.

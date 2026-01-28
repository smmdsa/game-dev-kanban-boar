# 🔐 Autenticación con Supabase - Implementación Completada

## 🎉 Resumen de Cambios

Se ha implementado un sistema completo de autenticación de usuarios con Supabase, incluyendo:
- ✅ Registro de usuarios (sign up)
- ✅ Inicio de sesión (sign in)
- ✅ Cierre de sesión (sign out)
- ✅ Perfil de usuario en la UI
- ✅ Row Level Security (RLS) en la base de datos
- ✅ Separación de datos por usuario

## 📦 Archivos Creados/Modificados

### Nuevos Archivos

1. **`src/contexts/AuthContext.tsx`**
   - Context de autenticación
   - Hook `useAuth()` para acceder al estado del usuario
   - Funciones: `signUp`, `signIn`, `signOut`

2. **`src/components/AuthForm.tsx`**
   - Formulario de login/registro
   - Validación de campos
   - Manejo de errores

3. **`src/components/UserProfile.tsx`**
   - Avatar del usuario en el header
   - Dropdown menu con opción de sign out

4. **`src/AuthenticatedApp.tsx`**
   - Componente intermedio que maneja autenticación
   - Muestra AuthForm si no hay usuario
   - Muestra App si hay usuario autenticado

### Archivos Modificados

1. **`src/main.tsx`**
   - Envuelve la app con `AuthProvider`
   - Usa `AuthenticatedApp` en lugar de App directamente

2. **`src/App.tsx`**
   - Agrega `UserProfile` al header

3. **`src/data/providers/supabase-provider.ts`**
   - Agrega `user_id` a todos los repositorios
   - Incluye `user_id` al crear/actualizar datos

4. **`supabase/schema.sql`**
   - Agrega campo `user_id` a todas las tablas
   - Implementa Row Level Security (RLS)
   - Políticas de seguridad por usuario

5. **`.github/workflows/deploy.yml`**
   - Ya configurado con secrets de Supabase

## 🗄️ Actualización de Base de Datos

### ⚠️ IMPORTANTE: Re-ejecutar Schema SQL

Debes ejecutar nuevamente el schema SQL actualizado en Supabase:

```sql
-- Ejecuta TODO el contenido de supabase/schema.sql
-- Esto recreará las tablas con los campos de user_id
```

**Pasos:**
1. Ve a tu dashboard de Supabase
2. SQL Editor > New query
3. Copia TODO el contenido de `supabase/schema.sql`
4. Ejecuta el script

### Cambios en el Schema

#### Tabla `columns`
```sql
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- NUEVO
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `tasks`
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,  -- NUEVO
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  column_id TEXT NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'medium',
  comments JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Tabla `user_settings`
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,  -- CAMBIADO DE TEXT A UUID
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔒 Row Level Security (RLS)

Ahora cada usuario solo puede ver y modificar sus propios datos:

### Políticas Implementadas

**Columns:**
- ✅ Users can view their own columns
- ✅ Users can insert their own columns
- ✅ Users can update their own columns
- ✅ Users can delete their own columns

**Tasks:**
- ✅ Users can view their own tasks
- ✅ Users can insert their own tasks
- ✅ Users can update their own tasks
- ✅ Users can delete their own tasks

**User Settings:**
- ✅ Users can manage their own settings

## 🎯 Flujo de Autenticación

### 1. Usuario No Autenticado
```
┌─────────────────────┐
│   AuthForm          │
│  - Sign In Tab      │
│  - Sign Up Tab      │
└─────────────────────┘
```

### 2. Usuario Autenticado
```
┌─────────────────────────────────────┐
│         App Header                  │
│  [Avatar] [Theme] [Add Column]      │
└─────────────────────────────────────┘
│
│  Kanban Board con datos del usuario
```

### 3. Sign Up Flow
1. Usuario ingresa: Nombre, Email, Password
2. Validación de campos
3. Supabase crea cuenta
4. Email de confirmación (configurable)
5. Usuario redirigido a la app

### 4. Sign In Flow
1. Usuario ingresa: Email, Password
2. Validación de credenciales
3. Supabase autentica
4. Usuario redirigido a la app

### 5. Sign Out Flow
1. Usuario click en avatar > Sign out
2. Supabase cierra sesión
3. Usuario redirigido a AuthForm

## 📱 UI Componentes

### AuthForm
- **Tabs**: Sign In / Sign Up
- **Sign In Fields**:
  - Email
  - Password
- **Sign Up Fields**:
  - Name
  - Email
  - Password
  - Confirm Password
- **Validaciones**:
  - Campos requeridos
  - Passwords coinciden
  - Mínimo 6 caracteres
- **Estados**:
  - Loading spinner durante autenticación
  - Mensajes de error

### UserProfile
- **Avatar**: Iniciales del usuario
- **Dropdown Menu**:
  - Nombre del usuario
  - Email
  - Sign Out button

## 🔧 Configuración de Supabase Auth

### Email Settings (Opcional)

Por defecto, Supabase requiere confirmación de email. Para desarrollo:

1. Ve a: `Authentication > Providers > Email`
2. Desactiva "Confirm email" si quieres login inmediato
3. O configura un servicio SMTP para envío de emails

### OAuth Providers (Opcional)

Puedes agregar login con GitHub, Google, etc:

1. Ve a: `Authentication > Providers`
2. Habilita el provider deseado
3. Configura las credenciales

## 🎨 Personalización

### Cambiar Campos del Formulario

Edita `src/components/AuthForm.tsx`:

```tsx
// Agregar más campos al registro
<div className="space-y-2">
  <Label htmlFor="signup-company">Company</Label>
  <Input
    id="signup-company"
    type="text"
    placeholder="Your Company"
    value={signUpCompany}
    onChange={(e) => setSignUpCompany(e.target.value)}
  />
</div>
```

### Guardar Metadata del Usuario

En `src/contexts/AuthContext.tsx`:

```tsx
const { data, error: signUpError } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
      company: 'My Company',  // Metadata adicional
      avatar_url: '...',
    },
  },
});
```

## 🧪 Testing

### Test Local

1. `npm run dev`
2. Deberías ver el formulario de autenticación
3. Crea una cuenta de prueba
4. Verifica que aparezca el kanban board
5. Crea columnas y tareas
6. Sign out y verifica que no puedas ver los datos de otro usuario

### Verificar RLS

1. Crea usuario A y crea algunas tareas
2. Sign out
3. Crea usuario B
4. Verifica que no veas las tareas de usuario A

## 🚀 Deploy

### Variables de Entorno Ya Configuradas

El workflow ya tiene los secrets de Supabase:
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### Configuración de Email en Producción

Para que funcione el envío de emails de confirmación:

1. Ve a: `Project Settings > Auth > Email Auth`
2. Configura SMTP o usa el servicio de Supabase
3. Personaliza los templates de email

## 📚 Recursos Útiles

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)

## 🐛 Troubleshooting

### Error: "Invalid credentials"
- Verifica que el email/password sean correctos
- Verifica que el usuario haya confirmado su email (si está habilitado)

### Error: "User already registered"
- El email ya existe en la base de datos
- Usa "Sign In" en lugar de "Sign Up"

### No veo mis datos después de login
- Verifica que las políticas RLS estén correctas
- Verifica que `user_id` se esté guardando correctamente
- Revisa la consola del navegador para errores

### Email de confirmación no llega
- Verifica la carpeta de spam
- Desactiva "Confirm email" para desarrollo
- Configura SMTP para producción

## ✨ Próximos Pasos Sugeridos

1. ✅ Re-ejecutar schema SQL con los cambios
2. ✅ Probar registro y login localmente
3. ✅ Verificar RLS con múltiples usuarios
4. 🔄 (Opcional) Agregar "Forgot Password"
5. 🔄 (Opcional) Implementar OAuth (GitHub, Google)
6. 🔄 (Opcional) Personalizar emails de Supabase
7. 🔄 (Opcional) Agregar campos de perfil adicionales

---

## 🎯 TL;DR

**Implementado:**
- ✅ Sistema completo de autenticación
- ✅ Formularios de login/registro
- ✅ Perfil de usuario en UI
- ✅ RLS en base de datos
- ✅ Separación de datos por usuario

**Debes hacer:**
1. **Re-ejecutar el schema SQL actualizado en Supabase**
2. Reiniciar tu servidor de desarrollo
3. Probar creando una cuenta nueva

**Ya no necesitas:**
- ❌ Hardcodear `userId: 'test-user-123'`
- ❌ Preocuparte por seguridad - RLS protege los datos
- ❌ Implementar auth manualmente

¡La autenticación está lista! 🎉

# Sistema de Datos - Architecture Guide

## 📁 Estructura

```
src/data/
├── interfaces/          # Contratos de repositorios
│   └── repository.ts
├── providers/           # Implementaciones de providers
│   ├── spark-provider.ts    (useKV - local storage)
│   └── supabase-provider.ts (Supabase - cloud database)
├── context/             # React Context y hooks
│   └── data-context.tsx
└── index.ts            # Barrel exports
```

## 🎯 Patrón Repository

Este sistema implementa el **patrón Repository** con **Dependency Inversion** para:
- ✅ Separar lógica de datos de componentes UI
- ✅ Cambiar fácilmente entre providers (Spark ↔ Supabase)
- ✅ Testear componentes sin base de datos real
- ✅ Mantener código escalable y mantenible

## 🚀 Uso Básico

### En Componentes

```tsx
import { useTasks, useColumns, useAppTheme } from '@/data';

function MyComponent() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { columns, createColumn } = useColumns();
  const { theme, toggleTheme } = useAppTheme();

  // Usar funciones async
  const handleCreate = async () => {
    const result = await createTask({
      id: `task-${Date.now()}`,
      title: 'Nueva tarea',
      columnId: 'col-1',
      // ...
    });
    
    if (result.error) {
      console.error('Error:', result.error);
    }
  };

  return <div>...</div>;
}
```

## 🔄 Cambiar Provider

### Por defecto: Spark (Local Storage)

La aplicación usa Spark por defecto. No requiere configuración.

```tsx
// main.tsx
<DataProviderWrapper>
  <App />
</DataProviderWrapper>
```

### Cambiar a Supabase

1. **Configurar variables de entorno:**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

2. **Crear custom provider:**
```tsx
// main.tsx
import { DataProviderWrapper } from '@/data';
import { createSupabaseProvider } from '@/data';

const supabaseProvider = createSupabaseProvider({
  userId: 'user-123' // opcional
});

<DataProviderWrapper customProvider={supabaseProvider}>
  <App />
</DataProviderWrapper>
```

3. **Ejecutar schema SQL:**
```sql
-- Ejecuta supabase/schema.sql en Supabase SQL Editor
```

## 📦 Providers Disponibles

### 1. Spark Provider (Local)
- ✅ Sin configuración necesaria
- ✅ Persistencia en navegador (localStorage)
- ✅ Perfecto para desarrollo y demos
- ❌ No sincroniza entre dispositivos

### 2. Supabase Provider (Cloud)
- ✅ Base de datos PostgreSQL real
- ✅ Sincronización en tiempo real (opcional)
- ✅ Autenticación integrada (opcional)
- ✅ Escalable para producción
- ⚠️ Requiere configuración de credenciales

## 🔌 API del Provider

Todos los providers implementan esta interfaz:

```typescript
interface DataProvider {
  tasks: TaskRepository;
  columns: ColumnRepository;
  settings: SettingsRepository;
  
  initialize(): Promise<void>;
  disconnect(): Promise<void>;
}
```

### TaskRepository
```typescript
getTasks(): Promise<Result<Task[]>>
getTaskById(id: string): Promise<Result<Task | null>>
createTask(task: Task): Promise<Result<Task>>
updateTask(task: Task): Promise<Result<Task>>
deleteTask(id: string): Promise<Result<void>>
getTasksByColumn(columnId: string): Promise<Result<Task[]>>
```

### ColumnRepository
```typescript
getColumns(): Promise<Result<Column[]>>
getColumnById(id: string): Promise<Result<Column | null>>
createColumn(column: Column): Promise<Result<Column>>
updateColumn(column: Column): Promise<Result<Column>>
deleteColumn(id: string): Promise<Result<void>>
reorderColumns(columns: Column[]): Promise<Result<Column[]>>
```

### SettingsRepository
```typescript
getTheme(): Promise<Result<Theme>>
setTheme(theme: Theme): Promise<Result<Theme>>
```

## ✨ Hooks Disponibles

### `useData()`
Acceso completo al contexto. Úsalo solo si necesitas acceso directo al provider.

```tsx
const { provider, tasks, columns, theme, isLoading, error } = useData();
```

### `useTasks()` (Recomendado)
Hook específico para operaciones de tareas con auto-refresh.

```tsx
const { 
  tasks,           // Estado reactivo
  createTask,      // Crea y refresca
  updateTask,      // Actualiza y refresca
  deleteTask,      // Elimina y refresca
  getTaskById,     // Query individual
  refreshTasks     // Refresca manualmente
} = useTasks();
```

### `useColumns()` (Recomendado)
Hook específico para operaciones de columnas.

```tsx
const {
  columns,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  getColumnById,
  refreshColumns
} = useColumns();
```

### `useAppTheme()` (Recomendado)
Hook para manejo del tema.

```tsx
const { theme, setTheme, toggleTheme } = useAppTheme();
```

## 🛡️ Manejo de Errores

Todas las operaciones retornan un `Result<T>`:

```typescript
interface Result<T> {
  data: T | null;
  error: Error | null;
}
```

**Ejemplo de uso:**
```tsx
const handleUpdate = async () => {
  const result = await updateTask(updatedTask);
  
  if (result.error) {
    toast.error(`Error: ${result.error.message}`);
    return;
  }
  
  toast.success('Task updated!');
};
```

## 🔐 Configuración de Supabase

### Variables de Entorno
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

### GitHub Secrets (CI/CD)
1. Ve a: `Settings > Secrets and variables > Actions`
2. Crea secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### Schema SQL
Ejecuta `supabase/schema.sql` en tu proyecto Supabase para crear:
- Tabla `columns`
- Tabla `tasks`
- Tabla `user_settings`
- Índices optimizados
- Row Level Security policies
- Triggers para `updated_at`

## 🧪 Testing

Crear un mock provider para tests:

```tsx
import { DataProvider, Result } from '@/data';

const mockProvider: DataProvider = {
  name: 'mock',
  tasks: {
    getTasks: async () => ({ data: mockTasks, error: null }),
    // ... resto de métodos
  },
  columns: { /* ... */ },
  settings: { /* ... */ },
  initialize: async () => {},
  disconnect: async () => {},
};

// En test
<DataProviderWrapper customProvider={mockProvider}>
  <ComponentToTest />
</DataProviderWrapper>
```

## 🔄 Migración de Código Existente

### Antes (usando useKV directamente):
```tsx
const [tasks, setTasks] = useKV<Task[]>('kanban-tasks', []);

const handleCreate = (newTask: Task) => {
  setTasks((current) => [...(current || []), newTask]);
};
```

### Después (usando hooks del contexto):
```tsx
const { tasks, createTask } = useTasks();

const handleCreate = async (newTask: Task) => {
  await createTask(newTask);
  // Auto-refresh incluido
};
```

## 🎯 Principios SOLID Aplicados

- **S**ingle Responsibility: Cada repository maneja una entidad
- **O**pen/Closed: Extendible con nuevos providers sin modificar código existente
- **L**iskov Substitution: Todos los providers son intercambiables
- **I**nterface Segregation: Interfaces específicas por entidad
- **D**ependency Inversion: Componentes dependen de abstracciones, no implementaciones

## 📚 Recursos

- [Supabase Dashboard](https://app.supabase.com/)
- [Supabase Docs](https://supabase.com/docs)
- [GitHub Spark Docs](https://githubnext.com/projects/github-spark)

## 🐛 Troubleshooting

### Error: "Supabase credentials not configured"
- Verifica que `.env` exista y tenga las variables correctas
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Connection check failed"
- Verifica URL y clave en Supabase dashboard
- Ejecuta el schema SQL si no lo has hecho
- Verifica que RLS policies permitan acceso anónimo

### Datos no se refrescan
- Los hooks `useTasks` y `useColumns` auto-refrescan
- Si usas `useData()` directamente, llama `refreshAll()` manualmente

### Schema out of sync
- Ejecuta nuevamente el schema SQL
- Usa migraciones para cambios incrementales

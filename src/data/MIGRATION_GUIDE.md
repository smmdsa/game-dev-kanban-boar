# Guía de Migración: useKV → DataContext

Este documento muestra cómo migrar de `useKV` directo a usar los hooks del DataContext.

## Antes: Usando useKV directamente

```typescript
import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Task, Column } from '@/lib/types';

function OldApp() {
  const [columns, setColumns] = useKV<Column[]>('kanban-columns', []);
  const [tasks, setTasks] = useKV<Task[]>('kanban-tasks', []);

  const safeColumns = columns || [];
  const safeTasks = tasks || [];

  const handleCreateTask = (newTask: Task) => {
    setTasks((currentTasks) => {
      const tasks = currentTasks || [];
      return [...tasks, newTask];
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((currentTasks) =>
      (currentTasks || []).map((task) => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((currentTasks) => 
      (currentTasks || []).filter((task) => task.id !== taskId)
    );
  };

  return (
    <div>
      {safeTasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## Después: Usando hooks del DataContext

```typescript
import { useTasks, useColumns } from '@/data';
import { Task } from '@/lib/types';
import { toast } from 'sonner';

function NewApp() {
  // Hooks del contexto - auto-refrescan después de operaciones
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { columns } = useColumns();

  // Ya no necesitas safe checks - el hook los maneja
  // tasks y columns siempre son arrays válidos

  const handleCreateTask = async (newTask: Task) => {
    const result = await createTask(newTask);
    
    if (result.error) {
      toast.error(`Error: ${result.error.message}`);
      return;
    }
    
    toast.success('Task created!');
    // Auto-refresh incluido - tasks se actualiza automáticamente
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    const result = await updateTask(updatedTask);
    
    if (result.error) {
      toast.error(`Error: ${result.error.message}`);
      return;
    }
    
    toast.success('Task updated!');
  };

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId);
    
    if (result.error) {
      toast.error(`Error: ${result.error.message}`);
      return;
    }
    
    toast.success('Task deleted!');
  };

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## Ventajas de la Migración

- ✅ Auto-refresh después de operaciones
- ✅ Manejo de errores consistente
- ✅ No más safe checks (`|| []`)
- ✅ Cambiar de provider sin tocar componentes
- ✅ Mejor tipado con `Result<T>`
- ✅ Código más testeable
- ✅ Separación de concerns

## Patrón de Componente Completo

```typescript
import { Task } from '@/lib/types';
import { useTasks } from '@/data';
import { Button } from '@/components/ui/button';

function TaskList() {
  const { 
    tasks, 
    createTask, 
    updateTask, 
    deleteTask,
    refreshTasks 
  } = useTasks();

  // Crear tarea
  const handleCreate = async () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      description: '',
      columnId: 'col-1',
      priority: 'medium',
      tags: [],
      points: 0,
      createdAt: Date.now(),
      comments: [],
    };

    const result = await createTask(newTask);
    
    if (result.error) {
      console.error('Failed to create task:', result.error);
      return;
    }
    
    console.log('Task created:', result.data);
  };

  // Actualizar tarea
  const handleTogglePriority = async (task: Task) => {
    const updatedTask: Task = {
      ...task,
      priority: task.priority === 'high' ? 'low' : 'high',
    };

    await updateTask(updatedTask);
  };

  // Eliminar tarea
  const handleDelete = async (taskId: string) => {
    const confirmed = confirm('Delete this task?');
    if (!confirmed) return;

    await deleteTask(taskId);
  };

  return (
    <div>
      <Button onClick={handleCreate}>Create Task</Button>
      
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <Button onClick={() => handleTogglePriority(task)}>
            Toggle Priority
          </Button>
          <Button onClick={() => handleDelete(task.id)}>
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
```

## Hook useColumns - Ejemplo

```typescript
import { useColumns } from '@/data';
import { Column } from '@/lib/types';
import { Button } from '@/components/ui/button';

function ColumnManager() {
  const { 
    columns, 
    createColumn, 
    updateColumn, 
    deleteColumn,
    reorderColumns 
  } = useColumns();

  const handleCreateColumn = async () => {
    const newColumn: Column = {
      id: `col-${Date.now()}`,
      name: 'New Column',
      color: 'oklch(0.65 0.15 260)',
      order: columns.length,
    };

    await createColumn(newColumn);
  };

  const handleReorder = async () => {
    const reversed = [...columns].reverse().map((col, index) => ({
      ...col,
      order: index,
    }));

    await reorderColumns(reversed);
  };

  return (
    <div>
      <Button onClick={handleCreateColumn}>Add Column</Button>
      <Button onClick={handleReorder}>Reverse Order</Button>
      
      {columns.map(column => (
        <div key={column.id}>{column.name}</div>
      ))}
    </div>
  );
}
```

## Hook useAppTheme - Ejemplo

```typescript
import { useAppTheme } from '@/data';
import { Button } from '@/components/ui/button';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useAppTheme();

  return (
    <Button onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
}
```

## Hook useData - Acceso Completo (Avanzado)

```typescript
import { useData } from '@/data';
import { Button } from '@/components/ui/button';

function AdvancedComponent() {
  const { 
    provider,      // Provider actual (spark o supabase)
    tasks,         // Estado cacheado
    columns,       // Estado cacheado
    theme,         // Tema actual
    isLoading,     // Cargando datos iniciales
    error,         // Error de última operación
    refreshAll     // Refresca todo
  } = useData();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <p>Provider: {provider.name}</p>
      <p>Tasks: {tasks.length}</p>
      <p>Columns: {columns.length}</p>
      <p>Theme: {theme}</p>
      <Button onClick={refreshAll}>Refresh All</Button>
    </div>
  );
}
```

## Testing con Mock Provider

```typescript
import { DataProviderWrapper } from '@/data';
import type { DataProvider, Task, Column } from '@/data';

const mockProvider: DataProvider = {
  name: 'mock',
  tasks: {
    getTasks: async () => ({ 
      data: [] as Task[], 
      error: null 
    }),
    createTask: async (task) => ({ data: task, error: null }),
    updateTask: async (task) => ({ data: task, error: null }),
    deleteTask: async () => ({ data: undefined, error: null }),
    getTaskById: async () => ({ data: null, error: null }),
    getTasksByColumn: async () => ({ data: [], error: null }),
  },
  columns: {
    getColumns: async () => ({ data: [] as Column[], error: null }),
    getColumnById: async () => ({ data: null, error: null }),
    createColumn: async (col) => ({ data: col, error: null }),
    updateColumn: async (col) => ({ data: col, error: null }),
    deleteColumn: async () => ({ data: undefined, error: null }),
    reorderColumns: async (cols) => ({ data: cols, error: null }),
  },
  settings: {
    getTheme: async () => ({ data: 'light' as const, error: null }),
    setTheme: async (theme) => ({ data: theme, error: null }),
  },
  initialize: async () => {},
  disconnect: async () => {},
};

// En test
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <DataProviderWrapper customProvider={mockProvider}>
      {children}
    </DataProviderWrapper>
  );
}
```

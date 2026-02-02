import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { Task, Column } from '@/lib/types';
import type { DataProvider, Theme } from '../interfaces/repository';
import { useSparkProvider } from '../providers/spark-provider';

/**
 * Valor expuesto por el contexto de datos
 */
interface DataContextValue {
  /** Provider actual */
  provider: DataProvider;

  /** Estado de tareas cacheado para UI reactiva */
  tasks: Task[];

  /** Estado de columnas cacheado para UI reactiva */
  columns: Column[];

  /** Tema actual */
  theme: Theme;

  /** Indica si está cargando datos iniciales */
  isLoading: boolean;

  /** Error de última operación */
  error: Error | null;

  /** Refresca tareas desde el provider */
  refreshTasks: () => Promise<void>;

  /** Refresca columnas desde el provider */
  refreshColumns: () => Promise<void>;

  /** Refresca todos los datos */
  refreshAll: () => Promise<void>;

  /** Cambia el tema */
  setTheme: (theme: Theme) => Promise<void>;

  /** Actualiza el estado local de tareas sin esperar al provider (optimistic update) */
  setTasksOptimistic: (tasks: Task[]) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

interface DataProviderWrapperProps {
  children: ReactNode;
  /** Override del provider (para testing o cambio dinámico) */
  customProvider?: DataProvider;
}

/**
 * Wrapper que provee el contexto de datos a la aplicación
 */
export function DataProviderWrapper({
  children,
  customProvider,
}: DataProviderWrapperProps) {
  // Por defecto usa Spark (useKV)
  const sparkProvider = useSparkProvider();
  const provider = customProvider || sparkProvider;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshTasks = useCallback(async () => {
    const result = await provider.tasks.getTasks();
    if (result.error) {
      setError(result.error);
      console.error('[DataContext] Error loading tasks:', result.error);
    } else {
      const loadedTasks = result.data || [];
      
      // Normalizar el campo order si no existe o hay duplicados
      const tasksByColumn = new Map<string, Task[]>();
      loadedTasks.forEach(task => {
        if (!tasksByColumn.has(task.columnId)) {
          tasksByColumn.set(task.columnId, []);
        }
        tasksByColumn.get(task.columnId)!.push(task);
      });

      const normalizedTasks: Task[] = [];
      let needsUpdate = false;
      
      tasksByColumn.forEach((columnTasks, columnId) => {
        // Ordenar por order existente, o por createdAt si no tiene order
        columnTasks.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
          }
          return (a.createdAt || 0) - (b.createdAt || 0);
        });
        
        // Reasignar order secuencial
        columnTasks.forEach((task, index) => {
          const normalizedTask = { ...task, order: index };
          normalizedTasks.push(normalizedTask);
          
          // Verificar si necesita actualización en DB
          if (task.order !== index) {
            needsUpdate = true;
          }
        });
      });

      setTasks(normalizedTasks);
      setError(null);

      // Guardar en DB si hubo normalización (en segundo plano sin bloquear)
      if (needsUpdate) {
        console.log('[DataContext] Normalizing task order in database...');
        // Usar Promise.all para actualizar en paralelo pero sin await para no bloquear
        Promise.all(
          normalizedTasks.map(task => provider.tasks.updateTask(task))
        ).catch(err => {
          console.error('[DataContext] Error normalizing tasks:', err);
        });
      }
    }
  }, [provider.tasks]);

  const refreshColumns = useCallback(async () => {
    const result = await provider.columns.getColumns();
    if (result.error) {
      setError(result.error);
      console.error('[DataContext] Error loading columns:', result.error);
    } else {
      setColumns(result.data || []);
      setError(null);
    }
  }, [provider.columns]);

  const refreshTheme = useCallback(async () => {
    const result = await provider.settings.getTheme();
    if (result.data) {
      setThemeState(result.data);
      applyThemeToDocument(result.data);
    }
  }, [provider.settings]);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([refreshTasks(), refreshColumns(), refreshTheme()]);
    } finally {
      setIsLoading(false);
    }
  }, [refreshTasks, refreshColumns, refreshTheme]);

  const setTheme = useCallback(
    async (newTheme: Theme) => {
      const result = await provider.settings.setTheme(newTheme);
      if (!result.error) {
        setThemeState(newTheme);
        applyThemeToDocument(newTheme);
      }
    },
    [provider.settings]
  );

  // Inicialización
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await provider.initialize();
        if (mounted) {
          await refreshAll();
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      provider.disconnect();
    };
  }, [provider]);

  const setTasksOptimistic = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      provider,
      tasks,
      columns,
      theme,
      isLoading,
      error,
      refreshTasks,
      refreshColumns,
      refreshAll,
      setTheme,
      setTasksOptimistic,
    }),
    [
      provider,
      tasks,
      columns,
      theme,
      isLoading,
      error,
      refreshTasks,
      refreshColumns,
      refreshAll,
      setTheme,
      setTasksOptimistic,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

/**
 * Aplica el tema al documento HTML
 */
function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

/**
 * Hook para acceder al contexto de datos completo
 */
export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProviderWrapper');
  }
  return context;
}

/**
 * Hook específico para operaciones de tareas
 */
export function useTasks() {
  const { provider, tasks, refreshTasks, setTasksOptimistic } = useData();

  const createTask = useCallback(
    async (task: Task) => {
      const result = await provider.tasks.createTask(task);
      if (!result.error) await refreshTasks();
      return result;
    },
    [provider.tasks, refreshTasks]
  );

  const updateTask = useCallback(
    async (task: Task) => {
      const result = await provider.tasks.updateTask(task);
      if (!result.error) await refreshTasks();
      return result;
    },
    [provider.tasks, refreshTasks]
  );

  const updateTaskSilent = useCallback(
    async (task: Task) => {
      const result = await provider.tasks.updateTask(task);
      return result;
    },
    [provider.tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const result = await provider.tasks.deleteTask(id);
      if (!result.error) await refreshTasks();
      return result;
    },
    [provider.tasks, refreshTasks]
  );

  const getTaskById = useCallback(
    async (id: string) => {
      return provider.tasks.getTaskById(id);
    },
    [provider.tasks]
  );

  return useMemo(
    () => ({
      tasks,
      createTask,
      updateTask,
      updateTaskSilent,
      deleteTask,
      getTaskById,
      refreshTasks,
      setTasksOptimistic,
    }),
    [tasks, createTask, updateTask, updateTaskSilent, deleteTask, getTaskById, refreshTasks, setTasksOptimistic]
  );
}

/**
 * Hook específico para operaciones de columnas
 */
export function useColumns() {
  const { provider, columns, refreshColumns, refreshTasks } = useData();

  const createColumn = useCallback(
    async (column: Column) => {
      const result = await provider.columns.createColumn(column);
      if (!result.error) await refreshColumns();
      return result;
    },
    [provider.columns, refreshColumns]
  );

  const updateColumn = useCallback(
    async (column: Column) => {
      const result = await provider.columns.updateColumn(column);
      if (!result.error) await refreshColumns();
      return result;
    },
    [provider.columns, refreshColumns]
  );

  const deleteColumn = useCallback(
    async (id: string, deleteTasks: boolean = false) => {
      // Si se deben eliminar las tareas de la columna
      if (deleteTasks) {
        const tasksResult = await provider.tasks.getTasksByColumn(id);
        if (!tasksResult.error && tasksResult.data) {
          for (const task of tasksResult.data) {
            await provider.tasks.deleteTask(task.id);
          }
        }
      }

      const result = await provider.columns.deleteColumn(id);
      if (!result.error) {
        await refreshColumns();
        await refreshTasks();
      }
      return result;
    },
    [provider.columns, provider.tasks, refreshColumns, refreshTasks]
  );

  const reorderColumns = useCallback(
    async (cols: Column[]) => {
      const result = await provider.columns.reorderColumns(cols);
      if (!result.error) await refreshColumns();
      return result;
    },
    [provider.columns, refreshColumns]
  );

  const getColumnById = useCallback(
    async (id: string) => {
      return provider.columns.getColumnById(id);
    },
    [provider.columns]
  );

  return useMemo(
    () => ({
      columns,
      createColumn,
      updateColumn,
      deleteColumn,
      reorderColumns,
      getColumnById,
      refreshColumns,
    }),
    [
      columns,
      createColumn,
      updateColumn,
      deleteColumn,
      reorderColumns,
      getColumnById,
      refreshColumns,
    ]
  );
}

/**
 * Hook para el tema
 */
export function useAppTheme() {
  const { theme, setTheme } = useData();

  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await setTheme(newTheme);
  }, [theme, setTheme]);

  return useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme]
  );
}

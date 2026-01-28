import { useKV } from '@github/spark/hooks';
import type { Task, Column } from '@/lib/types';
import type {
  DataProvider,
  TaskRepository,
  ColumnRepository,
  SettingsRepository,
  Result,
  Theme,
} from '../interfaces/repository';

/**
 * Helper para crear resultados exitosos
 */
function success<T>(data: T): Result<T> {
  return { data, error: null };
}

/**
 * Helper para crear resultados con error
 */
function failure<T>(error: Error): Result<T> {
  return { data: null, error };
}

/**
 * Implementación de TaskRepository usando useKV de Spark
 */
export class SparkTaskRepository implements TaskRepository {
  constructor(
    private getTasks_: () => Task[] | null | undefined,
    private setTasks_: (updater: (current: Task[] | null | undefined) => Task[]) => void
  ) {}

  async getTasks(): Promise<Result<Task[]>> {
    try {
      return success(this.getTasks_() || []);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async getTaskById(id: string): Promise<Result<Task | null>> {
    try {
      const task = (this.getTasks_() || []).find(t => t.id === id) || null;
      return success(task);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async createTask(task: Task): Promise<Result<Task>> {
    try {
      this.setTasks_((current) => [...(current || []), task]);
      return success(task);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async updateTask(task: Task): Promise<Result<Task>> {
    try {
      this.setTasks_((current) =>
        (current || []).map(t => (t.id === task.id ? task : t))
      );
      return success(task);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async deleteTask(id: string): Promise<Result<void>> {
    try {
      this.setTasks_((current) => (current || []).filter(t => t.id !== id));
      return success(undefined);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async getTasksByColumn(columnId: string): Promise<Result<Task[]>> {
    try {
      const filtered = (this.getTasks_() || []).filter(t => t.columnId === columnId);
      return success(filtered);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }
}

/**
 * Implementación de ColumnRepository usando useKV de Spark
 */
export class SparkColumnRepository implements ColumnRepository {
  constructor(
    private getColumns_: () => Column[] | null | undefined,
    private setColumns_: (updater: (current: Column[] | null | undefined) => Column[]) => void
  ) {}

  async getColumns(): Promise<Result<Column[]>> {
    try {
      return success(this.getColumns_() || []);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async getColumnById(id: string): Promise<Result<Column | null>> {
    try {
      const column = (this.getColumns_() || []).find(c => c.id === id) || null;
      return success(column);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async createColumn(column: Column): Promise<Result<Column>> {
    try {
      this.setColumns_((current) => [...(current || []), column]);
      return success(column);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async updateColumn(column: Column): Promise<Result<Column>> {
    try {
      this.setColumns_((current) =>
        (current || []).map(c => (c.id === column.id ? column : c))
      );
      return success(column);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async deleteColumn(id: string): Promise<Result<void>> {
    try {
      this.setColumns_((current) => (current || []).filter(c => c.id !== id));
      return success(undefined);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async reorderColumns(columns: Column[]): Promise<Result<Column[]>> {
    try {
      this.setColumns_(() => columns);
      return success(columns);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }
}

/**
 * Implementación de SettingsRepository usando useKV de Spark
 */
export class SparkSettingsRepository implements SettingsRepository {
  constructor(
    private getTheme_: () => Theme | null | undefined,
    private setTheme_: (theme: Theme) => void
  ) {}

  async getTheme(): Promise<Result<Theme>> {
    try {
      return success(this.getTheme_() || 'light');
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }

  async setTheme(theme: Theme): Promise<Result<Theme>> {
    try {
      this.setTheme_(theme);
      return success(theme);
    } catch (e) {
      return failure(e instanceof Error ? e : new Error(String(e)));
    }
  }
}

/**
 * Hook que crea el SparkDataProvider
 * 
 * Nota: Este es un hook porque useKV solo funciona dentro de componentes React.
 * Internamente usa useKV para persistencia automática en el navegador.
 */
export function useSparkProvider(): DataProvider {
  const [tasks, setTasks] = useKV<Task[]>('kanban-tasks', []);
  const [columns, setColumns] = useKV<Column[]>('kanban-columns', []);
  const [theme, setTheme] = useKV<Theme>('app-theme', 'light');

  // Creamos getters que capturan el estado actual
  const getTasks = () => tasks;
  const getColumns = () => columns;
  const getTheme = () => theme;

  return {
    name: 'spark',
    tasks: new SparkTaskRepository(getTasks, setTasks),
    columns: new SparkColumnRepository(getColumns, setColumns),
    settings: new SparkSettingsRepository(getTheme, setTheme),
    
    async initialize() {
      // useKV se inicializa automáticamente
      console.log('[SparkProvider] Initialized with local storage');
    },
    
    async disconnect() {
      // No hay conexión que cerrar
      console.log('[SparkProvider] Disconnected');
    },
  };
}

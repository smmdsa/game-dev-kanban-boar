import type { Task, Column } from '@/lib/types';

/**
 * Tipos de tema soportados
 */
export type Theme = 'light' | 'dark';

/**
 * Resultado de operaciones async
 * Patrón Result para manejo de errores sin excepciones
 */
export interface Result<T> {
  data: T | null;
  error: Error | null;
}

/**
 * Contrato para repositorio de tareas
 * Aplica Interface Segregation - cada entidad tiene su interfaz
 */
export interface TaskRepository {
  /** Obtiene todas las tareas */
  getTasks(): Promise<Result<Task[]>>;
  
  /** Obtiene una tarea por ID */
  getTaskById(id: string): Promise<Result<Task | null>>;
  
  /** Crea una nueva tarea */
  createTask(task: Task): Promise<Result<Task>>;
  
  /** Actualiza una tarea existente */
  updateTask(task: Task): Promise<Result<Task>>;
  
  /** Elimina una tarea por ID */
  deleteTask(id: string): Promise<Result<void>>;
  
  /** Obtiene tareas por columna */
  getTasksByColumn(columnId: string): Promise<Result<Task[]>>;
}

/**
 * Contrato para repositorio de columnas
 */
export interface ColumnRepository {
  /** Obtiene todas las columnas */
  getColumns(): Promise<Result<Column[]>>;
  
  /** Obtiene una columna por ID */
  getColumnById(id: string): Promise<Result<Column | null>>;
  
  /** Crea una nueva columna */
  createColumn(column: Column): Promise<Result<Column>>;
  
  /** Actualiza una columna existente */
  updateColumn(column: Column): Promise<Result<Column>>;
  
  /** Elimina una columna por ID */
  deleteColumn(id: string): Promise<Result<void>>;
  
  /** Reordena las columnas */
  reorderColumns(columns: Column[]): Promise<Result<Column[]>>;
}

/**
 * Contrato para repositorio de configuración
 */
export interface SettingsRepository {
  /** Obtiene el tema actual */
  getTheme(): Promise<Result<Theme>>;
  
  /** Establece el tema */
  setTheme(theme: Theme): Promise<Result<Theme>>;
}

/**
 * Agregado de todos los repositorios
 * Dependency Inversion - componentes dependen de esta abstracción
 */
export interface DataProvider {
  readonly tasks: TaskRepository;
  readonly columns: ColumnRepository;
  readonly settings: SettingsRepository;
  
  /** Nombre identificador del provider */
  readonly name: string;
  
  /** Inicializa la conexión (si aplica) */
  initialize(): Promise<void>;
  
  /** Limpia recursos */
  disconnect(): Promise<void>;
}

/**
 * Tipos de provider soportados
 */
export type ProviderType = 'spark' | 'supabase' | 'memory';

/**
 * Configuración del provider
 */
export interface ProviderConfig {
  type: ProviderType;
  options?: Record<string, unknown>;
}

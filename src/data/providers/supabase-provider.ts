import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
 * Implementación de TaskRepository con Supabase
 */
export class SupabaseTaskRepository implements TaskRepository {
  constructor(
    private client: SupabaseClient,
    private userId: string
  ) {}

  async getTasks(): Promise<Result<Task[]>> {
    const { data, error } = await this.client
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return failure(new Error(error.message));
    return success(this.mapTasksFromDb(data || []));
  }

  async getTaskById(id: string): Promise<Result<Task | null>> {
    const { data, error } = await this.client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return success(null); // No encontrado
      return failure(new Error(error.message));
    }
    return success(this.mapTaskFromDb(data));
  }

  async createTask(task: Task): Promise<Result<Task>> {
    const dbTask = this.mapTaskToDb(task);
    const { data, error } = await this.client
      .from('tasks')
      .insert(dbTask)
      .select()
      .single();

    if (error) return failure(new Error(error.message));
    return success(this.mapTaskFromDb(data));
  }

  async updateTask(task: Task): Promise<Result<Task>> {
    const dbTask = this.mapTaskToDb(task);
    const { data, error } = await this.client
      .from('tasks')
      .update(dbTask)
      .eq('id', task.id)
      .select()
      .single();

    if (error) return failure(new Error(error.message));
    return success(this.mapTaskFromDb(data));
  }

  async deleteTask(id: string): Promise<Result<void>> {
    const { error } = await this.client
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) return failure(new Error(error.message));
    return success(undefined);
  }

  async getTasksByColumn(columnId: string): Promise<Result<Task[]>> {
    const { data, error } = await this.client
      .from('tasks')
      .select('*')
      .eq('column_id', columnId)
      .order('created_at', { ascending: true });

    if (error) return failure(new Error(error.message));
    return success(this.mapTasksFromDb(data || []));
  }

  // Mapeo de snake_case (DB) a camelCase (App)
  private mapTaskFromDb(row: Record<string, unknown>): Task {
    return {
      id: row.id as string,
      title: row.title as string,
      description: row.description as string || '',
      createdAt: row.created_at ? new Date(row.created_at as string).getTime() : Date.now(),
      points: row.points as number || 0,
      tags: (row.tags as string[]) || [],
      columnId: row.column_id as string,
      priority: row.priority as Task['priority'] || 'medium',
      comments: (row.comments as Task['comments']) || [],
      order: row.order as number || 0,
    };
  }

  private mapTasksFromDb(rows: Record<string, unknown>[]): Task[] {
    return rows.map(row => this.mapTaskFromDb(row));
  }

  // Mapeo de camelCase (App) a snake_case (DB)
  private mapTaskToDb(task: Task): Record<string, unknown> {
    return {
      id: task.id,
      user_id: this.userId,
      title: task.title,
      description: task.description,
      created_at: new Date(task.createdAt).toISOString(),
      points: task.points,
      tags: task.tags,
      column_id: task.columnId,
      priority: task.priority,
      comments: task.comments || [],
      order: task.order || 0,
    };
  }
}

/**
 * Implementación de ColumnRepository con Supabase
 */
export class SupabaseColumnRepository implements ColumnRepository {
  constructor(
    private client: SupabaseClient,
    private userId: string
  ) {}

  async getColumns(): Promise<Result<Column[]>> {
    const { data, error } = await this.client
      .from('columns')
      .select('*')
      .order('order', { ascending: true });

    if (error) return failure(new Error(error.message));
    return success(this.mapColumnsFromDb(data || []));
  }

  async getColumnById(id: string): Promise<Result<Column | null>> {
    const { data, error } = await this.client
      .from('columns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return success(null);
      return failure(new Error(error.message));
    }
    return success(this.mapColumnFromDb(data));
  }

  async createColumn(column: Column): Promise<Result<Column>> {
    const dbColumn = this.mapColumnToDb(column);
    const { data, error } = await this.client
      .from('columns')
      .insert(dbColumn)
      .select()
      .single();

    if (error) return failure(new Error(error.message));
    return success(this.mapColumnFromDb(data));
  }

  async updateColumn(column: Column): Promise<Result<Column>> {
    const dbColumn = this.mapColumnToDb(column);
    const { data, error } = await this.client
      .from('columns')
      .update(dbColumn)
      .eq('id', column.id)
      .select()
      .single();

    if (error) return failure(new Error(error.message));
    return success(this.mapColumnFromDb(data));
  }

  async deleteColumn(id: string): Promise<Result<void>> {
    const { error } = await this.client
      .from('columns')
      .delete()
      .eq('id', id);

    if (error) return failure(new Error(error.message));
    return success(undefined);
  }

  async reorderColumns(columns: Column[]): Promise<Result<Column[]>> {
    // Actualizar el orden de cada columna en batch
    const updates = columns.map((col, index) => ({
      id: col.id,
      user_id: this.userId,
      name: col.name,
      color: col.color,
      order: index,
    }));

    const { error } = await this.client
      .from('columns')
      .upsert(updates);

    if (error) return failure(new Error(error.message));
    return success(columns.map((col, index) => ({ ...col, order: index })));
  }

  private mapColumnFromDb(row: Record<string, unknown>): Column {
    return {
      id: row.id as string,
      name: row.name as string,
      color: row.color as string,
      order: row.order as number || 0,
    };
  }

  private mapColumnsFromDb(rows: Record<string, unknown>[]): Column[] {
    return rows.map(row => this.mapColumnFromDb(row));
  }

  private mapColumnToDb(column: Column): Record<string, unknown> {
    return {
      id: column.id,
      user_id: this.userId,
      name: column.name,
      color: column.color,
      order: column.order,
    };
  }
}

/**
 * Implementación de SettingsRepository con Supabase
 * Usa una tabla user_settings para persistir preferencias
 */
export class SupabaseSettingsRepository implements SettingsRepository {
  constructor(
    private client: SupabaseClient,
    private userId: string
  ) {}

  async getTheme(): Promise<Result<Theme>> {
    const { data, error } = await this.client
      .from('user_settings')
      .select('theme')
      .eq('user_id', this.userId)
      .single();

    if (error) {
      // Si no existe, retornar default
      if (error.code === 'PGRST116') return success('light' as Theme);
      return failure(new Error(error.message));
    }
    return success((data?.theme as Theme) || 'light');
  }

  async setTheme(theme: Theme): Promise<Result<Theme>> {
    const { error } = await this.client
      .from('user_settings')
      .upsert({
        user_id: this.userId,
        theme,
        updated_at: new Date().toISOString(),
      });

    if (error) return failure(new Error(error.message));
    return success(theme);
  }
}

/**
 * Configuración para el provider de Supabase
 */
export interface SupabaseProviderConfig {
  userId?: string;
}

/**
 * Singleton del cliente Supabase
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * Obtiene o crea el cliente Supabase
 */
function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase credentials not configured. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY in your .env file'
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}

/**
 * Factory para crear SupabaseDataProvider
 */
export function createSupabaseProvider(config: SupabaseProviderConfig = {}): DataProvider {
  const client = getSupabaseClient();
  const userId = config.userId || 'anonymous';

  return {
    name: 'supabase',
    tasks: new SupabaseTaskRepository(client, userId),
    columns: new SupabaseColumnRepository(client, userId),
    settings: new SupabaseSettingsRepository(client, userId),

    async initialize() {
      // Verificar conexión con una query simple
      const { error } = await client.from('columns').select('id').limit(1);
      if (error) {
        console.warn('[SupabaseProvider] Connection check failed:', error.message);
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
      console.log('[SupabaseProvider] Initialized and connected');
    },

    async disconnect() {
      // Supabase client no requiere desconexión explícita
      console.log('[SupabaseProvider] Disconnected');
    },
  };
}

/**
 * Obtiene el cliente Supabase raw para operaciones avanzadas
 * Útil para autenticación, realtime, storage, etc.
 */
export function getSupabaseRawClient(): SupabaseClient {
  return getSupabaseClient();
}

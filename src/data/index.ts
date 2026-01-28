// ===========================================
// Interfaces (Contratos)
// ===========================================
export type {
  DataProvider,
  TaskRepository,
  ColumnRepository,
  SettingsRepository,
  Result,
  ProviderConfig,
  ProviderType,
  Theme,
} from './interfaces/repository';

// ===========================================
// Providers
// ===========================================
export { useSparkProvider } from './providers/spark-provider';
export {
  createSupabaseProvider,
  getSupabaseRawClient,
  type SupabaseProviderConfig,
} from './providers/supabase-provider';

// ===========================================
// Context y Hooks
// ===========================================
export {
  DataProviderWrapper,
  useData,
  useTasks,
  useColumns,
  useAppTheme,
} from './context/data-context';

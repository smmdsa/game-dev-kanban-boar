-- ===========================================
-- Supabase Schema for Kanban Board
-- ===========================================
-- Ejecuta este SQL en el SQL Editor de Supabase:
-- Dashboard > SQL Editor > New query

-- ===========================================
-- Tabla: columns
-- ===========================================
CREATE TABLE IF NOT EXISTS columns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'oklch(0.65 0.15 260)',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para ordenamiento
CREATE INDEX IF NOT EXISTS idx_columns_order ON columns ("order");

-- ===========================================
-- Tabla: tasks
-- ===========================================
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  column_id TEXT NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  comments JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries comunes
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks (column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at);

-- ===========================================
-- Tabla: user_settings (para preferencias)
-- ===========================================
CREATE TABLE IF NOT EXISTS user_settings (
  user_id TEXT PRIMARY KEY,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- Triggers para updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para columns
DROP TRIGGER IF EXISTS update_columns_updated_at ON columns;
CREATE TRIGGER update_columns_updated_at
  BEFORE UPDATE ON columns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================
-- Por ahora permitimos acceso público (anon)
-- Puedes ajustar esto cuando implementes autenticación

ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (para desarrollo)
-- NOTA: Ajusta estas políticas en producción con autenticación

-- Columns: acceso completo para todos
CREATE POLICY "Allow all access to columns" ON columns
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Tasks: acceso completo para todos
CREATE POLICY "Allow all access to tasks" ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- User settings: acceso completo para todos
CREATE POLICY "Allow all access to user_settings" ON user_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ===========================================
-- Datos iniciales (opcional)
-- ===========================================
-- Descomenta si quieres columnas por defecto

/*
INSERT INTO columns (id, name, color, "order") VALUES
  ('col-backlog', 'Backlog', 'oklch(0.65 0.15 260)', 0),
  ('col-todo', 'To Do', 'oklch(0.70 0.15 200)', 1),
  ('col-in-progress', 'In Progress', 'oklch(0.75 0.18 85)', 2),
  ('col-review', 'Review', 'oklch(0.70 0.15 300)', 3),
  ('col-done', 'Done', 'oklch(0.72 0.19 145)', 4)
ON CONFLICT (id) DO NOTHING;
*/

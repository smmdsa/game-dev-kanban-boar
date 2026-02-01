-- ===========================================
-- Supabase Schema for Kanban Board
-- ===========================================
-- Ejecuta este SQL en el SQL Editor de Supabase:
-- Dashboard > SQL Editor > New query

-- ===========================================
-- Drop existing tables (si existen)
-- ===========================================
-- ADVERTENCIA: Esto eliminará todos los datos existentes
-- Solo ejecutar si estás seguro o es una nueva instalación

DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS columns CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

-- ===========================================
-- Tabla: columns
-- ===========================================
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'oklch(0.65 0.15 260)',
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para ordenamiento y usuario
CREATE INDEX IF NOT EXISTS idx_columns_order ON columns ("order");
CREATE INDEX IF NOT EXISTS idx_columns_user_id ON columns (user_id);

-- ===========================================
-- Tabla: tasks
-- ===========================================
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  column_id TEXT NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  comments JSONB DEFAULT '[]',
  "order" INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para queries comunes
CREATE INDEX IF NOT EXISTS idx_tasks_column_id ON tasks (column_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks (priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks (created_at);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks ("order");

-- ===========================================
-- Tabla: user_settings (para preferencias)
-- ===========================================
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
-- Políticas de seguridad por usuario autenticado

ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Columns: solo el usuario puede ver/modificar sus propias columnas
DROP POLICY IF EXISTS "Users can view their own columns" ON columns;
CREATE POLICY "Users can view their own columns" ON columns
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own columns" ON columns;
CREATE POLICY "Users can insert their own columns" ON columns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own columns" ON columns;
CREATE POLICY "Users can update their own columns" ON columns
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own columns" ON columns;
CREATE POLICY "Users can delete their own columns" ON columns
  FOR DELETE
  USING (auth.uid() = user_id);

-- Tasks: solo el usuario puede ver/modificar sus propias tareas
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- User settings: solo el usuario puede ver/modificar sus propias preferencias
DROP POLICY IF EXISTS "Users can manage their own settings" ON user_settings;
CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

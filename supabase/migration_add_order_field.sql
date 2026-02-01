-- ===========================================
-- Migración: Agregar campo "order" a tareas existentes
-- ===========================================
-- Ejecuta este SQL en el SQL Editor de Supabase
-- si ya tienes datos existentes

-- Agregar columna "order" a la tabla tasks (si no existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'order'
    ) THEN
        ALTER TABLE tasks ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Crear índice para el campo order
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks ("order");

-- Asignar valores de order a tareas existentes
-- Ordenar por created_at dentro de cada columna
WITH ranked_tasks AS (
  SELECT 
    id,
    column_id,
    ROW_NUMBER() OVER (PARTITION BY column_id ORDER BY created_at) - 1 AS new_order
  FROM tasks
)
UPDATE tasks
SET "order" = ranked_tasks.new_order
FROM ranked_tasks
WHERE tasks.id = ranked_tasks.id;

-- Verificar que todas las tareas tienen un valor de order
SELECT 
  column_id,
  COUNT(*) as task_count,
  MIN("order") as min_order,
  MAX("order") as max_order
FROM tasks
GROUP BY column_id
ORDER BY column_id;

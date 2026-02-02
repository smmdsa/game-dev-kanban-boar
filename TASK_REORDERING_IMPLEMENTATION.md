# Reordenamiento Manual de Tareas

## Implementación Completa

Se ha implementado la funcionalidad para ordenar manualmente las tareas dentro de una misma columna mediante drag-and-drop.

## Cambios Realizados

### 1. Modelo de Datos (`src/lib/types.ts`)
- **Agregado**: Campo `order: number` a la interfaz `Task`
- Este campo mantiene la posición relativa de cada tarea dentro de su columna

### 2. Componente KanbanColumn (`src/components/KanbanColumn.tsx`)
- **Agregada prop**: `onTaskReorder: (taskId: string, newOrder: number, columnId: string) => void`
- **Modificado el render**: Cada TaskCard ahora está envuelto en un `<div>` con handlers de drag-and-drop
- **onDragOver**: Previene el comportamiento por defecto
- **onDrop**: Llama a `onTaskReorder` con el índice de la tarea objetivo

### 3. Lógica Principal (`src/App.tsx`)

#### `handleTaskReorder`
Nueva función que maneja el reordenamiento de tareas:
- Verifica que la tarea arrastrada pertenezca a la columna
- Obtiene las tareas de la columna ordenadas por `order`
- Calcula la nueva posición
- Reordena el array de tareas
- **Actualiza la UI inmediatamente (optimistic update)** usando `setTasksOptimistic`
- Guarda los cambios en la base de datos en segundo plano
- Muestra toast solo cuando termina la operación

#### `handleDrop` (modificada)
- Ahora solo maneja movimiento entre columnas diferentes
- Al mover a una columna diferente, asigna el siguiente valor disponible de `order`
- **Actualización optimista**: UI se actualiza antes de guardar en DB

#### `getTasksByColumn` (modificada)
- Ahora ordena las tareas por el campo `order` antes de devolverlas
- Mantiene el orden correcto en el renderizado

#### `handleCreateTask` (modificada)
- Calcula el valor máximo de `order` en la columna destino
- Asigna `maxOrder + 1` a la nueva tarea
- Las nuevas tareas siempre se agregan al final

### 4. Base de Datos

#### Contexto de Datos (`src/data/context/data-context.tsx`)
- **Agregada función**: `setTasksOptimistic` para actualizaciones optimistas del estado
- Permite actualizar la UI inmediatamente sin esperar a la base de datos
- Mejora la experiencia de usuario con respuesta instantánea

#### Esquema (`supabase/schema.sql`)
- **Agregado**: Campo `"order" INTEGER NOT NULL DEFAULT 0` a la tabla `tasks`
- **Agregado**: Índice `idx_tasks_order` para optimizar queries

#### Migración (`supabase/migration_add_order_field.sql`)
Script SQL para usuarios existentes:
- Agrega la columna `order` si no existe
- Crea el índice correspondiente
- Asigna valores de orden a tareas existentes basándose en `created_at`
- Incluye query de verificación

## Cómo Usar

### Reordenar Tareas
1. Haz clic y arrastra una tarjeta de tarea
2. Suelta la tarea sobre otra tarea en la **misma columna**
3. La tarea se insertará en esa posición
4. Todas las tareas siguientes se desplazarán hacia abajo

### Mover entre Columnas
El comportamiento existente se mantiene:
- Arrastra una tarea a cualquier parte de otra columna
- La tarea se agregará al final de la columna destino
- El orden se preserva automáticamente

## Migración para Usuarios Existentes

Si ya tienes datos en Supabase:

1. Abre el **SQL Editor** en tu dashboard de Supabase
2. Ejecuta el contenido de `supabase/migration_add_order_field.sql`
3. Verifica que todas las tareas tienen valores de `order` correctos
4. Las tareas existentes se ordenarán por fecha de creación

## Consideraciones Técnicas

### Optimización
- Las tareas se ordenan en memoria usando `Array.sort()` - eficiente para tableros típicos
- El índice `idx_tasks_order` acelera las queries de ordenamiento en Supabase
- Solo se actualizan las tareas afectadas durante el reordenamiento
- **Actualización optimista**: La UI responde instantáneamente mientras se guarda en segundo plano
- La base de datos se actualiza de forma asíncrona sin bloquear la interfaz

### Edge Cases Manejados
- ✅ Nueva tarea en columna vacía: `order = 0`
- ✅ Nueva tarea en columna con datos: `order = max + 1`
- ✅ Tarea movida entre columnas: recalcula `order`
- ✅ Arrastrar sobre sí misma: no hace nada
- ✅ Filtros activos: el orden se mantiene consistente

### Comportamiento de Drag-and-Drop
- **Dentro de la misma columna**: Reordena según el drop target - **respuesta instantánea**
- **Entre columnas diferentes**: Mueve y agrega al final - **respuesta instantánea**
- **Feedback visual**: Existente (anillo de acento, sombra)
- **Persistencia**: Guardado en segundo plano sin bloquear la UI

## Testing Recomendado

1. ✅ Crear nueva tarea - verifica que `order` se asigne correctamente
2. ✅ Reordenar dentro de la misma columna - verifica posición
3. ✅ Mover entre columnas - verifica que se agregue al final
4. ✅ Recargar página - verifica que el orden persiste
5. ✅ Con filtros activos - verifica que el orden se mantiene
6. ✅ Múltiples tareas - reordenar varias consecutivamente

## Próximas Mejoras Sugeridas

- [ ] Optimización: Batch update de tareas en una sola transacción
- [ ] UX: Indicador visual de "drop zone" más claro
- [ ] Performance: Usar números flotantes para `order` y evitar actualizar todas las tareas
- [ ] Feature: Opción de ordenar automáticamente por prioridad o fecha
- [x] **IMPLEMENTADO**: Actualización optimista para respuesta instantánea en la UI

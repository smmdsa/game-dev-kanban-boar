import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Task, Column, Priority } from '@/lib/types';
import { KanbanColumn } from '@/components/KanbanColumn';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { ColumnModal } from '@/components/ColumnModal';
import { SearchFilter } from '@/components/SearchFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Plus } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster, toast } from 'sonner';

function App() {
  const [columns, setColumns] = useKV<Column[]>('kanban-columns', []);
  const [tasks, setTasks] = useKV<Task[]>('kanban-tasks', []);

  const safeColumns = columns || [];
  const safeTasks = tasks || [];

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createColumnOpen, setCreateColumnOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>('');
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [filteredTaskIds, setFilteredTaskIds] = useState<string[]>([]);
  const [draggingColumn, setDraggingColumn] = useState<Column | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Column | null>(null);

  const handleCreateColumn = (name: string, color: string) => {
    setColumns((currentColumns) => {
      const cols = currentColumns || [];
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        name,
        color,
        order: cols.length,
      };
      return [...cols, newColumn];
    });
    toast.success('Column created successfully');
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setCreateColumnOpen(true);
  };

  const handleSaveEditedColumn = (name: string, color: string) => {
    if (!editingColumn) return;
    
    setColumns((currentColumns) =>
      (currentColumns || []).map((col) =>
        col.id === editingColumn.id ? { ...col, name, color } : col
      )
    );
    setEditingColumn(null);
    toast.success('Column updated successfully');
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns((currentColumns) => (currentColumns || []).filter((col) => col.id !== columnId));
    setTasks((currentTasks) => (currentTasks || []).filter((task) => task.columnId !== columnId));
    toast.success('Column deleted');
  };

  const handleAddTask = (columnId: string) => {
    setTargetColumnId(columnId);
    setCreateTaskOpen(true);
  };

  const handleCreateTask = (title: string, description: string, points: number, tags: string[], priority: Priority) => {
    setTasks((currentTasks) => {
      const tasks = currentTasks || [];
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        createdAt: Date.now(),
        points,
        tags,
        columnId: targetColumnId,
        priority,
      };
      return [...tasks, newTask];
    });
    toast.success('Task created');
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks((currentTasks) =>
      (currentTasks || []).map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success('Task updated');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((currentTasks) => (currentTasks || []).filter((task) => task.id !== taskId));
    toast.success('Task deleted');
  };

  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  const handleDragEnd = () => {
    setDraggingTask(null);
    setDragOverColumnId(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumnId(columnId);
  };

  const handleDrop = (columnId: string) => {
    if (!draggingTask || draggingTask.columnId === columnId) {
      setDragOverColumnId(null);
      return;
    }

    setTasks((currentTasks) =>
      (currentTasks || []).map((task) =>
        task.id === draggingTask.id ? { ...task, columnId } : task
      )
    );
    
    setDraggingTask(null);
    setDragOverColumnId(null);
    toast.success('Task moved');
  };

  const handleColumnDragStart = (column: Column) => {
    setDraggingColumn(column);
  };

  const handleColumnDragEnd = () => {
    setDraggingColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, targetColumn: Column) => {
    e.preventDefault();
    if (draggingColumn && draggingColumn.id !== targetColumn.id) {
      setDragOverColumn(targetColumn);
    }
  };

  const handleColumnDrop = (targetColumn: Column) => {
    if (!draggingColumn || draggingColumn.id === targetColumn.id) {
      setDragOverColumn(null);
      return;
    }

    setColumns((currentColumns) => {
      const cols = currentColumns || [];
      const dragIndex = cols.findIndex((col) => col.id === draggingColumn.id);
      const dropIndex = cols.findIndex((col) => col.id === targetColumn.id);

      if (dragIndex === -1 || dropIndex === -1) return cols;

      const newColumns = [...cols];
      const [removed] = newColumns.splice(dragIndex, 1);
      newColumns.splice(dropIndex, 0, removed);

      return newColumns.map((col, index) => ({
        ...col,
        order: index,
      }));
    });

    setDraggingColumn(null);
    setDragOverColumn(null);
    toast.success('Column reordered');
  };

  const getTasksByColumn = (columnId: string) => {
    const columnTasks = safeTasks.filter((task) => task.columnId === columnId);
    
    if (filteredTaskIds.length === 0) {
      return columnTasks;
    }
    
    return columnTasks.filter((task) => filteredTaskIds.includes(task.id));
  };

  const hasActiveFilters = filteredTaskIds.length > 0;
  const visibleTaskCount = hasActiveFilters
    ? filteredTaskIds.length
    : safeTasks.length;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">GameDev Kanban</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Organize and track your game development workflow
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setCreateColumnOpen(true)} size="lg">
              <Plus size={20} weight="bold" className="mr-2" />
              Add Column
            </Button>
          </div>
        </div>

        {safeTasks.length > 0 && (
          <div className="flex items-center gap-4">
            <SearchFilter
              tasks={safeTasks}
              onFilteredTasksChange={setFilteredTaskIds}
            />
            {hasActiveFilters && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {visibleTaskCount} {visibleTaskCount === 1 ? 'task' : 'tasks'} found
              </span>
            )}
          </div>
        )}
      </header>

      <main className="p-6">
        {safeColumns.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold mb-2">Welcome to GameDev Kanban</h2>
              <p className="text-muted-foreground mb-6">
                Create your first column to start organizing your game development tasks
              </p>
              <Button onClick={() => setCreateColumnOpen(true)} size="lg">
                <Plus size={20} weight="bold" className="mr-2" />
                Create First Column
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {safeColumns
                .sort((a, b) => a.order - b.order)
                .map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={getTasksByColumn(column.id)}
                    onTaskClick={handleTaskClick}
                    onAddTask={handleAddTask}
                    onEditColumn={handleEditColumn}
                    onDeleteColumn={handleDeleteColumn}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDrop={handleDrop}
                    isDraggingOver={dragOverColumnId === column.id}
                    onColumnDragStart={handleColumnDragStart}
                    onColumnDragEnd={handleColumnDragEnd}
                    onColumnDragOver={handleColumnDragOver}
                    onColumnDrop={handleColumnDrop}
                    isColumnDragging={draggingColumn?.id === column.id}
                  />
                ))}
            </div>
          </ScrollArea>
        )}
      </main>

      <TaskDetailModal
        task={selectedTask}
        open={taskDetailOpen}
        onClose={() => {
          setTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <CreateTaskModal
        open={createTaskOpen}
        onClose={() => {
          setCreateTaskOpen(false);
          setTargetColumnId('');
        }}
        onCreate={handleCreateTask}
      />

      <ColumnModal
        open={createColumnOpen}
        onClose={() => {
          setCreateColumnOpen(false);
          setEditingColumn(null);
        }}
        onSave={editingColumn ? handleSaveEditedColumn : handleCreateColumn}
        column={editingColumn}
      />
    </div>
  );
}

export default App;
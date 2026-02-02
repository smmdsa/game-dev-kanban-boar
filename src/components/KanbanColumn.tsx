import { Task, Column } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash, DotsSixVertical } from '@phosphor-icons/react';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (columnId: string) => void;
  isDraggingOver: boolean;
  onColumnDragStart: (column: Column) => void;
  onColumnDragEnd: () => void;
  onColumnDragOver: (e: React.DragEvent, column: Column) => void;
  onColumnDrop: (targetColumn: Column) => void;
  isColumnDragging?: boolean;
  onTaskReorder: (taskId: string, newOrder: number, columnId: string) => void;
}

export function KanbanColumn({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDraggingOver,
  onColumnDragStart,
  onColumnDragEnd,
  onColumnDragOver,
  onColumnDrop,
  isColumnDragging = false,
  onTaskReorder,
}: KanbanColumnProps) {
  const handleDeleteColumn = () => {
    if (tasks.length > 0) {
      if (confirm(`This column contains ${tasks.length} task(s). Are you sure you want to delete it? All tasks will be lost.`)) {
        onDeleteColumn(column.id);
      }
    } else {
      onDeleteColumn(column.id);
    }
  };

  return (
    <div 
      className={`flex-shrink-0 w-80 transition-all duration-200 ${
        isColumnDragging ? 'opacity-50 scale-95' : ''
      }`}
      onDragOver={(e) => onColumnDragOver(e, column)}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onColumnDrop(column);
      }}
    >
      <Card 
        className={`h-full flex flex-col transition-all duration-200 ${
          isDraggingOver ? 'ring-4 ring-accent scale-[1.02]' : ''
        }`}
      >
        <div 
          className="p-4 border-b flex items-center justify-between"
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            onColumnDragStart(column);
          }}
          onDragEnd={onColumnDragEnd}
          style={{ 
            borderBottomColor: column.color,
            borderBottomWidth: '3px'
          }}
        >
          <div className="flex items-center gap-2 flex-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 cursor-grab active:cursor-grabbing hover:bg-accent/20"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DotsSixVertical size={20} weight="bold" style={{ color: column.color }} />
            </Button>
            <h2 
              className="font-semibold text-lg"
              style={{ color: column.color }}
            >
              {column.name}
            </h2>
            <span className="text-sm text-muted-foreground">
              ({tasks.length})
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEditColumn(column)}
              className="h-8 w-8 p-0 hover:bg-accent/20"
            >
              <Pencil size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDeleteColumn}
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>

        <ScrollArea 
          className="flex-1 p-4"
          onDragOver={onDragOver}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDrop(column.id);
          }}
        >
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>No tasks yet</p>
                <p className="text-xs mt-1">Drop tasks here or click + to add</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onTaskReorder(task.id, index, column.id);
                  }}
                >
                  <TaskCard
                    task={task}
                    onClick={() => onTaskClick(task)}
                    onDragStart={() => onDragStart(task)}
                    onDragEnd={onDragEnd}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t">
          <Button
            onClick={() => onAddTask(column.id)}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Plus size={16} weight="bold" className="mr-2" />
            Add Task
          </Button>
        </div>
      </Card>
    </div>
  );
}

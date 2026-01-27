import { Task, Column } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Pencil, Trash } from '@phosphor-icons/react';
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
    <div className="flex-shrink-0 w-80">
      <Card 
        className={`h-full flex flex-col transition-all duration-200 ${
          isDraggingOver ? 'ring-4 ring-accent scale-[1.02]' : ''
        }`}
        onDragOver={onDragOver}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(column.id);
        }}
      >
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ 
            borderBottomColor: column.color,
            borderBottomWidth: '3px'
          }}
        >
          <div className="flex items-center gap-2 flex-1">
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

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <p>No tasks yet</p>
                <p className="text-xs mt-1">Drop tasks here or click + to add</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick(task)}
                  onDragStart={() => onDragStart(task)}
                  onDragEnd={onDragEnd}
                />
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

import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, CalendarBlank, Flag } from '@phosphor-icons/react';
import { TAG_COLORS, PRIORITY_LEVELS } from '@/lib/constants';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export function TaskCard({ task, onClick, onDragStart, onDragEnd, onContextMenu }: TaskCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTagColor = (tagName: string) => {
    const tagConfig = TAG_COLORS.find(t => t.name === tagName);
    return tagConfig?.color || 'oklch(0.5 0.01 260)';
  };

  const getPriorityConfig = () => {
    return PRIORITY_LEVELS.find(p => p.value === task.priority) || PRIORITY_LEVELS[2];
  };

  const priorityConfig = getPriorityConfig();

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation(); // Evitar que active el drag de la columna
    onDragStart(e);
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        borderLeft: `4px solid ${priorityConfig.borderColor}`,
      }}
      className="p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:cursor-grabbing bg-card"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-[15px] leading-snug line-clamp-2 flex-1">
            {task.title}
          </h3>
          <Badge
            style={{
              backgroundColor: priorityConfig.color,
              color: 'oklch(0.98 0 0)',
            }}
            className="text-xs px-2 py-0.5 font-medium flex items-center gap-1 shrink-0"
          >
            <Flag size={12} weight="fill" />
            {priorityConfig.label}
          </Badge>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag, idx) => (
              <Badge
                key={idx}
                style={{
                  backgroundColor: getTagColor(tag),
                  color: 'oklch(0.98 0 0)',
                }}
                className="text-xs px-2 py-0.5 font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            {task.points > 0 && (
              <div className="flex items-center gap-1">
                <Hash size={14} weight="bold" />
                <span>{task.points}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CalendarBlank size={14} />
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

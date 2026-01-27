import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Hash, CalendarBlank } from '@phosphor-icons/react';
import { TAG_COLORS } from '@/lib/constants';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export function TaskCard({ task, onClick, onDragStart, onDragEnd }: TaskCardProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTagColor = (tagName: string) => {
    const tagConfig = TAG_COLORS.find(t => t.name === tagName);
    return tagConfig?.color || 'oklch(0.5 0.01 260)';
  };

  return (
    <Card
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:cursor-grabbing bg-card"
    >
      <div className="space-y-3">
        <h3 className="font-medium text-[15px] leading-snug line-clamp-2">
          {task.title}
        </h3>

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

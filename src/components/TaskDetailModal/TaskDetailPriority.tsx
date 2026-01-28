import { Priority } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Flag } from '@phosphor-icons/react';
import { PRIORITY_LEVELS } from '@/lib/constants';

interface TaskDetailPriorityProps {
  priority: Priority;
  setPriority: (priority: Priority) => void;
}

export function TaskDetailPriority({ priority, setPriority }: TaskDetailPriorityProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Priority</Label>
      <div className="flex gap-3">
        {PRIORITY_LEVELS.map((priorityLevel) => (
          <button
            key={priorityLevel.value}
            onClick={() => setPriority(priorityLevel.value)}
            style={{
              backgroundColor:
                priority === priorityLevel.value ? priorityLevel.color : 'transparent',
              borderColor: priorityLevel.borderColor,
              color:
                priority === priorityLevel.value ? 'oklch(0.98 0 0)' : priorityLevel.color,
            }}
            className="text-sm px-5 py-2.5 rounded-lg border-2 hover:opacity-80 transition-all flex items-center gap-2 font-medium"
          >
            <Flag
              size={18}
              weight={priority === priorityLevel.value ? 'fill' : 'regular'}
            />
            {priorityLevel.label}
          </button>
        ))}
      </div>
    </div>
  );
}

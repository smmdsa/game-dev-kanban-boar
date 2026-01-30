import { Task } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FIBONACCI_POINTS, getFibonacciPointColor } from '@/lib/constants';

interface TaskDetailBasicInfoProps {
  task: Task;
  description: string;
  setDescription: (description: string) => void;
  points: string;
  setPoints: (points: string) => void;
}

export function TaskDetailBasicInfo({
  task,
  description,
  setDescription,
  points,
  setPoints,
}: TaskDetailBasicInfoProps) {
  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="description" className="text-base font-semibold">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a detailed description of the task..."
          rows={6}
          className="text-base resize-none leading-relaxed"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Story Points</Label>
        <div className="grid grid-cols-6 gap-2">
          {FIBONACCI_POINTS.map((point) => {
            const colors = getFibonacciPointColor(point.value);
            const isSelected = points === point.value.toString();
            return (
              <button
                key={point.value}
                type="button"
                onClick={() => setPoints(point.value.toString())}
                style={{
                  backgroundColor: isSelected ? colors.bg : 'transparent',
                  borderColor: colors.border,
                  color: isSelected ? colors.text : colors.bg,
                }}
                className="h-12 rounded-lg border-2 font-semibold text-sm transition-all hover:scale-105 hover:opacity-80"
              >
                {point.value}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Selecciona los puntos usando la secuencia de Fibonacci
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-base font-semibold">Created</Label>
          <div className="text-base text-muted-foreground h-12 flex items-center px-3 bg-muted rounded-md">
            {new Date(task.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    </>
  );
}

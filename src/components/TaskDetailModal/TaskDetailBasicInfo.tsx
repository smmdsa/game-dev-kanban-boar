import { Task } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="points" className="text-base font-semibold">
            Story Points
          </Label>
          <Input
            id="points"
            type="number"
            min="0"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="0"
            className="text-base h-12"
          />
        </div>

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

import { Task } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TaskDetailHeaderProps {
  task: Task;
  title: string;
  setTitle: (title: string) => void;
}

export function TaskDetailHeader({ title, setTitle }: TaskDetailHeaderProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor="title" className="text-base font-semibold">
        Title *
      </Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        className="text-lg h-12"
      />
    </div>
  );
}

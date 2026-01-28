import { useState } from 'react';
import { Task, Priority } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Trash, Flag } from '@phosphor-icons/react';
import { TAG_COLORS, PRIORITY_LEVELS } from '@/lib/constants';

interface TaskDetailModalProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetailModal({ task, open, onClose, onSave, onDelete }: TaskDetailModalProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [points, setPoints] = useState(task?.points.toString() || '0');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');

  const handleSave = () => {
    if (!task || !title.trim()) return;

    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      points: parseInt(points) || 0,
      tags,
      priority,
    };

    onSave(updatedTask);
    onClose();
  };

  const handleAddTag = (tagName: string) => {
    if (tagName && !tags.includes(tagName)) {
      setTags([...tags, tagName]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setTags(tags.filter(t => t !== tagName));
  };

  const handleDelete = () => {
    if (task && confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const getTagColor = (tagName: string) => {
    const tagConfig = TAG_COLORS.find(t => t.name === tagName);
    return tagConfig?.color || 'oklch(0.5 0.01 260)';
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={6}
              className="text-base resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Story Points</Label>
            <Input
              id="points"
              type="number"
              min="0"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="0"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {PRIORITY_LEVELS.map((priorityLevel) => (
                <button
                  key={priorityLevel.value}
                  onClick={() => setPriority(priorityLevel.value)}
                  style={{
                    backgroundColor: priority === priorityLevel.value ? priorityLevel.color : 'transparent',
                    borderColor: priorityLevel.borderColor,
                    color: priority === priorityLevel.value ? 'oklch(0.98 0 0)' : priorityLevel.color,
                  }}
                  className="text-sm px-4 py-2 rounded-md border-2 hover:opacity-80 transition-all flex items-center gap-2 font-medium"
                >
                  <Flag size={16} weight={priority === priorityLevel.value ? 'fill' : 'regular'} />
                  {priorityLevel.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  style={{
                    backgroundColor: getTagColor(tag),
                    color: 'oklch(0.98 0 0)',
                  }}
                  className="text-sm px-3 py-1 flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70"
                  >
                    <X size={14} weight="bold" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTag);
                  }
                }}
                placeholder="Add custom tag"
                className="text-sm"
              />
              <Button
                onClick={() => handleAddTag(newTag)}
                variant="outline"
                size="sm"
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.filter(tc => !tags.includes(tc.name)).map((tagConfig) => (
                <button
                  key={tagConfig.name}
                  onClick={() => handleAddTag(tagConfig.name)}
                  style={{
                    backgroundColor: tagConfig.color,
                    color: 'oklch(0.98 0 0)',
                  }}
                  className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                >
                  {tagConfig.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Created: {new Date(task.createdAt).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="mr-auto"
          >
            <Trash size={16} className="mr-2" />
            Delete Task
          </Button>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

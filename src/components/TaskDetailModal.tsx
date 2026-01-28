import { useState, useEffect } from 'react';
import { Task, Priority, Comment } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Trash } from '@phosphor-icons/react';
import { TaskDetailHeader } from './TaskDetailModal/TaskDetailHeader';
import { TaskDetailBasicInfo } from './TaskDetailModal/TaskDetailBasicInfo';
import { TaskDetailPriority } from './TaskDetailModal/TaskDetailPriority';
import { TaskDetailTags } from './TaskDetailModal/TaskDetailTags';
import { TaskDetailComments } from './TaskDetailModal/TaskDetailComments';

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
  const [comments, setComments] = useState<Comment[]>(task?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<{ login: string; avatarUrl: string } | null>(null);

  useEffect(() => {
    if (open && task) {
      setTitle(task.title);
      setDescription(task.description);
      setPoints(task.points.toString());
      setTags(task.tags);
      setPriority(task.priority);
      setComments(task.comments || []);
      
      window.spark.user().then(user => {
        if (user) {
          setCurrentUser({ login: user.login, avatarUrl: user.avatarUrl });
        }
      });
    }
  }, [open, task]);

  const handleSave = () => {
    if (!task || !title.trim()) return;

    const updatedTask: Task = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      points: parseInt(points) || 0,
      tags,
      priority,
      comments,
    };

    onSave(updatedTask);
    onClose();
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment.trim(),
      createdAt: Date.now(),
      author: currentUser.login,
      authorAvatar: currentUser.avatarUrl,
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(c => c.id !== commentId));
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

  const formatCommentDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-8 pt-8 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold">Task Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="space-y-8 px-8 py-6">
            <TaskDetailHeader task={task} title={title} setTitle={setTitle} />

            <TaskDetailBasicInfo
              task={task}
              description={description}
              setDescription={setDescription}
              points={points}
              setPoints={setPoints}
            />

            <TaskDetailPriority priority={priority} setPriority={setPriority} />

            <TaskDetailTags
              tags={tags}
              newTag={newTag}
              setNewTag={setNewTag}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              getTagColor={getTagColor}
            />

            <Separator className="my-6" />

            <TaskDetailComments
              comments={comments}
              newComment={newComment}
              setNewComment={setNewComment}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              currentUser={currentUser}
              formatCommentDate={formatCommentDate}
            />
          </div>
        </ScrollArea>

        <Separator className="flex-shrink-0" />

        <DialogFooter className="px-8 py-6 flex justify-between items-center flex-shrink-0">
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="lg"
            className="mr-auto"
          >
            <Trash size={18} className="mr-2" />
            Delete Task
          </Button>
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" size="lg">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()} size="lg">
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

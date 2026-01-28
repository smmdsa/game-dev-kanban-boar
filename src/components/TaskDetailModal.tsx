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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Trash, Flag, ChatCircle, PaperPlaneRight } from '@phosphor-icons/react';
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
      <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-8 pt-8 pb-6">
          <DialogTitle className="text-2xl font-bold">Task Details</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-8">
          <div className="space-y-8 pb-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="text-lg h-12"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description of the task..."
                rows={8}
                className="text-base resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="points" className="text-base font-semibold">Story Points</Label>
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

            <div className="space-y-3">
              <Label className="text-base font-semibold">Priority</Label>
              <div className="flex gap-3">
                {PRIORITY_LEVELS.map((priorityLevel) => (
                  <button
                    key={priorityLevel.value}
                    onClick={() => setPriority(priorityLevel.value)}
                    style={{
                      backgroundColor: priority === priorityLevel.value ? priorityLevel.color : 'transparent',
                      borderColor: priorityLevel.borderColor,
                      color: priority === priorityLevel.value ? 'oklch(0.98 0 0)' : priorityLevel.color,
                    }}
                    className="text-sm px-5 py-2.5 rounded-lg border-2 hover:opacity-80 transition-all flex items-center gap-2 font-medium"
                  >
                    <Flag size={18} weight={priority === priorityLevel.value ? 'fill' : 'regular'} />
                    {priorityLevel.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    style={{
                      backgroundColor: getTagColor(tag),
                      color: 'oklch(0.98 0 0)',
                    }}
                    className="text-sm px-4 py-1.5 flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-70"
                    >
                      <X size={16} weight="bold" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
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
                  className="text-sm h-10"
                />
                <Button
                  onClick={() => handleAddTag(newTag)}
                  variant="outline"
                  size="default"
                  className="px-6"
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {TAG_COLORS.filter(tc => !tags.includes(tc.name)).map((tagConfig) => (
                  <button
                    key={tagConfig.name}
                    onClick={() => handleAddTag(tagConfig.name)}
                    style={{
                      backgroundColor: tagConfig.color,
                      color: 'oklch(0.98 0 0)',
                    }}
                    className="text-xs px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity font-medium"
                  >
                    {tagConfig.name}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ChatCircle size={24} weight="bold" className="text-primary" />
                <Label className="text-lg font-bold">Comments ({comments.length})</Label>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                    <ChatCircle size={48} weight="light" className="mx-auto mb-3 opacity-40" />
                    <p className="text-base">No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                          <AvatarFallback className="text-sm font-semibold">
                            {comment.author.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-base">{comment.author}</span>
                              <span className="text-sm text-muted-foreground">
                                {formatCommentDate(comment.createdAt)}
                              </span>
                            </div>
                            {currentUser && currentUser.login === comment.author && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash size={16} className="text-destructive" />
                              </Button>
                            )}
                          </div>
                          <p className="text-base leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                {currentUser && (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.login} />
                    <AvatarFallback className="text-sm font-semibold">
                      {currentUser.login.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                    placeholder="Write a comment... (Ctrl+Enter to submit)"
                    rows={3}
                    className="text-base resize-none"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="default"
                    className="h-auto"
                  >
                    <PaperPlaneRight size={20} weight="bold" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="px-8 py-6 flex justify-between items-center">
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

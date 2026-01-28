import { Comment } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatCircle, Trash, PaperPlaneRight } from '@phosphor-icons/react';
import { TaskCommentList } from './TaskCommentList';
import { TaskCommentForm } from './TaskCommentForm';

interface TaskDetailCommentsProps {
  comments: Comment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: () => void;
  onDeleteComment: (commentId: string) => void;
  currentUser: { login: string; avatarUrl: string } | null;
  formatCommentDate: (timestamp: number) => string;
}

export function TaskDetailComments({
  comments,
  newComment,
  setNewComment,
  onAddComment,
  onDeleteComment,
  currentUser,
  formatCommentDate,
}: TaskDetailCommentsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ChatCircle size={24} weight="bold" className="text-primary" />
        <Label className="text-lg font-bold">Comments ({comments.length})</Label>
      </div>

      <TaskCommentList
        comments={comments}
        currentUser={currentUser}
        onDeleteComment={onDeleteComment}
        formatCommentDate={formatCommentDate}
      />

      <TaskCommentForm
        currentUser={currentUser}
        newComment={newComment}
        setNewComment={setNewComment}
        onAddComment={onAddComment}
      />
    </div>
  );
}

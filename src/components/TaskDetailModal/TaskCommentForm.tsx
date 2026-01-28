import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PaperPlaneRight } from '@phosphor-icons/react';

interface TaskCommentFormProps {
  currentUser: { login: string; avatarUrl: string } | null;
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: () => void;
}

export function TaskCommentForm({
  currentUser,
  newComment,
  setNewComment,
  onAddComment,
}: TaskCommentFormProps) {
  return (
    <div className="flex gap-3 pt-4">
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
              onAddComment();
            }
          }}
          placeholder="Write a comment... (Ctrl+Enter to submit)"
          rows={3}
          className="text-base resize-none"
        />
        <Button
          onClick={onAddComment}
          disabled={!newComment.trim()}
          size="default"
          className="h-auto"
        >
          <PaperPlaneRight size={20} weight="bold" />
        </Button>
      </div>
    </div>
  );
}

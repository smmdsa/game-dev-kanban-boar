import { Comment } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChatCircle, Trash } from '@phosphor-icons/react';

interface TaskCommentListProps {
  comments: Comment[];
  currentUser: { login: string; avatarUrl: string } | null;
  onDeleteComment: (commentId: string) => void;
  formatCommentDate: (timestamp: number) => string;
}

export function TaskCommentList({
  comments,
  currentUser,
  onDeleteComment,
  formatCommentDate,
}: TaskCommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
        <ChatCircle size={48} weight="light" className="mx-auto mb-3 opacity-40" />
        <p className="text-base">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
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
                  onClick={() => onDeleteComment(comment.id)}
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
  );
}

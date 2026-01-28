import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from '@phosphor-icons/react';
import { TAG_COLORS } from '@/lib/constants';

interface TaskDetailTagsProps {
  tags: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  getTagColor: (tag: string) => string;
}

export function TaskDetailTags({
  tags,
  newTag,
  setNewTag,
  onAddTag,
  onRemoveTag,
  getTagColor,
}: TaskDetailTagsProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Tags</Label>

      {tags.length > 0 && (
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
              <button onClick={() => onRemoveTag(tag)} className="hover:opacity-70">
                <X size={16} weight="bold" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddTag(newTag);
            }
          }}
          placeholder="Add custom tag"
          className="text-sm h-10"
        />
        <Button onClick={() => onAddTag(newTag)} variant="outline" size="default" className="px-6">
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {TAG_COLORS.filter((tc) => !tags.includes(tc.name)).map((tagConfig) => (
          <button
            key={tagConfig.name}
            onClick={() => onAddTag(tagConfig.name)}
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
  );
}

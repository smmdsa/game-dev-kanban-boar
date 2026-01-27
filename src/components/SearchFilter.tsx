import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MagnifyingGlass, Funnel, X } from '@phosphor-icons/react';

interface SearchFilterProps {
  tasks: Task[];
  onFilteredTasksChange: (taskIds: string[]) => void;
}

export function SearchFilter({ tasks, onFilteredTasksChange }: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags))).sort();

  const filterTasks = (query: string, tags: string[]) => {
    if (!query && tags.length === 0) {
      onFilteredTasksChange([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery);

      const matchesTags =
        tags.length === 0 ||
        tags.some((tag) => task.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    onFilteredTasksChange(filtered.map((task) => task.id));
  };

  useEffect(() => {
    filterTasks(searchQuery, selectedTags);
  }, [tasks]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterTasks(query, selectedTags);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    filterTasks(searchQuery, newTags);
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedTags([]);
    onFilteredTasksChange([]);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0;

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="relative flex-1">
        <MagnifyingGlass
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search tasks by title or description..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant={selectedTags.length > 0 ? 'default' : 'outline'} size="icon">
            <Funnel size={20} weight={selectedTags.length > 0 ? 'fill' : 'regular'} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Filter by Tags</h4>
              {allTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags available</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          <X size={16} className="mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}

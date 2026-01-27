import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/lib/types';
import { MagnifyingGlass, X, Funnel } from '@phosphor-icons/react';

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
  }, [searchQuery, selectedTags, tasks]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  const handleClear = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery !== '' || selectedTags.length > 0;

  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="relative flex-1 max-w-md">
        <MagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchQuery('')}
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Funnel size={16} />
            Filter
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5 text-xs">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
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
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
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

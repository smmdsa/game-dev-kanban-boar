import { useState, useEffect } from 'react';
import { Button } from '@/component
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
interface SearchFilterProps {
  onFilteredTasksChange: (taskIds: string[]) => void;


  const [isFilterOpen, setIsF
  const allTags 
  const filterTasks = (query: string, tags: string[])
 

    const lowerQuery = query.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(lowerQuery) ||
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



    <div className="flex items-center gap-2 flex-1">

          className="absolute left-3 top-1
       

          onChange={(e) => handleSearch(e.target.value)}
    

            classNa
            <X size={16} />
        )}

        <PopoverTrigger asChild>
            <Funnel size={
        </PopoverTrigger>
    

                <p className="text-sm text-m
                <div className="flex flex-wrap
                    <Badge
                      variant={

                      {tag}
                  ))}
    

      </Popover>
      {hasActiveFilters
          <X size={16} c
        </Button>
    



































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

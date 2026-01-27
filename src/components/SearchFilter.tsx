import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigg er } from '@/components/ui/popover';
import { Task } from '@/lib/types';
interface SearchFilterProps {
  onFilteredTasksChange: (taskIds: string[]) => void;


  const [isFilterOpen, setIsF
  const allTags 
  onFilteredTasksChange: (taskIds: string[]) => void;
 

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

          size={18}

          type="text"
       

        {searchQuery && (
    

          >
          </Button>
      </div>

          <Button variant="outline" size="s
            Filter
    

          </Button>
        <PopoverContent classNam
            <h4 className="font-semibold mb-3">Filter by Tags</h4>
      
    

                    variant={
                    onC
                    {tag
    

        </PopoverContent>

        <B
    <div className="flex items-center gap-2 flex-1">
      )}
  );







          onChange={(e) => handleSearch(e.target.value)}









            <X size={16} />

        )}



        <PopoverTrigger asChild>









        </PopoverTrigger>



















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

import { useState } from 'react';
import { Column } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PRESET_COLORS } from '@/lib/constants';

interface ColumnModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, color: string) => void;
  column?: Column | null;
}

export function ColumnModal({ open, onClose, onSave, column }: ColumnModalProps) {
  const [name, setName] = useState(column?.name || '');
  const [selectedColor, setSelectedColor] = useState(column?.color || PRESET_COLORS[0].value);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedColor);
    setName('');
    setSelectedColor(PRESET_COLORS[0].value);
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName('');
      setSelectedColor(PRESET_COLORS[0].value);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{column ? 'Edit Column' : 'Create New Column'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name *</Label>
            <Input
              id="column-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., In Progress"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-3">
              {PRESET_COLORS.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setSelectedColor(colorOption.value)}
                  style={{ backgroundColor: colorOption.value }}
                  className={`h-12 rounded-lg transition-all ${
                    selectedColor === colorOption.value
                      ? 'ring-4 ring-ring ring-offset-2 scale-110'
                      : 'hover:scale-105'
                  }`}
                  title={colorOption.name}
                />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg border-2 border-dashed" style={{ borderColor: selectedColor }}>
            <div className="text-sm font-medium" style={{ color: selectedColor }}>
              {name || 'Column Preview'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              This is how your column will look
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => handleOpenChange(false)} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {column ? 'Save Changes' : 'Create Column'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

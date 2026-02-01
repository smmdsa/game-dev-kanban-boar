import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Upload, AlertCircle, CheckCircle, FileJson } from '@phosphor-icons/react';
import { Board, Column, Task } from '@/lib/types';

interface ExportImportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (boardName: string) => void;
  onImport: (board: Board) => void;
  columns: Column[];
  tasks: Task[];
}

interface ImportPreview {
  valid: boolean;
  boardName?: string;
  exportedAt?: string;
  version?: string;
  columnsCount: number;
  tasksCount: number;
  errors: string[];
}

export function ExportImportModal({ open, onClose, onExport, onImport, columns, tasks }: ExportImportModalProps) {
  const [boardName, setBoardName] = useState('My Kanban Board');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importData, setImportData] = useState<Board | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    onExport(boardName);
    onClose();
  };

  const validateBoard = (data: any): ImportPreview => {
    const errors: string[] = [];
    let valid = true;

    // Check basic structure
    if (!data || typeof data !== 'object') {
      errors.push('Invalid JSON format');
      return { valid: false, columnsCount: 0, tasksCount: 0, errors };
    }

    // Check for board property
    if (!data.board || typeof data.board !== 'object') {
      errors.push('Missing "board" property');
      valid = false;
    }

    // Validate columns
    if (!Array.isArray(data.board?.columns)) {
      errors.push('Missing or invalid "columns" array');
      valid = false;
    } else {
      data.board.columns.forEach((col: any, idx: number) => {
        if (!col.id || typeof col.id !== 'string') errors.push(`Column ${idx + 1}: missing or invalid id`);
        if (!col.name || typeof col.name !== 'string') errors.push(`Column ${idx + 1}: missing or invalid name`);
        if (!col.color || typeof col.color !== 'string') errors.push(`Column ${idx + 1}: missing or invalid color`);
        if (typeof col.order !== 'number') errors.push(`Column ${idx + 1}: missing or invalid order`);
      });
    }

    // Validate tasks
    if (!Array.isArray(data.board?.tasks)) {
      errors.push('Missing or invalid "tasks" array');
      valid = false;
    } else {
      const columnIds = new Set(data.board.columns?.map((c: Column) => c.id) || []);
      data.board.tasks.forEach((task: any, idx: number) => {
        if (!task.id || typeof task.id !== 'string') errors.push(`Task ${idx + 1}: missing or invalid id`);
        if (!task.title || typeof task.title !== 'string') errors.push(`Task ${idx + 1}: missing or invalid title`);
        if (!task.columnId || typeof task.columnId !== 'string') {
          errors.push(`Task ${idx + 1}: missing or invalid columnId`);
        } else if (!columnIds.has(task.columnId)) {
          errors.push(`Task ${idx + 1}: references non-existent column ${task.columnId}`);
        }
        if (typeof task.createdAt !== 'number') errors.push(`Task ${idx + 1}: missing or invalid createdAt`);
        if (!Array.isArray(task.tags)) errors.push(`Task ${idx + 1}: missing or invalid tags array`);
      });
    }

    if (errors.length > 10) {
      errors.splice(10);
      errors.push(`... and ${errors.length - 10} more errors`);
    }

    return {
      valid: valid && errors.length === 0,
      boardName: data.boardName,
      exportedAt: data.exportedAt ? new Date(data.exportedAt).toLocaleString() : undefined,
      version: data.version,
      columnsCount: data.board?.columns?.length || 0,
      tasksCount: data.board?.tasks?.length || 0,
      errors,
    };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsProcessing(true);
    setImportPreview(null);
    setImportData(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const preview = validateBoard(data);
      
      setImportPreview(preview);
      if (preview.valid) {
        setImportData(data.board);
      }
    } catch (error) {
      setImportPreview({
        valid: false,
        columnsCount: 0,
        tasksCount: 0,
        errors: ['Failed to parse JSON file: ' + (error instanceof Error ? error.message : 'Unknown error')],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (importData) {
      onImport(importData);
      handleClearImport();
      onClose();
    }
  };

  const handleClearImport = () => {
    setImportFile(null);
    setImportPreview(null);
    setImportData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleClearImport();
    setBoardName('My Kanban Board');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export / Import Board</DialogTitle>
          <DialogDescription>
            Export your board to JSON or import from a backup file
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="boardName">Board Name</Label>
              <Input
                id="boardName"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Enter board name"
              />
            </div>

            <Alert>
              <FileJson className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Export will include:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>{columns.length} column{columns.length !== 1 ? 's' : ''}</li>
                    <li>{tasks.length} task{tasks.length !== 1 ? 's' : ''} (with all comments and tags)</li>
                    <li>All priority levels and colors</li>
                    <li>Timestamp and version metadata</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Board
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="import" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="importFile">Select JSON File</Label>
              <Input
                ref={fileInputRef}
                id="importFile"
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
              />
            </div>

            {isProcessing && (
              <Alert>
                <AlertDescription>Processing file...</AlertDescription>
              </Alert>
            )}

            {importPreview && (
              <div className="space-y-3">
                {importPreview.valid ? (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium text-green-800 dark:text-green-200">Valid board data</p>
                        {importPreview.boardName && (
                          <p className="text-sm">Board: {importPreview.boardName}</p>
                        )}
                        {importPreview.exportedAt && (
                          <p className="text-sm">Exported: {importPreview.exportedAt}</p>
                        )}
                        {importPreview.version && (
                          <p className="text-sm">Version: {importPreview.version}</p>
                        )}
                        <ul className="list-disc list-inside text-sm space-y-1">
                          <li>{importPreview.columnsCount} column{importPreview.columnsCount !== 1 ? 's' : ''}</li>
                          <li>{importPreview.tasksCount} task{importPreview.tasksCount !== 1 ? 's' : ''}</li>
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Invalid board data</p>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {importPreview.errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {importPreview.valid && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium">⚠️ Warning: This will replace all existing data</p>
                      <p className="text-sm mt-1">
                        Your current board ({columns.length} columns, {tasks.length} tasks) will be permanently deleted and replaced with the imported data.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {importFile && (
                <Button variant="outline" onClick={handleClearImport}>
                  Clear
                </Button>
              )}
              <Button
                onClick={handleImport}
                disabled={!importPreview?.valid}
                variant={importPreview?.valid ? 'destructive' : 'default'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Board
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

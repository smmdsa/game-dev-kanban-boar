# Copilot Instructions for Spark Kanban

## Project Overview
This is a GameDev-focused Kanban board built with **GitHub Spark framework** - a React-based framework with persistent key-value storage. The app features drag-and-drop task management, customizable columns, priority tracking, and light/dark theming.

## Core Architecture

### State Management Pattern
- **Primary state hook**: `useKV` from `@github/spark/hooks` - provides persistent state that automatically syncs to browser storage
- **Two main collections**: 
  - `kanban-columns` (Column[]): Board columns with name, color, and order
  - `kanban-tasks` (Task[]): Tasks with title, description, priority, tags, and columnId reference
- **Local UI state**: Managed with React's `useState` for modals, drag states, and filters
- **Always handle null**: `useKV` can return null, so wrap with `|| []` (e.g., `const safeColumns = columns || []`)

### Data Flow
1. User interacts with UI (create/edit/delete task or column)
2. Action handler calls `setColumns()` or `setTasks()` with updater function
3. `useKV` persists change automatically to storage
4. React re-renders with updated data
5. Components receive filtered/sorted data as props

### Component Structure
- **App.tsx**: Central state container, owns all `useKV` hooks and orchestrates data flow
- **KanbanColumn.tsx**: Column container with drag-and-drop zones and task list
- **TaskCard.tsx**: Individual task display with priority borders and tag badges
- **Modals**: CreateTaskModal, TaskDetailModal, ColumnModal for CRUD operations
- **ui/**: shadcn/ui components (Button, Card, Dialog, etc.) - modify by editing component files directly

## Development Commands

```bash
npm run dev          # Start Vite dev server (port 5000 by default)
npm run kill         # Kill process on port 5000 (useful when port stuck)
npm run build        # TypeScript check + production build
npm run lint         # Run ESLint
npm run optimize     # Optimize Vite dependencies
```

## Key Conventions & Patterns

### Drag-and-Drop Implementation
- **Native HTML5 API**: Uses `draggable`, `onDragStart`, `onDragEnd`, `onDragOver`, `onDrop`
- **State tracking**: Separate state for task dragging (`draggingTask`, `dragOverColumnId`) and column dragging (`draggingColumn`, `dragOverColumn`)
- **Visual feedback**: Apply classes like `opacity-50`, `ring-4 ring-accent` during drag operations
- **Event handling**: Always call `e.preventDefault()` in `onDragOver` and check drag source in `onDrop`

### Color System
- **OKLCH color space**: All colors use `oklch()` format (e.g., `oklch(0.45 0.15 285)`)
- **Preset colors**: Defined in `src/lib/constants.ts` - use these for consistency
- **Priority colors**: Each priority level has color + borderColor (see `PRIORITY_LEVELS`)
- **Dynamic styling**: Use inline `style` prop for user-selected colors (column colors, priority borders)
- **Theme variables**: Defined in `src/styles/theme.css` using Radix UI color scales

### Theming
- **Hook**: `useTheme()` from `src/hooks/use-theme.ts` provides `theme`, `setTheme`, `toggleTheme`
- **Storage key**: `app-theme` in `useKV`
- **Implementation**: Adds/removes `light` or `dark` class on `document.documentElement`
- **CSS variables**: Theme-aware CSS variables in `theme.css` respond to root class

### Component Patterns
- **Path alias**: Use `@/` for imports (maps to `src/` directory)
- **Icon library**: `@phosphor-icons/react` - import directly but via proxy plugin for optimization
- **Toast notifications**: Use `toast.success()` / `toast.error()` from `sonner` for user feedback
- **Form validation**: Prevent empty titles/names in modals before submission
- **Safe array access**: Always check for null/undefined from `useKV` before mapping

### Type Safety
- **Core types**: See `src/lib/types.ts` for Task, Column, Priority, Board interfaces
- **Priority type**: Union type `'critical' | 'high' | 'medium' | 'low'` - use PRIORITY_LEVELS constants
- **Timestamp format**: Use `Date.now()` for createdAt (number type)
- **ID generation**: Simple timestamp-based IDs: `task-${Date.now()}`, `col-${Date.now()}`

## Spark Framework Specifics

### Required Setup
- **Import Spark**: Must import `@github/spark/spark` in `main.tsx` (already done)
- **Vite plugins**: 
  - `createIconImportProxy()` - optimizes Phosphor icon imports
  - `sparkPlugin()` - enables Spark features
  - Both required in `vite.config.ts`

### Data Persistence
- **useKV hook**: Only hook that provides persistence - standard useState does NOT persist
- **Updater functions**: Always use function form `setTasks((current) => ...)` to avoid stale state
- **Storage location**: Browser-based (localStorage-like), survives page refreshes but not cross-device

### Debugging
- **Dev server**: Runs on port 5000 (not standard 5173)
- **Port conflicts**: Use `npm run kill` before `npm run dev` if port stuck
- **Type checking**: Build process includes TypeScript checks - fix type errors before building

## Common Tasks

### Adding a New Task Property
1. Update `Task` interface in `src/lib/types.ts`
2. Update form in `CreateTaskModal.tsx` and `TaskDetailModal.tsx`
3. Update `TaskCard.tsx` to display new property
4. Add to task creation in `App.tsx` `handleCreateTask`

### Adding a New Column Color
1. Add color object to `PRESET_COLORS` in `src/lib/constants.ts`
2. Color will automatically appear in ColumnModal color picker

### Modifying UI Components
- **shadcn/ui components**: Located in `src/components/ui/`
- **Edit directly**: No CLI regeneration needed - just edit component files
- **Styling**: Uses Tailwind classes + `cn()` utility for conditional classes

## Critical Implementation Notes

- **Never use localStorage directly**: Always use `useKV` for persistent state
- **Column deletion**: Confirm with user if column has tasks (see `handleDeleteColumn` in KanbanColumn.tsx)
- **Drag event propagation**: Stop propagation in nested drag handlers (columns dragging within task drop zones)
- **Priority borders**: Applied via inline style on TaskCard - left border with `borderColor` property
- **Filter implementation**: Filters by title, description, and tags in real-time (see `handleFilter` in App.tsx)
- **Toast placement**: `<Toaster />` must be in App.tsx root for toast notifications to work

## File Organization
```
src/
├── App.tsx                    # Main state container
├── components/
│   ├── KanbanColumn.tsx       # Column with drag-drop
│   ├── TaskCard.tsx           # Task display card
│   ├── *Modal.tsx             # CRUD modals
│   └── ui/                    # shadcn/ui components
├── hooks/
│   ├── use-theme.ts           # Theme management
│   └── use-mobile.ts          # Mobile detection
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── constants.ts           # Colors, priorities, tags
│   └── utils.ts               # cn() utility
└── styles/
    └── theme.css              # Theme variables
```

## TypeScript Best Practices

### Type Definitions
- **Prefer `interface` for object shapes**: Use `interface` for component props and data models (e.g., `Task`, `Column`, `KanbanColumnProps`)
- **Use `type` for unions and primitives**: Union types like `Priority = 'critical' | 'high' | 'medium' | 'low'` and `Theme = 'light' | 'dark'`
- **Always export types**: All types in `src/lib/types.ts` are exported for reuse across components
- **No `any` type**: Avoid `any` - use `unknown` with type guards if necessary, or specific types

### Type Safety Patterns
```typescript
// ✅ Safe null handling with useKV
const safeColumns = columns || [];
const safeTasks = tasks || [];

// ✅ Type-safe updater functions
setTasks((currentTasks) => {
  const tasks = currentTasks || [];
  return [...tasks, newTask];
});

// ✅ Union type with constants for validation
export const PRIORITY_LEVELS = [
  { value: 'critical' as const, label: 'Critical', ... },
  // ...
];

// ✅ Optional chaining for safe property access
const tagConfig = TAG_COLORS.find(t => t.name === tagName);
return tagConfig?.color || 'oklch(0.5 0.01 260)';
```

### Strict TypeScript Configuration
Current `tsconfig.json` has:
- **strictNullChecks**: `true` - always handle null/undefined explicitly
- **noFallthroughCasesInSwitch**: `true` - all switch cases must return or break
- **noUncheckedSideEffectImports**: `true` - validates side-effect imports
- DO NOT disable strict checks - they catch bugs early

### Component Prop Patterns
```typescript
// ✅ Explicit interface for props
interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

// ✅ Destructure with types
export function TaskCard({ task, onClick, onDragStart, onDragEnd }: TaskCardProps) {
  // implementation
}

// ❌ Avoid inline types
// export function TaskCard({ task, onClick }: { task: Task, onClick: () => void }) {}
```

### Type Inference and Annotations
- **Let TypeScript infer return types** for simple functions
- **Annotate complex return types** explicitly for clarity
- **Use `const` assertions** for literal types: `value: 'critical' as const`
- **Avoid redundant type annotations**: `const count: number = 0` → `const count = 0`

### Handling React Events
```typescript
// ✅ Use React.DragEvent with preventDefault
const handleDragOver = (e: React.DragEvent, columnId: string) => {
  e.preventDefault();
  setDragOverColumnId(columnId);
};

// ✅ Type event handlers in props
interface Props {
  onDragStart: (e: React.DragEvent) => void;
  onClick: () => void;
}
```

### Utility Types Usage
- **Partial<T>**: When making all properties optional
- **Pick<T, K>**: Extract subset of properties
- **Omit<T, K>**: Remove specific properties
- **Record<K, V>**: Type-safe key-value objects
- **NonNullable<T>**: Remove null/undefined from type

### Common Pitfalls to Avoid
- ❌ Don't use `Object`, `String`, `Number`, `Boolean` - use lowercase primitives
- ❌ Don't disable type checking with `@ts-ignore` - fix the underlying issue
- ❌ Don't cast with `<Type>value` - use `value as Type` for consistency
- ❌ Don't use `Function` type - specify exact signature: `(param: string) => void`
- ❌ Don't mutate state directly - always use setter functions with new objects/arrays

## SOLID Design Principles

### S - Single Responsibility Principle
Each component/function should have ONE reason to change.

**Current implementation:**
- `TaskCard.tsx`: Only displays task (doesn't handle drag logic directly)
- `App.tsx`: State container (doesn't render drag zones)
- `KanbanColumn.tsx`: Column rendering with drag zone logic (separated concerns)

**Anti-pattern to avoid:**
```typescript
// ❌ BAD: TaskCard does too much
export function TaskCard({ task }) {
  const handleDelete = () => { /* API call + UI update + analytics */ };
  const handleDrag = () => { /* complex drag logic + persistence */ };
  const renderUI = () => { /* 200 lines of JSX */ };
  return renderUI();
}

// ✅ GOOD: TaskCard only renders, handlers come from props
export function TaskCard({ task, onClick, onDragStart, onDragEnd }) {
  return <Card>{/* focused UI only */}</Card>;
}
```

### O - Open/Closed Principle
Open for extension, closed for modification. Add features without changing existing code.

**Current implementation:**
- Color system: Add new colors to `PRESET_COLORS` in `constants.ts` - no component changes needed
- Priority levels: Add to `PRIORITY_LEVELS` array - existing code automatically picks it up
- Tags: Add to `TAG_COLORS` - no logic changes required

**Pattern example:**
```typescript
// ✅ GOOD: Adding new priority doesn't change TaskCard
export const PRIORITY_LEVELS = [
  { value: 'critical' as const, label: 'Critical', color: '...', borderColor: '...' },
  { value: 'high' as const, label: 'High', color: '...', borderColor: '...' },
  // Add new priority here - TaskCard uses it automatically
];

// TaskCard just looks up the config
const priorityConfig = PRIORITY_LEVELS.find(p => p.value === task.priority);
```

### L - Liskov Substitution Principle
Subtypes must be substitutable for base types. Maintain interface contracts.

**Current implementation:**
- All modal components follow same contract: accept data, emit changes via callbacks
- Column operations (create, edit, delete) have consistent handler signatures
- Task handlers are interchangeable

**Pattern:**
```typescript
// ✅ Modal components follow consistent interface
interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: T) => void;
}

// Both work interchangeably
<CreateTaskModal {...props} />
<TaskDetailModal {...props} />
```

### I - Interface Segregation Principle
Don't force components to depend on interfaces they don't use. Keep props minimal.

**Current implementation:**
- `TaskCard` doesn't need column operations → doesn't receive column handlers
- `KanbanColumn` doesn't need task detail modal logic → passed as callback only
- Modals only receive props they actually use

**Anti-pattern to avoid:**
```typescript
// ❌ BAD: Passing everything
interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDrag: (task: Task) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onColumnEdit: (column: Column) => void;
  onColumnDelete: (columnId: string) => void;
  onThemeToggle: () => void;
  onFilterChange: (filter: string) => void;
  // ... 10 more props that component doesn't use
}

// ✅ GOOD: Only required props
interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: string) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (columnId: string) => void;
}
```

### D - Dependency Inversion Principle
Depend on abstractions, not concretions. Inject dependencies as props or hooks.

**Current implementation:**
- `useKV` is injected, not hard-coded localStorage calls
- Color configs are passed as props, not imported globally in components
- Theme via `useTheme()` hook - abstraction over implementation

**Pattern example:**
```typescript
// ✅ GOOD: Depends on abstraction (hook)
export function TaskCard({ task, onClick, onDragStart, onDragEnd }: TaskCardProps) {
  const getTagColor = (tagName: string) => {
    // Uses injected constant, not direct import dependency
    const tagConfig = TAG_COLORS.find(t => t.name === tagName);
    return tagConfig?.color || 'oklch(0.5 0.01 260)';
  };
}

// ✅ GOOD: Dependencies injected
const [columns, setColumns] = useKV<Column[]>('kanban-columns', []);
// Not: const columns = getFromLocalStorage('columns');
```

### Applying SOLID When Making Changes

**Before adding a feature, ask:**
1. **S**: Does this component do one thing? If modifying App.tsx, is logic leaking from specific components?
2. **O**: Can I add this feature by extending existing code (new color, new priority) rather than modifying?
3. **L**: Do my components maintain their contracts? Can they be replaced without breaking consumers?
4. **I**: Am I passing props a component doesn't need? Should I split the interface?
5. **D**: Am I hard-coding dependencies? Should I inject them as props or use hooks?

## Testing & Validation
- Manually test drag-and-drop in both directions (tasks between columns, column reordering)
- Verify data persists after page refresh
- Test both light and dark themes
- Validate forms don't allow empty required fields
- Check priority colors render correctly in both themes
- Run `tsc -b` to verify no type errors before committing

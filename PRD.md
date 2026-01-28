# Planning Guide

A GameDev-focused Kanban board for organizing and tracking game development tasks with drag-and-drop functionality, persistent data storage, and modal interactions.

**Experience Qualities**: 
1. **Tactile** - Drag-and-drop interactions feel smooth and responsive, giving users direct control over their workflow
2. **Focused** - Clean, minimal interface that prioritizes task content over chrome, reducing visual noise
3. **Customizable** - Theme switching and color-coded columns let teams adapt the tool to their preferences

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused task management tool with several interconnected features (columns, tasks, search, themes) but maintains simplicity through a single-view interface and straightforward data model.

## Essential Features

**Theme Switching**
- Functionality: Toggle between light and dark themes with persistent preference
- Purpose: Allow users to work comfortably in different lighting conditions and match personal preferences
- Trigger: Theme toggle button in header (sun/moon icon)
- Progression: Click toggle → Theme switches instantly → Preference saved → Persists across sessions
- Success criteria: Smooth transition between themes, all UI elements properly styled in both modes, preference persists

**Column Management**
- Functionality: Create, edit, delete, and reorder workflow columns with custom names and colors
- Purpose: Define and organize the stages of your game development pipeline (e.g., Backlog, In Progress, Review, Done)
- Trigger: "Add Column" button in header (create), drag handle icon on column (reorder)
- Progression: Click add → Enter name and select color → Confirm → Column appears on board | Drag column by handle → Drop at new position → Column order updates
- Success criteria: New columns persist after refresh, can be reordered via drag-and-drop, and tasks can be moved into them

**Task Card Creation**
- Functionality: Create task cards with title, description, story points, tags, and priority level
- Purpose: Capture all relevant information about a game development task (feature, bug, art asset, etc.) with visual priority indicators
- Trigger: "+" button within any column
- Progression: Click + → Enter title (required) → Select priority level (Critical/High/Medium/Low) → Optionally add description, points, tags → Save → Card appears in column with color-coded priority
- Success criteria: Cards display title prominently, show priority badge and colored border, display metadata compactly, and persist across sessions

**Drag-and-Drop Task Movement**
- Functionality: Drag task cards between columns to update their status
- Purpose: Visual, tactile way to move tasks through the development pipeline
- Trigger: Mouse down on a task card
- Progression: Grab card → Drag over target column (shows visual feedback) → Release → Card moves to new column
- Success criteria: Smooth animation, clear drop zones, immediate visual feedback, state persists

**Drag-and-Drop Column Reordering**
- Functionality: Drag entire columns to reorder workflow stages
- Purpose: Allow users to customize column order to match their specific workflow
- Trigger: Mouse down on column drag handle (six dots icon)
- Progression: Grab handle → Drag column left or right → Visual feedback shows new position → Release → Column order updates and persists
- Success criteria: Smooth reordering, visual indication of dragging column, all tasks remain with column during move, order persists

**Task Detail View**
- Functionality: Full-screen modal for viewing and editing task details including priority
- Purpose: Provide space to read and edit all task information without cluttering the board
- Trigger: Click on any task card
- Progression: Click card → Modal opens → Edit any field including priority → Save or delete → Modal closes → Board updates with new priority color coding
- Success criteria: All fields editable, priority changes reflected in card appearance, changes persist, smooth open/close animation

**Search and Filter**
- Functionality: Filter tasks by title, description, or tags
- Purpose: Quickly find specific tasks in large boards
- Trigger: Type in search bar in header
- Progression: Type query → Tasks filter in real-time → Counter shows results → Clear to reset
- Success criteria: Fast filtering, clear visual feedback, preserves task locations within columns

## Edge Case Handling

- **Empty States**: Welcoming first-time experience with clear call-to-action when no columns exist
- **Invalid Input**: Form validation prevents empty task titles and column names
- **Theme Initialization**: Defaults to light theme on first load, reads saved preference on subsequent visits
- **Filter No Results**: Shows task count of 0 when no tasks match search query
- **Orphaned Tasks**: Tasks in deleted columns are automatically removed to maintain data integrity

## Design Direction

The design should feel modern, game-industry appropriate, and productive. It balances playfulness (through color and smooth interactions) with professionalism. Both light and dark themes should feel equally polished, with the dark theme optimized for long coding/design sessions.

## Color Selection

**Light Theme:**
- **Primary Color**: Purple (`oklch(0.45 0.15 285)`) - Conveys creativity and focus, used for headlines and primary actions
- **Secondary Color**: Dark Slate (`oklch(0.25 0.02 260)`) - Professional dark text for buttons and secondary UI
- **Accent Color**: Cyan (`oklch(0.75 0.15 195)`) - Energetic highlight for focus states and active elements
- **Background**: Off-white (`oklch(0.98 0 0)`) - Soft, easy on eyes for extended use
- **Card**: Pure white (`oklch(1 0 0)`) - Clean canvas for content

**Dark Theme:**
- **Primary Color**: Bright Purple (`oklch(0.55 0.18 285)`) - Vibrant but comfortable for dark backgrounds
- **Secondary Color**: Medium Slate (`oklch(0.3 0.02 260)`) - Elevated surfaces
- **Accent Color**: Bright Cyan (`oklch(0.65 0.18 195)`) - Pops against dark background
- **Background**: Deep Slate (`oklch(0.15 0.01 260)`) - Rich, dark foundation
- **Card**: Elevated Slate (`oklch(0.2 0.015 260)`) - Subtle elevation from background

**Foreground/Background Pairings:**
- Light Primary Text on Light BG: `oklch(0.2 0.02 260)` on `oklch(0.98 0 0)` - Ratio 14.5:1 ✓
- Dark Primary Text on Dark BG: `oklch(0.95 0.005 260)` on `oklch(0.15 0.01 260)` - Ratio 13.2:1 ✓
- Accent on Dark: `oklch(0.98 0 0)` on `oklch(0.65 0.18 195)` - Ratio 7.8:1 ✓

## Font Selection

Space Grotesk conveys a technical, game-dev aesthetic with its distinctive geometric forms while remaining highly legible.

**Typographic Hierarchy:**
- H1 (App Title): Space Grotesk Bold/30px/tight letter spacing
- H2 (Column Headers): Space Grotesk Semibold/16px/normal spacing
- H3 (Card Titles): Space Grotesk Medium/14px/normal spacing
- Body (Card Description): Space Grotesk Regular/14px/relaxed line height
- Small (Metadata): Space Grotesk Regular/12px/subtle color

## Animations

Animations enhance the tactile feel of direct manipulation. Drag operations feel physical with slight scale and shadow changes. Theme transitions are instant for immediate feedback. Modal entries use subtle scale and fade for polish without delay.

## Component Selection

- **Components**: 
  - `Dialog` for task detail and create modals with backdrop blur
  - `Button` with primary, secondary, outline, and ghost variants
  - `Input` and `Textarea` for form fields with focus states
  - `Badge` for task tags and story point display
  - `Card` for task cards with hover effects
  - `ScrollArea` for column content when tasks overflow
  - Theme toggle using custom component with sun/moon icons
  
- **Customizations**: 
  - Custom color picker component for column colors (grid of predefined vibrant colors)
  - Theme toggle with animated icon transitions
  - Drag-and-drop with visual feedback states
  
- **States**: 
  - Buttons: Subtle background shift on hover, scale down slightly on press
  - Inputs: Accent color bottom border on focus, smooth transitions
  - Theme Toggle: Rotating icon animation on theme switch
  
- **Icon Selection**: 
  - `Plus` for add actions
  - `Sun` for light theme indicator
  - `Moon` for dark theme indicator
  - `MagnifyingGlass` for search
  - `Trash` for delete actions
  - `Pencil` for edit actions
  - `DotsSixVertical` for column drag handles
  - `Flag` for priority indicators
  
- **Spacing**: 
  - Page padding: `p-6`
  - Column gap: `gap-4`
  - Card gap within columns: `gap-3`
  - Header items: `gap-3`
  
- **Mobile**: 
  - Single column scroll on mobile (<768px) with horizontal swipe through columns
  - Full-screen modals on mobile instead of centered dialogs
  - Collapsible column headers on mobile
  - Theme toggle remains accessible in header

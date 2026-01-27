# Planning Guide

A Kanban board application designed specifically for video game development teams to track, organize, and manage game development tasks across customizable workflow stages.

**Experience Qualities**: 
1. **Fluid** - Drag-and-drop interactions should feel smooth and responsive, making task management feel effortless
2. **Focused** - Clear visual hierarchy that helps developers concentrate on what matters without distraction
3. **Playful** - Subtle gaming-inspired aesthetics that resonate with the game development context while remaining professional

**Complexity Level**: Light Application (multiple features with basic state)
This is a task management tool with drag-and-drop functionality, persistent data storage, and modal interactions. It has multiple coordinated features but maintains a focused, single-view interface without complex routing or advanced state management patterns.

## Essential Features

**Column Management**
- Functionality: Users can view, create, edit, and delete workflow columns with custom names and colors
- Purpose: Different game projects have different workflows; customization ensures the tool adapts to each team's process
- Trigger: "Add Column" button in the board header, or edit/delete icons on column headers
- Progression: Click add → Enter name and select color → Confirm → Column appears on board
- Success criteria: New columns persist after refresh, can be reordered, and tasks can be moved into them

**Task Card Creation**
- Functionality: Create task cards with title, description, story points, and tags
- Purpose: Capture all relevant information about a game development task (feature, bug, art asset, etc.)
- Trigger: "+" button within any column
- Progression: Click + → Enter title (required) → Optionally add description, points, tags → Save → Card appears in column
- Success criteria: Cards display title prominently, show metadata compactly, and persist across sessions

**Drag-and-Drop Task Movement**
- Functionality: Drag task cards between columns to update their status
- Purpose: Visual, tactile way to move tasks through the development pipeline
- Trigger: Mouse down on a task card
- Progression: Grab card → Drag over target column (shows visual feedback) → Release → Card moves to new column
- Success criteria: Smooth animation, clear drop zones, immediate visual feedback, state persists

**Task Detail View**
- Functionality: Click a task card to open a modal showing full details and allowing edits
- Purpose: Keep the board view clean while providing access to complete task information when needed
- Trigger: Click anywhere on a task card
- Progression: Click card → Modal opens with all fields → Edit any field → Save or Cancel → Modal closes → Changes persist
- Success criteria: All task data is editable, changes save correctly, modal has smooth enter/exit animations

**Task Tags**
- Functionality: Add color-coded tags to categorize tasks (e.g., "Art", "Programming", "Sound", "Bug", "Feature")
- Purpose: Quick visual categorization across the workflow to identify task types at a glance
- Trigger: Tag selector in task detail modal
- Progression: Open task → Click tag field → Select from existing or create new → Tag appears on card
- Success criteria: Tags are visible on cards, color-coded, and can be filtered or searched

## Edge Case Handling

- **Empty Columns**: Show a subtle placeholder message like "Drop tasks here" with an add button
- **Drag Cancellation**: ESC key or dragging outside the board cancels the drag operation and returns card to origin
- **No Columns**: If user deletes all columns, show a helpful empty state with "Create your first column" prompt
- **Long Task Titles**: Truncate with ellipsis after 2 lines on cards, full text visible in detail modal
- **No Tags**: Tags are optional; cards without tags display normally
- **Deletion Confirmations**: Show confirmation dialog before deleting columns or tasks to prevent accidents

## Design Direction

The design should feel modern and tech-forward, evoking the creative energy of game development while maintaining clarity and usability. Think pixel-perfect precision meets subtle playfulness - crisp edges, confident colors, and smooth micro-interactions that feel polished like a well-optimized game engine.

## Color Selection

A vibrant, energetic palette inspired by game development tools and game UI design, with strong contrast and clear visual hierarchy.

- **Primary Color**: Deep purple (`oklch(0.45 0.15 285)`) - Represents creativity and the digital realm of game development
- **Secondary Colors**: Dark slate (`oklch(0.25 0.02 260)`) for column backgrounds and structural elements
- **Accent Color**: Electric cyan (`oklch(0.75 0.15 195)`) - High energy color for CTAs, active states, and important actions
- **Foreground/Background Pairings**: 
  - Background White (`oklch(0.98 0 0)`): Dark text (`oklch(0.2 0.02 260)`) - Ratio 13.2:1 ✓
  - Primary Purple (`oklch(0.45 0.15 285)`): White text (`oklch(0.98 0 0)`) - Ratio 7.1:1 ✓
  - Secondary Slate (`oklch(0.25 0.02 260)`): White text (`oklch(0.98 0 0)`) - Ratio 12.8:1 ✓
  - Accent Cyan (`oklch(0.75 0.15 195)`): Dark text (`oklch(0.2 0.02 260)`) - Ratio 8.9:1 ✓

## Font Selection

Typography should feel technical yet approachable - the clarity of a developer tool with the friendliness of a creative application.

- **Primary Font**: Space Grotesk - A modern geometric sans with tech aesthetic that feels both sharp and welcoming

- **Typographic Hierarchy**: 
  - H1 (Board Title): Space Grotesk Bold/32px/tight letter spacing
  - H2 (Column Headers): Space Grotesk SemiBold/18px/normal spacing
  - H3 (Card Titles): Space Grotesk Medium/15px/normal spacing
  - Body (Descriptions): Space Grotesk Regular/14px/relaxed line-height (1.6)
  - Small (Metadata): Space Grotesk Regular/12px/subtle color

## Animations

Animations should enhance the feeling of direct manipulation and provide clear feedback without slowing down power users. Use physics-based easing for drag operations to make movement feel natural and weighted. Micro-interactions on hover/click should be snappy (100-150ms) while modal transitions can be slightly more expressive (250ms) to establish spatial context. Card additions should have a subtle scale-in effect, and successful actions (saves, moves) trigger brief highlights or color pulses.

## Component Selection

- **Components**: 
  - `Card` for task cards and column containers
  - `Dialog` for task detail modal and column creation modal
  - `Button` for all actions (add task, add column, save, delete)
  - `Input` and `Textarea` for text fields in modals
  - `Badge` for tags and story points display
  - `Popover` for quick color picker when creating/editing columns
  - `AlertDialog` for delete confirmations
  - `ScrollArea` for column content when tasks overflow

- **Customizations**: 
  - Custom drag-and-drop system using native HTML5 drag events with visual feedback states
  - Custom color picker component for column colors (grid of predefined vibrant colors)
  - Animated card component with hover lift effect and drag preview

- **States**: 
  - Buttons: Subtle background shift on hover, scale down slightly on active, cyan accent for primary actions
  - Cards: Lift with shadow on hover, rotate slightly while dragging, highlight drop zone
  - Inputs: Accent color bottom border on focus, smooth transitions
  - Columns: Subtle background pulse when accepting a drag

- **Icon Selection**: 
  - `Plus` for add actions
  - `Pencil` for edit actions  
  - `Trash` for delete actions
  - `X` for close/cancel
  - `DotsSixVertical` for drag handles
  - `Tag` for tag indicators
  - `CalendarBlank` for creation dates
  - `Hash` for story points

- **Spacing**: 
  - Board padding: `p-6`
  - Column gap: `gap-4`
  - Card gap within columns: `gap-3`
  - Internal card padding: `p-4`
  - Modal padding: `p-6`
  - Button padding: `px-4 py-2`

- **Mobile**: 
  - Single column scroll on mobile (<768px) with horizontal swipe through columns
  - Tap-and-hold to initiate drag on touch devices
  - Full-screen modals on mobile instead of centered dialogs
  - Larger touch targets (minimum 48px) for buttons and draggable elements
  - Collapsible column headers on mobile to save vertical space

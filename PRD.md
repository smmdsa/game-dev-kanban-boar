# Planning Guide

**Experience Qualities**: 

**Experience Qualities**: 
This is a task management tool with drag-and-drop functionality, persistent data storage, and modal interactions. I
## Essential Features
**Column Management**

- Progression: Click add → Enter name and select color → Confirm → Column ap


## Essential Features

**Column Management**
- Purpose: Visual, tactile way to move tasks through the development pipeline
- Progression: Grab card → Drag over target column (shows visual feedback) → Release → Card moves to new column

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
  - Secondary Slate (`oklch(0.25 0.02 260)`): White text (`oklch(0.98 0 0)`) - Ratio 12.8:





  - H3 (Card 
  - Small (Metadata): Space Grotesk Regular/12px/subtle color
## Animations
Animations should enhance the feeling of dir
## Component Selection
- **Components**: 

  - `Input` and `Text

  - `ScrollArea` for column content when tasks overflow
- **Customizations**: 
  - Custom color picker component for column colors (grid of predefined vibrant colors)

  - Buttons: Subtle background shift on hover, scale down slightly on
  - Inputs: Accent color bottom border on focus, smooth transitions

  - `Plus` for add 

  - `DotsSixVertical` for drag handles



  - Card gap within columns: `gap-3`


  - Single column scroll on mobile (<768px) with horizontal swipe through columns
  - Full-screen modals on mobile instead of centered dialogs
  - Collapsible column headers on mobi
















  - Small (Metadata): Space Grotesk Regular/12px/subtle color

## Animations



## Component Selection

- **Components**: 







  - `ScrollArea` for column content when tasks overflow

- **Customizations**: 

  - Custom color picker component for column colors (grid of predefined vibrant colors)





  - Inputs: Accent color bottom border on focus, smooth transitions







  - `DotsSixVertical` for drag handles







  - Card gap within columns: `gap-3`





  - Single column scroll on mobile (<768px) with horizontal swipe through columns

  - Full-screen modals on mobile instead of centered dialogs



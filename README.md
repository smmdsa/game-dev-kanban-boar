# 🎮 GameDev Kanban Board

A powerful Kanban board built with **GitHub Spark** framework, designed specifically for game development teams. Features drag-and-drop task management, priority tracking, customizable columns, and flexible data persistence.

## ✨ Features

- 🎯 **Drag & Drop**: Intuitive task and column reordering
- 🎨 **Customizable Columns**: Create unlimited columns with custom colors
- 🔥 **Priority System**: Critical, High, Medium, Low task priorities
- 🏷️ **Tag Management**: Organize tasks with visual tags
- 💬 **Comments**: Collaborate with inline task comments
- 🌓 **Dark/Light Theme**: Built-in theme switching
- 🔍 **Search & Filter**: Find tasks instantly
- 💾 **Dual Storage**: Switch between local (Spark) and cloud (Supabase)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/smmdsa/game-dev-kanban-boar.git
cd game-dev-kanban-boar

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

## 🗄️ Data Persistence

This app supports **two data providers**:

### 1. Spark Provider (Default - Local Storage)
✅ **No configuration required** - works out of the box  
✅ Perfect for demos and local development  
❌ Data doesn't sync across devices

### 2. Supabase Provider (Cloud Database)
✅ PostgreSQL database with real-time capabilities  
✅ Sync across devices  
✅ Production-ready scaling  
⚙️ Requires configuration (see below)

## 🔐 Supabase Configuration

### Step 1: Set Up Supabase

1. Create account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to `Settings > API` and copy:
   - **Project URL**
   - **anon/public key**

### Step 2: Configure Environment Variables

```bash
# Copy example file
cp .env.example .env

# Edit .env with your credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key-here
```

### Step 3: Execute Database Schema

1. Open your Supabase dashboard
2. Go to `SQL Editor`
3. Copy contents of `supabase/schema.sql`
4. Execute the script

### Step 4: Enable Supabase Provider

Edit `src/main.tsx`:

```tsx
import { createSupabaseProvider } from '@/data';

const supabaseProvider = createSupabaseProvider();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <DataProviderWrapper customProvider={supabaseProvider}>
      <App />
    </DataProviderWrapper>
  </ErrorBoundary>
);
```

**📚 Full documentation:** See [SECRETS_SETUP.md](SECRETS_SETUP.md)

## 🏗️ Architecture

This project uses a **clean architecture** with **Repository Pattern**:

```
src/
├── data/                    # Data layer (abstracted)
│   ├── interfaces/          # Contracts (Repository interfaces)
│   ├── providers/           # Implementations (Spark, Supabase)
│   ├── context/             # React Context + hooks
│   └── README.md           # API documentation
├── components/              # UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & types
└── styles/                  # Theme & global styles
```

### Key Benefits
- ✅ Switch providers without changing UI code
- ✅ Easy to test with mock providers
- ✅ SOLID principles applied
- ✅ Type-safe with TypeScript

**📚 Architecture guide:** See [src/data/README.md](src/data/README.md)

## 🎯 Development

### Commands

```bash
npm run dev          # Start dev server (port 5000)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run optimize     # Optimize Vite dependencies
npm run kill         # Kill process on port 5000
```

### Using the Data Layer

```tsx
import { useTasks, useColumns, useAppTheme } from '@/data';

function MyComponent() {
  const { tasks, createTask, updateTask, deleteTask } = useTasks();
  const { columns } = useColumns();
  const { theme, toggleTheme } = useAppTheme();

  const handleCreate = async () => {
    const result = await createTask({
      id: `task-${Date.now()}`,
      title: 'New Task',
      columnId: 'col-1',
      // ...
    });
    
    if (result.error) {
      console.error('Error:', result.error);
    }
  };

  return <div>{/* ... */}</div>;
}
```

**📚 Examples:** See [src/data/MIGRATION_EXAMPLES.tsx](src/data/MIGRATION_EXAMPLES.tsx)

## 📦 Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4 + OKLCH colors
- **Icons**: Phosphor Icons
- **Data**: GitHub Spark (useKV) + Supabase
- **Notifications**: Sonner

## 🧹 Just Exploring?
No problem! If you were just checking things out and don't need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

## 📝 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

This project is open source and available under the MIT License.

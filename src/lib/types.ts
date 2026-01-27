export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  points: number;
  tags: string[];
  columnId: string;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Board {
  columns: Column[];
  tasks: Task[];
}

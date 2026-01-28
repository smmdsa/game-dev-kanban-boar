export type Priority = 'critical' | 'high' | 'medium' | 'low';

export interface Comment {
  id: string;
  text: string;
  createdAt: number;
  author: string;
  authorAvatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  points: number;
  tags: string[];
  columnId: string;
  priority: Priority;
  comments?: Comment[];
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

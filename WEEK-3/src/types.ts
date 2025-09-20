export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoApp {
  todos: TodoItem[];
  activeFilter: FilterType;
}
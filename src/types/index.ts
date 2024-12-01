export interface Task {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  createdAt: string;
}

export interface CalendarNote {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

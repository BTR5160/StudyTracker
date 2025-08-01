export interface Objective {
  id: string;
  title: string;
  description: string;
  totalTasks: number;
  completedTasks: number;
  color: string;
  icon: string;
}

export interface WeeklyTask {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export interface DailyTask {
  id: string;
  objectiveId: string;
  title: string;
  completed: boolean;
  timeSpent: number; // in minutes
  createdAt: string;
}

export interface PomodoroSession {
  id: string;
  objectiveId: string;
  duration: number;
  isBreak: boolean;
  completedAt: string;
}

export interface StudyStats {
  totalStudyTime: number;
  completedPomodoros: number;
  completedTasks: number;
  streakDays: number;
}

export type ViewType = 'dashboard' | 'weekly' | 'daily' | 'timer';
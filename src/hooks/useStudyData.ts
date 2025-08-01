import { useLocalStorage } from './useLocalStorage';
import { Objective, WeeklyTask, DailyTask, PomodoroSession } from '../types';

const initialObjectives: Objective[] = [
  {
    id: 'ielts',
    title: 'IELTS Preparation',
    description: 'Achieve band 8.0 in IELTS exam',
    totalTasks: 120,
    completedTasks: 0,
    color: 'bg-blue-500',
    icon: '🎯'
  },
  {
    id: 'pl300',
    title: 'PL-300 Certification',
    description: 'Microsoft Power BI Data Analyst certification',
    totalTasks: 80,
    completedTasks: 0,
    color: 'bg-purple-500',
    icon: '📊'
  },
  {
    id: 'programming',
    title: 'Python & Java',
    description: 'Master programming fundamentals and frameworks',
    totalTasks: 150,
    completedTasks: 0,
    color: 'bg-green-500',
    icon: '💻'
  },
  {
    id: 'ai-bi',
    title: 'AI+BI Project',
    description: 'Build comprehensive AI and BI solution',
    totalTasks: 100,
    completedTasks: 0,
    color: 'bg-orange-500',
    icon: '🤖'
  }
];

export function useStudyData() {
  const [objectives, setObjectives] = useLocalStorage<Objective[]>('study-objectives', initialObjectives);
  const [weeklyTasks, setWeeklyTasks] = useLocalStorage<WeeklyTask[]>('weekly-tasks', []);
  const [dailyTasks, setDailyTasks] = useLocalStorage<DailyTask[]>('daily-tasks', []);
  const [pomodoroSessions, setPomodoroSessions] = useLocalStorage<PomodoroSession[]>('pomodoro-sessions', []);

  const updateObjectiveProgress = (objectiveId: string, completedTasks: number) => {
    setObjectives(prev => prev.map(obj =>
      obj.id === objectiveId ? { ...obj, completedTasks } : obj
    ));
  };

  const addWeeklyTask = (task: Omit<WeeklyTask, 'id'>) => {
    const newTask: WeeklyTask = {
      ...task,
      id: Date.now().toString()
    };
    setWeeklyTasks(prev => [...prev, newTask]);
  };

  const toggleWeeklyTask = (taskId: string) => {
    setWeeklyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateWeeklyTask = (taskId: string, updates: Partial<WeeklyTask>) => {
    setWeeklyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteWeeklyTask = (taskId: string) => {
    setWeeklyTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addDailyTask = (task: Omit<DailyTask, 'id'>) => {
    const newTask: DailyTask = {
      ...task,
      id: Date.now().toString()
    };
    setDailyTasks(prev => [...prev, newTask]);
  };

  const toggleDailyTask = (taskId: string) => {
    setDailyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateDailyTask = (taskId: string, updates: Partial<DailyTask>) => {
    setDailyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteDailyTask = (taskId: string) => {
    setDailyTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addPomodoroSession = (session: Omit<PomodoroSession, 'id'>) => {
    const newSession: PomodoroSession = {
      ...session,
      id: Date.now().toString()
    };
    setPomodoroSessions(prev => [...prev, newSession]);
  };

  return {
    objectives,
    weeklyTasks,
    dailyTasks,
    pomodoroSessions,
    updateObjectiveProgress,
    addWeeklyTask,
    toggleWeeklyTask,
    updateWeeklyTask,
    deleteWeeklyTask,
    addDailyTask,
    toggleDailyTask,
    updateDailyTask,
    deleteDailyTask,
    addPomodoroSession
  };
}
import { useEffect } from 'react';
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

  // Sync weekly tasks to daily tasks for the current day
  // Ensures tasks with due dates for today automatically appear in Daily Tasks
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    setDailyTasks(prev => {
      // Keep existing daily tasks that are not linked to weekly tasks or are still due today
      const validWeeklyIds = new Set(
        weeklyTasks.filter(w => w.dueDate === today).map(w => w.id)
      );
      const filtered = prev.filter(
        task => !task.weeklyTaskId || validWeeklyIds.has(task.weeklyTaskId)
      );

      // Determine which weekly tasks for today are not yet in daily tasks
      const existingIds = new Set(
        filtered.filter(t => t.weeklyTaskId).map(t => t.weeklyTaskId as string)
      );

      const newDailyTasks: DailyTask[] = weeklyTasks
        .filter(w => w.dueDate === today && !existingIds.has(w.id))
        .map(w => ({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          objectiveId: w.objectiveId,
          title: w.title,
          completed: w.completed,
          timeSpent: 0,
          createdAt: new Date().toISOString(),
          weeklyTaskId: w.id
        }));

      return [...filtered, ...newDailyTasks];
    });
  }, [weeklyTasks, setDailyTasks]);

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
    setWeeklyTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      const updated = prev.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      if (task) {
        const newStatus = !task.completed;
        setDailyTasks(d => d.map(dt =>
          dt.weeklyTaskId === taskId ? { ...dt, completed: newStatus } : dt
        ));
      }
      return updated;
    });
  };

  const updateWeeklyTask = (taskId: string, updates: Partial<WeeklyTask>) => {
    setWeeklyTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
    // Propagate updates to linked daily tasks
    setDailyTasks(prev => prev.map(task =>
      task.weeklyTaskId === taskId
        ? {
            ...task,
            objectiveId: updates.objectiveId ?? task.objectiveId,
            title: updates.title ?? task.title,
            completed: updates.completed ?? task.completed
          }
        : task
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
    setDailyTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task?.weeklyTaskId) {
        setWeeklyTasks(prevW => prevW.map(w =>
          w.id === task.weeklyTaskId ? { ...w, completed: !task.completed } : w
        ));
      }
      return prev.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
    });
  };

  const updateDailyTask = (taskId: string, updates: Partial<DailyTask>) => {
    setDailyTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task?.weeklyTaskId) {
        setWeeklyTasks(prevW => prevW.map(w =>
          w.id === task.weeklyTaskId ? {
            ...w,
            objectiveId: updates.objectiveId ?? w.objectiveId,
            title: updates.title ?? w.title
          } : w
        ));
      }
      return prev.map(t => t.id === taskId ? { ...t, ...updates } : t);
    });
  };

  const deleteDailyTask = (taskId: string) => {
    setDailyTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task?.weeklyTaskId) {
        setWeeklyTasks(prevW => prevW.filter(w => w.id !== task.weeklyTaskId));
      }
      return prev.filter(t => t.id !== taskId);
    });
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
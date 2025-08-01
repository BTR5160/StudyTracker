import React, { useState, useEffect } from 'react';
import { ViewType } from './types';
import { useStudyData } from './hooks/useStudyData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { DailyTasks } from './components/DailyTasks';
import { PomodoroTimer } from './components/PomodoroTimer';
import { ExportPanel } from './components/ExportPanel';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('dark-mode', false);
  
  const {
    objectives,
    weeklyTasks,
    dailyTasks,
    pomodoroSessions,
    updateObjectiveProgress,
    addWeeklyTask,
    toggleWeeklyTask,
    addDailyTask,
    toggleDailyTask,
    addPomodoroSession
  } = useStudyData();

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Update objective progress when tasks change
  useEffect(() => {
    objectives.forEach(objective => {
      const objectiveWeeklyTasks = weeklyTasks.filter(task => task.objectiveId === objective.id);
      const objectiveDailyTasks = dailyTasks.filter(task => task.objectiveId === objective.id);
      
      const completedWeekly = objectiveWeeklyTasks.filter(task => task.completed).length;
      const completedDaily = objectiveDailyTasks.filter(task => task.completed).length;
      
      const totalCompleted = completedWeekly + completedDaily;
      
      if (totalCompleted !== objective.completedTasks) {
        updateObjectiveProgress(objective.id, totalCompleted);
      }
    });
  }, [weeklyTasks, dailyTasks, objectives, updateObjectiveProgress]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard objectives={objectives} />;
      case 'weekly':
        return (
          <WeeklyPlanner
            objectives={objectives}
            weeklyTasks={weeklyTasks}
            onAddTask={addWeeklyTask}
            onToggleTask={toggleWeeklyTask}
          />
        );
      case 'daily':
        return (
          <DailyTasks
            objectives={objectives}
            dailyTasks={dailyTasks}
            onAddTask={addDailyTask}
            onToggleTask={toggleDailyTask}
          />
        );
      case 'timer':
        return (
          <PomodoroTimer
            objectives={objectives}
            onSessionComplete={addPomodoroSession}
          />
        );
      default:
        return <Dashboard objectives={objectives} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      
      <main className="pb-8">
        {renderCurrentView()}
        
        {/* Export Panel - Show only on dashboard */}
        {currentView === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 mt-8">
            <ExportPanel
              objectives={objectives}
              weeklyTasks={weeklyTasks}
              dailyTasks={dailyTasks}
              pomodoroSessions={pomodoroSessions}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
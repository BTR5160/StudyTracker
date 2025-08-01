import React from 'react';
import { ViewType } from '../types';
import { Home, Calendar, CheckSquare, Timer, Moon, Sun } from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navigation({ currentView, onViewChange, darkMode, onToggleDarkMode }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'weekly', label: 'Weekly', icon: Calendar },
    { id: 'daily', label: 'Daily', icon: CheckSquare },
    { id: 'timer', label: 'Timer', icon: Timer },
  ] as const;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-1">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mr-8">
              📚 StudyTracker
            </div>
            
            <div className="hidden sm:flex space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id as ViewType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    currentView === id
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex space-x-1 pb-3">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id as ViewType)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex flex-col items-center space-y-1 ${
                currentView === id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
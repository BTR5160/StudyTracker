import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Objective } from '../types';

interface PomodoroTimerProps {
  objectives: Objective[];
  onSessionComplete: (session: { objectiveId: string; duration: number; isBreak: boolean; completedAt: string }) => void;
}

export function PomodoroTimer({ objectives, onSessionComplete }: PomodoroTimerProps) {
  const [selectedObjective, setSelectedObjective] = useState(objectives[0]?.id || '');
  const [workDuration, setWorkDuration] = useState(25); // minutes
  const [breakDuration, setBreakDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(workDuration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout>();

  // Presets
  const presets = [
    { name: 'Classic', work: 25, break: 5 },
    { name: 'Extended', work: 50, break: 10 },
    { name: 'Short', work: 15, break: 3 }
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    
    // Play notification sound (you can add actual audio file)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+H2v2YcBSuQz/LKfSwFJHfH8N2QQAoUXrTp66hVFApGn+H2v2YcBSuQz/LKfS');
      audio.play().catch(() => {}); // Ignore errors
    } catch {
      // ignore playback errors
    }

    if (selectedObjective) {
      onSessionComplete({
        objectiveId: selectedObjective,
        duration: isBreak ? breakDuration : workDuration,
        isBreak,
        completedAt: new Date().toISOString()
      });
    }

    if (!isBreak) {
      setSessionsCompleted(prev => prev + 1);
      setIsBreak(true);
      setTimeLeft(breakDuration * 60);
    } else {
      setIsBreak(false);
      setTimeLeft(workDuration * 60);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workDuration * 60);
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setWorkDuration(preset.work);
    setBreakDuration(preset.break);
    if (!isBreak) {
      setTimeLeft(preset.work * 60);
    }
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100
    : ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100;

  const selectedObj = objectives.find(obj => obj.id === selectedObjective);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pomodoro Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Focus on your studies with timed work sessions
        </p>
      </div>

      {/* Timer Display */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
        <div className="text-center">
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                className={`transition-all duration-1000 ${
                  isBreak ? 'text-green-500' : 'text-blue-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm font-medium mt-2 ${
                  isBreak ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {isBreak ? 'Break Time' : 'Work Time'}
                </div>
              </div>
            </div>
          </div>

          {/* Current Objective */}
          {selectedObj && (
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                <span className="text-2xl">{selectedObj.icon}</span>
                <span>{selectedObj.title}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={isRunning ? handlePause : handleStart}
              className={`p-4 rounded-full text-white transition-all duration-200 ${
                isRunning
                  ? 'bg-red-500 hover:bg-red-600'
                  : isBreak
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={handleReset}
              className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              <RotateCcw size={24} />
            </button>
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-4 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Settings size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionsCompleted}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sessions Today
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(sessionsCompleted * workDuration / 60 * 10) / 10}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Study Time
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objective Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Objective</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {objectives.map(objective => (
            <button
              key={objective.id}
              onClick={() => setSelectedObjective(objective.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedObjective === objective.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{objective.icon}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {objective.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round((objective.completedTasks / objective.totalTasks) * 100)}% complete
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Timer Settings</h3>
            
            {/* Presets */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Presets</h4>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="p-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{preset.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {preset.work}m / {preset.break}m
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Work Duration (minutes)
                </label>
                <input
                  type="number"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="120"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="number"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!isBreak) setTimeLeft(workDuration * 60);
                  setShowSettings(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
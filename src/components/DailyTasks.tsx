import React, { useState } from 'react';
import { DailyTask, Objective } from '../types';
import { Plus, CheckCircle2, Calendar, Target, Pencil, Trash2 } from 'lucide-react';

interface DailyTasksProps {
  objectives: Objective[];
  dailyTasks: DailyTask[];
  onAddTask: (task: Omit<DailyTask, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<DailyTask>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function DailyTasks({ objectives, dailyTasks, onAddTask, onToggleTask, onEditTask, onDeleteTask }: DailyTasksProps) {
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [editObjective, setEditObjective] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = dailyTasks.filter(task => task.createdAt.startsWith(today));
  const completedToday = todayTasks.filter(task => task.completed).length;
  const progressToday = todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !selectedObjective) return;

    onAddTask({
      objectiveId: selectedObjective,
      title: taskTitle.trim(),
      completed: false,
      timeSpent: 0,
      createdAt: new Date().toISOString()
    });

    setTaskTitle('');
    setShowAddTask(false);
  };

  const startEditTask = (task: DailyTask) => {
    setEditingTask(task);
    setEditObjective(task.objectiveId);
    setEditTitle(task.title);
  };

  const handleEditTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim() || !editObjective) return;
    onEditTask(editingTask.id, {
      objectiveId: editObjective,
      title: editTitle.trim()
    });
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Delete this task?')) {
      onDeleteTask(taskId);
    }
  };

  const getTasksByObjective = (objectiveId: string) => {
    return todayTasks.filter(task => task.objectiveId === objectiveId);
  };

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Daily Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Daily Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(progressToday)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressToday}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedToday}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {todayTasks.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Daily Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Objective
                </label>
                <select
                  value={selectedObjective}
                  onChange={(e) => setSelectedObjective(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select objective...</option>
                  {objectives.map(obj => (
                    <option key={obj.id} value={obj.id}>{obj.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks by Objective */}
      <div className="space-y-6">
        {objectives.map(objective => {
          const objectiveTasks = getTasksByObjective(objective.id);
          
          if (objectiveTasks.length === 0) return null;

          return (
            <div key={objective.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{objective.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {objective.title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({objectiveTasks.filter(t => t.completed).length} of {objectiveTasks.length} completed)
                </span>
              </div>

              <div className="space-y-3">
                {objectiveTasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`rounded-full p-1 transition-colors ${
                        task.completed
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                      }`}
                    >
                      {task.completed ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
                    </button>

                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        task.completed
                          ? 'text-green-800 dark:text-green-200 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Created: {new Date(task.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditTask(task)}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      {todayTasks.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4">No tasks for today</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Add your first task to get started with today's study plan</p>
          </div>
        )}
      </div>
    </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Task</h3>
            <form onSubmit={handleEditTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objective</label>
                <select
                  value={editObjective}
                  onChange={(e) => setEditObjective(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select objective...</option>
                  {objectives.map(obj => (
                    <option key={obj.id} value={obj.id}>{obj.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter task title..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
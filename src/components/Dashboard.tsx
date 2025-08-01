import React from 'react';
import { Objective } from '../types';
import { TrendingUp, Target, Calendar, Clock } from 'lucide-react';

interface DashboardProps {
  objectives: Objective[];
}

export function Dashboard({ objectives }: DashboardProps) {
  const totalTasks = objectives.reduce((sum, obj) => sum + obj.totalTasks, 0);
  const completedTasks = objectives.reduce((sum, obj) => sum + obj.completedTasks, 0);
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Study Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your progress across all study objectives
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(overallProgress)}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTasks}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Objectives</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {objectives.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">7 days</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Objectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {objectives.map((objective) => {
          const progress = objective.totalTasks > 0 ? (objective.completedTasks / objective.totalTasks) * 100 : 0;
          
          return (
            <div
              key={objective.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{objective.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {objective.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {objective.description}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${objective.color} text-white`}>
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {objective.completedTasks} / {objective.totalTasks} tasks
                  </span>
                </div>
                
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${objective.color}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Daily Avg</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">2.3 hrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">This Week</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">16 hrs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {objective.totalTasks - objective.completedTasks}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
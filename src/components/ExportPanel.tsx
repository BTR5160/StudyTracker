import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { Objective, WeeklyTask, DailyTask, PomodoroSession } from '../types';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface ExportPanelProps {
  objectives: Objective[];
  weeklyTasks: WeeklyTask[];
  dailyTasks: DailyTask[];
  pomodoroSessions: PomodoroSession[];
}

export function ExportPanel({ objectives, weeklyTasks, dailyTasks, pomodoroSessions }: ExportPanelProps) {
  const handleExportCSV = () => {
    exportToCSV(objectives, weeklyTasks, dailyTasks, pomodoroSessions);
  };

  const handleExportPDF = () => {
    exportToPDF(objectives, weeklyTasks, dailyTasks);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-4">
        <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Progress</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
        Export your study progress for record keeping or sharing
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <Table className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-gray-900 dark:text-white">Export as CSV</span>
        </button>
        
        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
          <span className="font-medium text-gray-900 dark:text-white">Export as PDF</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>• CSV format includes all data for spreadsheet analysis</p>
        <p>• PDF format provides a formatted progress report</p>
      </div>
    </div>
  );
}
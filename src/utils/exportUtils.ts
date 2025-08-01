import { Objective, WeeklyTask, DailyTask } from '../types';

export function exportToCSV(
  objectives: Objective[],
  weeklyTasks: WeeklyTask[],
  dailyTasks: DailyTask[]
) {
  const csvContent = [
    // Headers
    'Type,Objective,Title,Status,Progress,Date,Duration',
    
    // Objectives
    ...objectives.map(obj => 
      `Objective,"${obj.title}","${obj.description}",${obj.completedTasks}/${obj.totalTasks},${Math.round((obj.completedTasks / obj.totalTasks) * 100)}%,,`
    ),
    
    // Weekly Tasks
    ...weeklyTasks.map(task => 
      `Weekly Task,${objectives.find(o => o.id === task.objectiveId)?.title || 'Unknown'},"${task.title}",${task.completed ? 'Completed' : 'Pending'},,${task.dueDate},`
    ),
    
    // Daily Tasks
    ...dailyTasks.map(task => 
      `Daily Task,${objectives.find(o => o.id === task.objectiveId)?.title || 'Unknown'},"${task.title}",${task.completed ? 'Completed' : 'Pending'},,${task.createdAt},${task.timeSpent}min`
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `study-progress-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(
  objectives: Objective[],
  weeklyTasks: WeeklyTask[],
  dailyTasks: DailyTask[]
) {
  const content = `
    <html>
      <head>
        <title>Study Progress Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #3B82F6; border-bottom: 2px solid #3B82F6; padding-bottom: 10px; }
          h2 { color: #6366F1; margin-top: 30px; }
          .objective { margin: 20px 0; padding: 15px; border-left: 4px solid #10B981; background: #f8f9fa; }
          .progress-bar { background: #e5e7eb; height: 10px; border-radius: 5px; overflow: hidden; }
          .progress-fill { height: 100%; background: #10B981; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 5px 0; padding: 8px; background: white; border-radius: 5px; }
          .completed { text-decoration: line-through; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>Study Progress Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        
        <h2>Objectives Overview</h2>
        ${objectives.map(obj => `
          <div class="objective">
            <h3>${obj.icon} ${obj.title}</h3>
            <p>${obj.description}</p>
            <p>Progress: ${obj.completedTasks}/${obj.totalTasks} tasks (${Math.round((obj.completedTasks / obj.totalTasks) * 100)}%)</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(obj.completedTasks / obj.totalTasks) * 100}%"></div>
            </div>
          </div>
        `).join('')}
        
        <h2>Weekly Tasks</h2>
        <ul>
          ${weeklyTasks.map(task => `
            <li class="${task.completed ? 'completed' : ''}">
              ${task.completed ? '✅' : '⏳'} ${task.title} 
              (${objectives.find(o => o.id === task.objectiveId)?.title || 'Unknown'})
            </li>
          `).join('')}
        </ul>
        
        <h2>Recent Daily Tasks</h2>
        <ul>
          ${dailyTasks.slice(-20).map(task => `
            <li class="${task.completed ? 'completed' : ''}">
              ${task.completed ? '✅' : '⏳'} ${task.title} 
              (${objectives.find(o => o.id === task.objectiveId)?.title || 'Unknown'})
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }
}
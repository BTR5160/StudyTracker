import { WeeklyTask } from '../types';

export function generateIELTSTasks(): WeeklyTask[] {
  const tasks: WeeklyTask[] = [];
  let counter = 1;
  const addTask = (date: string, title: string, description: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    tasks.push({
      id: `ielts-${counter++}`,
      objectiveId: 'ielts',
      title,
      description,
      completed: false,
      dueDate: date,
      priority
    });
  };

  // Phase 1: Warmup & Foundation (Aug 2 – Aug 20)
  const phase1 = [
    { date: '2024-08-02', items: [
        { title: 'Listening Test 1', desc: 'Cambridge book, review mistakes' },
        { title: 'Speaking Part 1', desc: '10 questions' }
      ] },
    { date: '2024-08-03', items: [
        { title: 'Reading Test 1', desc: '3 passages, 60 min' },
        { title: 'Speaking Part 1', desc: 'Record responses' }
      ] },
    { date: '2024-08-04', items: [
        { title: 'Writing Task 1', desc: '150 words, chart/graph' },
        { title: 'Speaking Part 2', desc: '2-minute topic' }
      ] },
    { date: '2024-08-05', items: [
        { title: 'Listening Test 2', desc: '' },
        { title: 'Speaking Part 3', desc: 'Discussion' }
      ] },
    { date: '2024-08-06', items: [
        { title: 'Reading Test 2', desc: '' },
        { title: 'Speaking Part 1', desc: 'Short practice' }
      ] },
    // Vacation Aug 7–13
    { date: '2024-08-14', items: [
        { title: 'Listening Test 3', desc: '' },
        { title: 'Writing Task 2', desc: 'Opinion essay, 250 words' }
      ] },
    { date: '2024-08-15', items: [
        { title: 'Reading Test 3', desc: '' },
        { title: 'Speaking Part 1', desc: '' }
      ] },
    { date: '2024-08-16', items: [
        { title: 'Writing Task 1', desc: '' },
        { title: 'Speaking Part 2', desc: '' }
      ] },
    { date: '2024-08-17', items: [
        { title: 'Listening Test 4', desc: '' },
        { title: 'Speaking Part 3', desc: '' }
      ] },
    { date: '2024-08-18', items: [
        { title: 'Reading Test 4', desc: '' },
        { title: 'Speaking Part 1', desc: '' }
      ] },
    { date: '2024-08-19', items: [
        { title: 'Writing Task 2', desc: '' },
        { title: 'Speaking full mock test', desc: '15 min' }
      ] },
    { date: '2024-08-20', items: [
        { title: 'Listening Test 5', desc: '' },
        { title: 'Speaking quick questions', desc: '' }
      ] }
  ];

  phase1.forEach(day => {
    day.items.forEach(act => addTask(day.date, act.title, act.desc));
  });

  // Phase 2: Intensive Practice (Aug 21 – Sept 15)
  const startPhase2 = new Date('2024-08-21');
  const endPhase2 = new Date('2024-09-15');
  for (let d = new Date(startPhase2); d <= endPhase2; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    if (d.getDate() % 2 === 1) {
      addTask(dateStr, 'Listening full test', 'Review deeply');
      addTask(dateStr, 'Writing Task 1', 'Practice');
    } else {
      addTask(dateStr, 'Reading full test', '3 passages, 60 min');
      addTask(dateStr, 'Writing Task 2', 'Practice');
    }
    addTask(dateStr, 'Speaking practice', '15 min (Part 1 or 2)');
    if (d.getDay() === 0) {
      addTask(dateStr, 'Speaking full mock', 'Parts 1, 2, 3 (~15 min)');
    }
  }

  // Phase 3: Exam Simulation (Sept 16 – Sept 30)
  const phase3 = [
    { date: '2024-09-16', title: 'Full Mock Test #1', desc: 'Listening + Reading + Writing (2h40)' },
    { date: '2024-09-17', title: 'Speaking full mock', desc: '' },
    { date: '2024-09-18', title: 'Full Mock Test #2', desc: '' },
    { date: '2024-09-19', title: 'Speaking Part 2 practice', desc: '' },
    { date: '2024-09-20', title: 'Full Mock Test #3', desc: '' },
    { date: '2024-09-21', title: 'Speaking mock', desc: '' },
    { date: '2024-09-22', title: 'Full Mock Test #4', desc: '' },
    { date: '2024-09-23', title: 'Light review', desc: 'Writing corrections, error lists' },
    { date: '2024-09-24', title: 'Light review', desc: 'Writing corrections, error lists' },
    { date: '2024-09-25', title: 'IELTS Exam', desc: 'Preferred date' },
    { date: '2024-09-26', title: 'IELTS Exam', desc: 'Alternate date' },
    { date: '2024-09-27', title: 'Mock test or speaking practice', desc: 'Continue if exam later' },
    { date: '2024-09-28', title: 'Mock test or speaking practice', desc: 'Continue if exam later' },
    { date: '2024-09-29', title: 'Mock test or speaking practice', desc: 'Continue if exam later' },
    { date: '2024-09-30', title: 'Mock test or speaking practice', desc: 'Continue if exam later' }
  ];

  phase3.forEach(item => addTask(item.date, item.title, item.desc));

  // Ensure daily speaking practice in Phase 3
  const speakingDates = new Set(tasks.filter(t => t.title.toLowerCase().includes('speaking')).map(t => t.dueDate));
  const startPhase3 = new Date('2024-09-16');
  const endPhase3 = new Date('2024-09-30');
  for (let d = new Date(startPhase3); d <= endPhase3; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    if (!speakingDates.has(dateStr)) {
      addTask(dateStr, 'Speaking practice', 'Daily speaking practice');
    }
  }

  return tasks;
}


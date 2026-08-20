export function formatDifficulty(difficulty) {
  if (!difficulty) return '';
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function formatDueLabel(task) {
  if (task.status === 'completed' && task.completedAt) {
    const days = Math.floor((Date.now() - new Date(task.completedAt)) / 86400000);
    if (days === 0) return 'Completed today';
    if (days === 1) return 'Completed 1 day ago';
    return `Completed ${days} days ago`;
  }
  if (task.dueDate) {
    const days = Math.ceil((new Date(task.dueDate) - Date.now()) / 86400000);
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  }
  return 'No deadline';
}
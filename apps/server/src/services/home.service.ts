import { HomeRepository } from "../repositories/home.repository";

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  const dateSet = new Set(dates.map((d) => new Date(d).toDateString()));

  while (dateSet.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export class HomeService {
  static async getDashboard(userId: string) {
    const [taskStats, noteStats, featuredTask, recentDates] = await Promise.all([
      HomeRepository.getTaskStats(userId),
      HomeRepository.getNoteStats(userId),
      HomeRepository.getFeaturedTask(userId),
      HomeRepository.getRecentActivityDates(userId, 30),
    ]);

    const taskCompletionPct = taskStats.total > 0
      ? (taskStats.completed / taskStats.total) * 100
      : 0;
    const noteAvgProgress = Number(noteStats.avgProgress) || 0;

    const readiness = Math.round(taskCompletionPct * 0.6 + noteAvgProgress * 0.4);

    const streak = calculateStreak(recentDates);

    const weekAgoSnapshot = await HomeRepository.getSnapshotFromDaysAgo(userId, 7);
    const weeklyChange = weekAgoSnapshot !== null ? readiness - weekAgoSnapshot : 0;

    // Aaj ka snapshot save karo — kal se weekly-change calculate ho sake
    await HomeRepository.upsertTodaySnapshot(userId, readiness);

    return {
      readiness,
      message: readiness >= 70
        ? "You're making strong progress!"
        : readiness >= 40
          ? "Good start, keep going!"
          : "Let's get you started!",
      weeklyChange,
      streak,
      stats: {
        tasksDone: Number(taskStats.completed),
        notesRead: Number(noteStats.completedCount),
        skillsPracticed: 0, // future feature, abhi 0
        streakDays: streak,
      },
      featuredTask: featuredTask
        ? {
            id: featuredTask.id,
            title: featuredTask.title,
            description: featuredTask.description,
            difficulty: featuredTask.difficulty,
            hours: featuredTask.estimatedHours,
          }
        : null,
    };
  }
}
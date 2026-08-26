import { TaskRepository } from "../repositories/task.repository";
import { ApiError } from "../utils/ApiError";

export class TaskService {
  static async createTask(
    adminUserId: string,
    data: { title: string; description?: string; difficulty?: "beginner" | "intermediate" | "advanced"; estimatedHours?: string; dueDate?: string }
  ) {
    if (!data.title || data.title.trim().length === 0) {
      throw new ApiError(400, "Task title is required");
    }
    return await TaskRepository.createTask({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      estimatedHours: data.estimatedHours,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      createdBy: adminUserId,
    });
  }

  static async getAllTasksForUser(userId: string) {
    const [allTasks, submittedTaskIds] = await Promise.all([
      TaskRepository.getAllTasks(),
      TaskRepository.findSubmittedTaskIds(userId),
    ]);
    const completedSet = new Set(submittedTaskIds);
    return allTasks.map((t) => ({ ...t, status: completedSet.has(t.id) ? "completed" : "pending" }));
  }

  static async getTaskById(taskId: string, userId: string) {
    const task = await TaskRepository.getTaskById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    const submissions = await TaskRepository.findSubmissionsByTask(taskId, userId);
    return { ...task, status: submissions.length > 0 ? "completed" : "pending", submissions };
  }

  static async updateTask(
    taskId: string,
    data: Partial<{ title: string; description: string; difficulty: "beginner" | "intermediate" | "advanced"; estimatedHours: string; dueDate: Date }>
  ) {
    const task = await TaskRepository.getTaskById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    return await TaskRepository.updateTask(taskId, data);
  }

  static async deleteTask(taskId: string) {
    const task = await TaskRepository.getTaskById(taskId);
    if (!task) throw new ApiError(404, "Task not found");
    return await TaskRepository.deleteTask(taskId);
  }

  static async submitTask(
    taskId: string,
    userId: string,
    payload: { submissionType: "link" | "text" | "file"; submissionUrl?: string; notes?: string }
  ) {
    const task = await TaskRepository.getTaskById(taskId);
    if (!task) throw new ApiError(404, "Task not found");

    const existing = await TaskRepository.findSubmissionsByTask(taskId, userId);
    if (existing.length > 0) {
      throw new ApiError(400, "You have already submitted this task");
    }

    const submission = await TaskRepository.createSubmission({ taskId, userId, ...payload });
    return { submission, task: { ...task, status: "completed" } };
  }
}
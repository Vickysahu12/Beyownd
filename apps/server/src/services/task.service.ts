import { TaskRepository } from "../repositories/task.repository";
import { ApiError } from "../utils/ApiError";

export class TaskService {
  static async createTask(userId: string, data: { title: string; description?: string; dueDate?: string }) {
    if (!data.title || data.title.trim().length === 0) {
      throw new ApiError(400, "Task title is required");
    }

    return await TaskRepository.createTask({
      userId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
  }

  static async getUserTasks(userId: string) {
    return await TaskRepository.getUserTasks(userId);
  }

  static async updateTaskStatus(
    taskId: string,
    userId: string,
    status: "pending" | "in_progress" | "completed"
  ) {
    const task = await TaskRepository.getTaskById(taskId, userId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return await TaskRepository.updateTask(taskId, userId, { status });
  }

  static async deleteTask(taskId: string, userId: string) {
    const task = await TaskRepository.getTaskById(taskId, userId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    return await TaskRepository.deleteTask(taskId, userId);
  }

  static async getTaskById(taskId: string, userId: string) {
  const task = await TaskRepository.getTaskById(taskId, userId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  const submissions = await TaskRepository.findSubmissionsByTask(taskId, userId);
  return { ...task, submissions };
}

static async submitTask(
  taskId: string,
  userId: string,
  payload: { submissionType: "link" | "text" | "file"; submissionUrl?: string; notes?: string }
) {
  const task = await TaskRepository.getTaskById(taskId, userId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  if (task.status === "completed") {
    throw new ApiError(400, "This task is already completed");
  }

  const submission = await TaskRepository.createSubmission({ taskId, userId, ...payload });
  const updatedTask = await TaskRepository.updateTask(taskId, userId, {
    status: "completed",
  });

  return { submission, task: updatedTask };
}
}
import { prisma } from '@db/prisma';
import { ApiError } from '@utils/ApiError';
import { CreateTaskLabelRequest } from './task-label.validation';

export class TaskLabelService {
  async createLabel(
    userId: string,
    workspaceId: string,
    taskId: string,
    data: CreateTaskLabelRequest
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
    });

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    return prisma.taskLabel.create({
      data: {
        name: data.name,
        color: data.color,
        taskId,
      },
    });
  }

  async getTaskLabels(
    userId: string,
    workspaceId: string,
    taskId: string
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        workspaceId,
      },
    });

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    return prisma.taskLabel.findMany({
      where: { taskId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async deleteLabel(
    userId: string,
    workspaceId: string,
    taskId: string,
    labelId: string
  ) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    const label = await prisma.taskLabel.findFirst({
      where: {
        id: labelId,
        taskId,
        task: {
          workspaceId,
        },
      },
    });

    if (!label) {
      throw new ApiError(404, 'Label not found');
    }

    await prisma.taskLabel.delete({
      where: { id: labelId },
    });
  }
}

export const taskLabelService = new TaskLabelService();
import { prisma } from '@db/prisma';
import { ApiError } from '@utils/ApiError';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from './task.validation';

export class TaskService {
  async createTask(
    userId: string,
    workspaceId: string,
    data: CreateTaskRequest
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

    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        workspaceId,
      },
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    if (data.assigneeId) {
      const assigneeMembership =
        await prisma.workspaceMember.findUnique({
          where: {
            userId_workspaceId: {
              userId: data.assigneeId,
              workspaceId,
            },
          },
        });

      if (!assigneeMembership) {
        throw new ApiError(
          400,
          'Assignee must be a member of the workspace'
        );
      }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        projectId: data.projectId,
        workspaceId,
        assigneeId: data.assigneeId,
      },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return task;
  }

  async getWorkspaceTasks(
    userId: string,
    workspaceId: string
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

    return prisma.task.findMany({
      where: { workspaceId },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getTaskById(
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
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    return task;
  }

  async updateTask(
    userId: string,
    workspaceId: string,
    taskId: string,
    data: UpdateTaskRequest
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

    if (data.assigneeId) {
      const assigneeMembership =
        await prisma.workspaceMember.findUnique({
          where: {
            userId_workspaceId: {
              userId: data.assigneeId,
              workspaceId,
            },
          },
        });

      if (!assigneeMembership) {
        throw new ApiError(
          400,
          'Assignee must be a member of the workspace'
        );
      }
    }

    return prisma.task.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.status !== undefined && {
          status: data.status,
        }),
        ...(data.priority !== undefined && {
          priority: data.priority,
        }),
        ...(data.assigneeId !== undefined && {
          assigneeId: data.assigneeId,
        }),
      },
      include: {
        project: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteTask(
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

    await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export const taskService = new TaskService();
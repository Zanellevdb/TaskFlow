import { prisma } from '@db/prisma';
import { ApiError } from '@utils/ApiError';
import { CreateCommentRequest } from './comment.validation';

export class CommentService {
  async createComment(
    userId: string,
    workspaceId: string,
    taskId: string,
    data: CreateCommentRequest
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

    return prisma.comment.create({
      data: {
        content: data.content,
        taskId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getTaskComments(
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

    return prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
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

  async deleteComment(
    userId: string,
    workspaceId: string,
    taskId: string,
    commentId: string
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

    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        taskId,
        task: {
          workspaceId,
        },
      },
    });

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    if (comment.authorId !== userId && membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ApiError(
        403,
        'Only the comment author, workspace owners, and admins can delete the comment'
      );
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }
}

export const commentService = new CommentService();
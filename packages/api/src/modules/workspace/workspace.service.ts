import { prisma } from '@db/prisma';
import { ApiError } from '@utils/ApiError';
import { CreateWorkspaceRequest } from './workspace.validation';

export class WorkspaceService {
  async createWorkspace(
    userId: string,
    data: CreateWorkspaceRequest
  ) {
    const existingWorkspace = await prisma.workspace.findUnique({
      where: { slug: data.slug },
    });

    if (existingWorkspace) {
      throw new ApiError(409, 'Workspace slug already exists');
    }

    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          where: { userId },
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      createdAt: workspace.createdAt,
      role: workspace.members[0].role,
    };
  }

  async getUserWorkspaces(userId: string) {
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      description: membership.workspace.description,
      createdAt: membership.workspace.createdAt,
      role: membership.role,
    }));
  }

  async getWorkspaceById(userId: string, workspaceId: string) {
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
      include: {
        workspace: true,
      },
    });

    if (!membership) {
      throw new ApiError(404, 'Workspace not found');
    }

    return {
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      description: membership.workspace.description,
      createdAt: membership.workspace.createdAt,
      role: membership.role,
    };
  }
}

export const workspaceService = new WorkspaceService();
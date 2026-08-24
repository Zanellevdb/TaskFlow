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
}

export const workspaceService = new WorkspaceService();
import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { workspaceService } from './workspace.service';
import {
  AddWorkspaceMemberRequest,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from './workspace.validation';

export class WorkspaceController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const workspace = await workspaceService.createWorkspace(
      req.user.userId,
      req.body as CreateWorkspaceRequest
    );

    res.status(201).json({
      success: true,
      message: 'Workspace created successfully',
      data: workspace,
    });
  }

  async getMine(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const workspaces = await workspaceService.getUserWorkspaces(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      message: 'Workspaces retrieved successfully',
      data: workspaces,
    });
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const workspace = await workspaceService.getWorkspaceById(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Workspace retrieved successfully',
      data: workspace,
    });
  }

  async getMembers(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const members =
      await workspaceService.getWorkspaceMembers(
        req.user.userId,
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: 'Workspace members retrieved successfully',
      data: members,
    });
  }

  async addMember(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const member =
      await workspaceService.addWorkspaceMember(
        req.user.userId,
        req.params.id,
        req.body as AddWorkspaceMemberRequest
      );

    res.status(201).json({
      success: true,
      message: 'Workspace member added successfully',
      data: member,
    });
  }

  async removeMember(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await workspaceService.removeWorkspaceMember(
      req.user.userId,
      req.params.id,
      req.params.memberId
    );

    res.status(200).json({
      success: true,
      message: 'Workspace member removed successfully',
    });
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const workspace = await workspaceService.updateWorkspace(
      req.user.userId,
      req.params.id,
      req.body as UpdateWorkspaceRequest
    );

    res.status(200).json({
      success: true,
      message: 'Workspace updated successfully',
      data: workspace,
    });
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    await workspaceService.deleteWorkspace(
      req.user.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Workspace deleted successfully',
    });
  }
}

export const workspaceController = new WorkspaceController();
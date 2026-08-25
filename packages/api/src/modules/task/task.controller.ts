import { Response } from 'express';
import { AuthRequest } from '@middlewares/auth.middleware';
import { taskService } from './task.service';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
} from './task.validation';

export class TaskController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const task = await taskService.createTask(
      req.user.userId,
      req.params.workspaceId,
      req.body as CreateTaskRequest
    );

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
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

    const tasks = await taskService.getWorkspaceTasks(
      req.user.userId,
      req.params.workspaceId
    );

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
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

    const task = await taskService.getTaskById(
      req.user.userId,
      req.params.workspaceId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
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

    const task = await taskService.updateTask(
      req.user.userId,
      req.params.workspaceId,
      req.params.id,
      req.body as UpdateTaskRequest
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
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

    await taskService.deleteTask(
      req.user.userId,
      req.params.workspaceId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  }
}

export const taskController = new TaskController();
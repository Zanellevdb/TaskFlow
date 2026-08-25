import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Task title must be at least 2 characters')
    .max(200, 'Task title must be at most 200 characters'),

  description: z
    .string()
    .trim()
    .max(2000, 'Task description must be at most 2000 characters')
    .optional(),

  status: z
    .enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'])
    .optional(),

  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .optional(),

  projectId: z
    .string()
    .min(1, 'Project ID is required'),

  assigneeId: z
    .string()
    .min(1, 'Assignee ID is required')
    .optional(),
});

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Task title must be at least 2 characters')
      .max(200, 'Task title must be at most 200 characters')
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000, 'Task description must be at most 2000 characters')
      .optional(),

    status: z
      .enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED'])
      .optional(),

    priority: z
      .enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
      .optional(),

    assigneeId: z
      .string()
      .min(1, 'Assignee ID is required')
      .nullable()
      .optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.priority !== undefined ||
      data.assigneeId !== undefined,
    {
      message: 'At least one field must be provided',
    }
  );

export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
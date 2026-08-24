import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(100, 'Workspace name must be at most 100 characters'),

  slug: z
    .string()
    .trim()
    .min(2, 'Workspace slug must be at least 2 characters')
    .max(50, 'Workspace slug must be at most 50 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Workspace slug must contain only lowercase letters, numbers, and hyphens'
    ),

  description: z
    .string()
    .trim()
    .max(500, 'Workspace description must be at most 500 characters')
    .optional(),
});

export type CreateWorkspaceRequest = z.infer<typeof createWorkspaceSchema>;

export const updateWorkspaceSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Workspace name must be at least 2 characters')
      .max(100, 'Workspace name must be at most 100 characters')
      .optional(),

    slug: z
      .string()
      .trim()
      .min(2, 'Workspace slug must be at least 2 characters')
      .max(50, 'Workspace slug must be at most 50 characters')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Workspace slug must contain only lowercase letters, numbers, and hyphens'
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, 'Workspace description must be at most 500 characters')
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.slug !== undefined ||
      data.description !== undefined,
    {
      message: 'At least one field must be provided',
    }
  );

export type UpdateWorkspaceRequest = z.infer<typeof updateWorkspaceSchema>;
import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters')
    .max(100, 'Project name must be at most 100 characters'),

  slug: z
    .string()
    .trim()
    .min(2, 'Project slug must be at least 2 characters')
    .max(50, 'Project slug must be at most 50 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Project slug must contain only lowercase letters, numbers, and hyphens'
    ),

  description: z
    .string()
    .trim()
    .max(500, 'Project description must be at most 500 characters')
    .optional(),
});

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Project name must be at least 2 characters')
      .max(100, 'Project name must be at most 100 characters')
      .optional(),

    slug: z
      .string()
      .trim()
      .min(2, 'Project slug must be at least 2 characters')
      .max(50, 'Project slug must be at most 50 characters')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Project slug must contain only lowercase letters, numbers, and hyphens'
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, 'Project description must be at most 500 characters')
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

export type UpdateProjectRequest = z.infer<typeof updateProjectSchema>;
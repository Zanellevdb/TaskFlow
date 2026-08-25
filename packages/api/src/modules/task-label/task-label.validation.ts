import { z } from 'zod';

export const createTaskLabelSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Label name is required')
    .max(50, 'Label name must be at most 50 characters'),

  color: z
    .string()
    .trim()
    .regex(
      /^#[0-9a-fA-F]{6}$/,
      'Label color must be a valid hex color'
    )
    .optional(),
});

export type CreateTaskLabelRequest = z.infer<
  typeof createTaskLabelSchema
>;
import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be under 2000 characters"),
  toolId: z.string().min(1, "Tool ID is required"),
  parentId: z.string().optional(),
});

export const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(20),
  toolId: z.string().min(1, "Tool ID is required"),
  parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ListCommentsQuery = z.infer<typeof listCommentsQuerySchema>;

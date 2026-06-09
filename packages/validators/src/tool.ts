import { z } from "zod";

export const createToolSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000),
  categoryId: z.string().min(1, "Category is required"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  features: z
    .object({
      pricing: z.enum(["free", "freemium", "paid", "enterprise"]).optional(),
      hasApi: z.boolean().optional(),
      hasCli: z.boolean().optional(),
    })
    .optional(),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  demoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  tagIds: z.array(z.string()).max(10, "Maximum 10 tags").optional(),
});

export const updateToolSchema = createToolSchema.partial().omit({ slug: true });

export const listToolsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  authorId: z.string().optional(),
  tagId: z.string().optional(),
  sortBy: z
    .enum(["createdAt", "name", "viewCount", "likeCount"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
export type ListToolsQuery = z.infer<typeof listToolsQuerySchema>;

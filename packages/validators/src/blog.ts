import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z
    .string()
    .min(2)
    .max(250)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.string().min(20, "Content must be at least 20 characters"),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const updateBlogPostSchema = createBlogPostSchema.partial().omit({
  slug: true,
});

export const listBlogPostsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  authorId: z.string().optional(),
  sortBy: z.enum(["createdAt", "publishedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type ListBlogPostsQuery = z.infer<typeof listBlogPostsQuerySchema>;

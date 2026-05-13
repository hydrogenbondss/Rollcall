import { z } from "zod";

export const submissionSchema = z.object({
  brand: z.string().min(1).max(255),
  productName: z.string().min(1).max(255),
  country: z.string().min(1).max(100),
  city: z.string().max(100).optional(),
  ply: z.number().int().min(1).max(10).optional(),
  scent: z.string().max(255).optional(),
  material: z.string().max(255).optional(),
  priceLocal: z.string().max(100).optional(),
  currency: z.string().max(10).optional(),
  retailer: z.string().max(255).optional(),
  notes: z.string().optional(),
  contributorName: z.string().max(255).optional(),
  contributorEmail: z.string().email().optional(),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const messageSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  body: z.string().min(1),
});

export type MessageInput = z.infer<typeof messageSchema>;

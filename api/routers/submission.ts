import { z } from "zod";
import { publicProcedure, router } from "@/api/lib/trpc";
import { getDb } from "@/api/queries/connection";
import { submissions, messages } from "@/db/schema";
import { submissionSchema, messageSchema } from "@/contracts/submission";

export const submissionRouter = router({
  // Create a new specimen submission
  create: publicProcedure
    .input(submissionSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(submissions).values({
        brand: input.brand,
        productName: input.productName,
        country: input.country,
        city: input.city ?? null,
        ply: input.ply ?? null,
        scent: input.scent ?? null,
        material: input.material ?? null,
        priceLocal: input.priceLocal ?? null,
        currency: input.currency ?? null,
        retailer: input.retailer ?? null,
        notes: input.notes ?? null,
        contributorName: input.contributorName ?? null,
        contributorEmail: input.contributorEmail ?? null,
        status: "pending",
      });
      return { id: Number(result[0].insertId), success: true };
    }),

  // List all submissions (for admin view)
  list: publicProcedure.query(async () => {
    const db = getDb();
    return db.select().from(submissions).orderBy(submissions.createdAt);
  }),

  // Create a contact message
  createMessage: publicProcedure
    .input(messageSchema)
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(messages).values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        body: input.body,
      });
      return { id: Number(result[0].insertId), success: true };
    }),
});

import { z } from 'zod'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

/**
 * Client-facing AppRouter type.
 *
 * The server router lives outside the frontend TypeScript project (api/ is
 * compiled via tsconfig.server.json), so the app project cannot import its
 * type directly. This file mirrors the public surface of api/router.ts for
 * type-checking the React client. Keep it in sync with api/router.ts.
 */
const t = initTRPC.create({ transformer: superjson })

export const appRouter = t.router({
  greeting: t.router({
    hello: t.procedure.query(() => '' as string),
  }),
  submission: t.router({
    create: t.procedure
      .input(
        z.object({
          brand: z.string(),
          productName: z.string(),
          country: z.string(),
          city: z.string().optional().nullable(),
          ply: z.number().optional().nullable(),
          scent: z.string().optional().nullable(),
          material: z.string().optional().nullable(),
          priceLocal: z.string().optional().nullable(),
          currency: z.string().optional().nullable(),
          retailer: z.string().optional().nullable(),
          notes: z.string().optional().nullable(),
          contributorName: z.string().optional().nullable(),
          contributorEmail: z.string().email().optional().nullable(),
        })
      )
      .mutation(() => ({ id: 0, success: true })),
    list: t.procedure.query(() => [] as Array<Record<string, unknown>>),
    createMessage: t.procedure
      .input(
        z.object({
          name: z.string(),
          email: z.string(),
          subject: z.string(),
          body: z.string(),
        })
      )
      .mutation(() => ({ id: 0, success: true })),
  }),
})

export type AppRouter = typeof appRouter

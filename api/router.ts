import { router } from "@/api/lib/trpc";
import { greetingRouter } from "@/api/routers/greeting";
import { submissionRouter } from "@/api/routers/submission";

export const appRouter = router({
  greeting: greetingRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof appRouter;

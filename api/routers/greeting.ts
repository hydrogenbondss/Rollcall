import { publicProcedure, router } from "@/api/lib/trpc";

export const greetingRouter = router({
  hello: publicProcedure.query(() => "Hello from Roll Call API"),
});

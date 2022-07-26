import * as trpc from '@trpc/server';
import { z } from 'zod';

const userSchema = z.object({ name: z.string().min(5) })
type UserT = z.infer<typeof userSchema>;

let fakeDB: UserT[] = [];

export const appRouter = trpc
  .router()
  .query('getUsers', {
    async resolve() {
      console.log('\n get \n')
      return fakeDB;
    },
  })
  .mutation('createUser', {
    // validate input with Zod
    input: userSchema,
    async resolve({ input }) {
      console.log('\n create \n')
      fakeDB = [...fakeDB, input];
    },
  })
  .mutation('clearUsers', {
    input: z.object({}),
    async resolve() {
      fakeDB = [];
      console.log('\n empty \n')
    },
  });
// only export *type signature* of router!
// to avoid accidentally importing your API
// into client-side code
export type AppRouter = typeof appRouter;

import { userRouter } from './user';
import { passwordRouter } from './password';
import { registerRouter } from './register';
import { router } from '../trpc';
import { receiptsRouter } from './receipts';

export const appRouter = router({
	password: passwordRouter,
	user: userRouter,
	register: registerRouter,
	receipts: receiptsRouter,
});

export type AppRouter = typeof appRouter;

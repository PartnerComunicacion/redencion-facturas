export { default } from 'next-auth/middleware';

export const config = {
	matcher: ['/perfil'],
	// matcher: ["/((?!register|api|login).*)"],
};

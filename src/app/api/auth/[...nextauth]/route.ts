import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'Crea tu cuenta',

			credentials: {
				email: {
					label: 'Correo electrónico',
					type: 'email',
				},
				password: { label: 'Contraseña', type: '********' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) return null;

				const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

				if (!isPasswordValid) return null;

				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, session, trigger }) {
			// console.log('jwt callback', { token, user, session });

			if (trigger === 'update' && session?.name) {
				token.name = session.name;
				token.lastName = session.lastName;
				token.idType = session.idType;
				token.personalId = session.personalId;
				token.phone = session.phone;
			}

			if (user) {
				return {
					...token,
					id: user.id,
					name: user.name,
					lastName: (user as any).lastName,
					idType: (user as any).idType,
					personalId: (user as any).personalId,
					phone: (user as any).phone,
				};
			}

			await prisma.user.update({
				where: { id: token.id as string },
				data: {
					name: token.name,
					lastName: token.lastName as string,
					idType: token.idType as string,
					personalId: token.personalId as string,
					phone: token.phone as string,
				},
			});

			return token;
		},
		async session({ session, token, user }) {
			// console.log('session callback', { session, token, user });

			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					name: token.name,
					lastName: token.lastName,
					idType: token.idType,
					personalId: token.personalId,
					phone: token.phone,
				},
			};

			// return session;
		},
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === 'development',
	pages: {
		signIn: '/inicio-sesion',
		error: '/api/auth/error',
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

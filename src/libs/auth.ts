import type { DefaultSession, NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/libs/prisma";
import { verifyPass } from "@/libs/password";
import { safeString } from "@/libs/safe-type";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user:
			| ({
					id: string;
					// role: string;
			  } & DefaultSession["user"])
			| null;
	}

	// interface User {
	// 	role: string;
	// }
}

declare module "next-auth/jwt" {
	interface JWT {
		user?: {
			id: string;
			// role: string;
		};
	}
}

export const nextAuthOptions: NextAuthOptions = {
	session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
	providers: [
		// GoogleProvider({
		// 	clientId: process.env.GOOGLE_CLIENT_ID ?? "",
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
		// }),
		CredentialsProvider({
			credentials: {
				email: {
					label: "Email",
					type: "email"
				},
				password: { label: "Password", type: "password" }
			},
			// メール認証処理
			async authorize(credentials) {
				if (credentials === undefined) {
					return null;
				}

				let user = null;

				try {
					user = await prisma.user.findUniqueOrThrow({
						where: { email: credentials.email }
					});

					if (user.password === null) {
						throw new Error();
					}

					if (!(await verifyPass(credentials.password, user.password))) {
						throw new Error();
					}
				} catch (e) {
					user = null;
				}

				if (user === null) {
					return null;
				}

				const userId = safeString(user.id);

				if (userId !== null) {
					return { id: userId, email: user.email };
				}

				return null;
			}
		})
	],
	pages: {
		signIn: "/signin"
	},
	callbacks: {
		jwt: async ({ token, user, account }) => {
			if (user !== undefined) {
				token.user = user;
			}

			if (account?.access_token !== undefined) {
				token.accessToken = account.access_token;
			}

			return token;
		},
		session: ({ session, token }) => {
			if (token.user !== undefined) {
				session.user = token.user;
			} else {
				session.user = null;
			}

			return {
				...session
			};
		}
	}
};

export const handler = NextAuth(nextAuthOptions);

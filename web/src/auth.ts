import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (credentials?.password === process.env.ADMIN_PASSWORD) {
                    return { id: "1", name: "Admin" };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.name = token.name;
            }
            return session;
        },
    },
});

import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "@/database";


export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "Custom Login",
      credentials: { 
        email: { label: "Correo:", type: "email", placeholder: "correo@google.com", },
        password: { label: "Contraseña:", type: "password", placeholder: "Contraseña", },
      },
      async authorize(credentials) {
        const user = await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password);
        if (user) {
          // Map the user object to the expected shape with an `id` property
          const { _id, email, role, name } = user;
          return { id: _id.toString(), email, role, name };
        }
        return null;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ...add more providers here
  ],

  //custom pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  session: {
    maxAge: 2592000, //30 dias
    strategy: 'jwt',
    updateAge: 86400, //cada dia
  },

  //Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      //console.log({ token, account, user });
       if(account) {
         token.accessToken = account.access_token;
         
         switch (account.type) {

          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '')

            break;
 
          case 'credentials':
            token.user = user
            break;
 
        }

       }

      return token;
    },
    async session({ session, token, user }) {
      //console.log({ session, token, user });
      // session.accessToken = token.accessToken || 'NO HAY ACCESS TOKEN'
      session.user = token as any;
      return session;
    },
  },
};
export default NextAuth(authOptions);

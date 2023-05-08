import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwt } from "./utils";
import { getToken } from "next-auth/jwt";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (req.nextUrl.pathname.startsWith("/api/admin") && !session) {
    const validRoles = ["admin", "super-user", "SEO"];

    if (!validRoles.includes(session.user.role)) {
      return new Response(JSON.stringify({ message: "No autorizado" }), {
        status: 401,
        headers: {
          "Content-Type": "Application/json",
        },
      });
    }
  }

  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = `p=${requestedPage}`;

    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const validRoles = ["admin", "super-user", "SEO"];

    if (!validRoles.includes(session.user.role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/checkout/summary", "/checkout/address", "/admin", "/api/admin"],
};

import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE_KEY = "ap_student_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

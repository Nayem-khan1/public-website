import { NextRequest, NextResponse } from "next/server";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  localeHeaderName,
} from "@/lib/i18n/config";

const TOKEN_COOKIE_KEY = "ap_student_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
  const { pathname, search } = request.nextUrl;
  const queryLocale = request.nextUrl.searchParams.get("lang");
  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isLocale(queryLocale)
    ? queryLocale
    : isLocale(cookieLocale)
      ? cookieLocale
      : defaultLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(localeHeaderName, locale);

  let response: NextResponse;

  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    response = NextResponse.redirect(loginUrl);
  } else if (pathname === "/login" && token) {
    response = NextResponse.redirect(new URL("/dashboard", request.url));
  } else {
    response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  response.cookies.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

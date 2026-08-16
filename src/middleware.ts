import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PREFIX = "/admin";
const PUBLIC_ADMIN = ["/admin/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  if (PUBLIC_ADMIN.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ss_admin_session")?.value;
  if (!token) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

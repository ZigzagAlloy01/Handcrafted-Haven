import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (!user) {
    return response;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isBlockedAdminRoute =
    pathname.startsWith("/cart") || pathname.startsWith("/contact");

  const isRegisterPage = pathname.startsWith("/register");
  const isLoginPage = pathname.startsWith("/login");

  if (isRegisterPage) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (isLoginPage) {
    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.redirect(new URL("/account", request.url));
  }

  if (profile?.role === "admin" && isBlockedAdminRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/cart/:path*", "/contact/:path*", "/register", "/login"],
};
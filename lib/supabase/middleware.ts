import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

const STUDENT_PREFIX = "/student";
const TEACHER_PREFIX = "/teacher";
const ADMIN_PREFIX = "/admin";

const PROTECTED_PREFIXES = [STUDENT_PREFIX, TEACHER_PREFIX, ADMIN_PREFIX];

/**
 * Refreshes the Supabase session on every request and enforces
 * route-level authentication + role checks before a single byte of a
 * protected page is rendered. This is the server-side backstop —
 * individual pages also re-check via lib/permissions, but a misconfigured
 * page should never be the only thing standing between a visitor and
 * protected content.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return supabaseResponse;
  }

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, suspended_at")
    .eq("id", user.id)
    .single();

  if (profile?.suspended_at) {
    return NextResponse.redirect(new URL("/account-suspended", request.url));
  }

  const role = profile?.role ?? "student";

  if (pathname.startsWith(TEACHER_PREFIX) && role !== "teacher" && role !== "admin") {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (pathname.startsWith(ADMIN_PREFIX) && role !== "admin") {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  if (pathname.startsWith(STUDENT_PREFIX) && role === "teacher") {
    // Teachers previewing student-facing content (lessons, drills) is an
    // intended free-tier flow, so student routes stay open to them —
    // only the reverse (student on teacher routes) is blocked above.
  }

  return supabaseResponse;
}

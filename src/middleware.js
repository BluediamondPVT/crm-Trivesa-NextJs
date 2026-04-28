import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_key"
);

const ROUTE_PERMISSIONS = {
  "/dashboard/super": ["superadmin"],
  "/dashboard/admin": ["superadmin", "admin"],
  "/dashboard/recruiter": ["superadmin", "admin", "recruiter"],
  "/dashboard/recruiter/recruiters": ["superadmin", "admin", "recruiter"],
  // Admin sub-routes
  "/dashboard/admin/add-client": ["superadmin", "admin"],
  "/dashboard/admin/clientpage": ["superadmin", "admin"],
  "/dashboard/admin/companies": ["superadmin", "admin"],
  "/dashboard/admin/company": ["superadmin", "admin"],
  "/dashboard/admin/edit-client": ["superadmin", "admin"],
  "/dashboard/admin/recruiters": ["superadmin", "admin"],
  // Protected API routes
  "/api/protected": ["superadmin", "admin", "recruiter"],
  // 🚀 FIX: Recruiter ko companies fetch karne ki permission di taaki Add Candidate page chale
  "/api/companies": ["superadmin", "admin", "recruiter"], 
  "/api/employees": ["superadmin", "admin", "recruiter"],
  "/api/users": ["superadmin", "admin"],
  "/dashboard/recruiter/companies": ["recruiter", "admin", "superadmin"],
  "/dashboard/recruiter/company": ["recruiter", "admin", "superadmin"],
};

function hasPermission(route, userRole) {
  for (const [pattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (route.startsWith(pattern)) {
      return allowedRoles.includes(userRole);
    }
  }
  return true;
}

async function verifyAuth(token) {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const method = request.method; 

  // 🚀 SMART FEATURE: Logged in user redirection
  if ((pathname === "/login" || pathname === "/dashboard" || pathname === "/") && token) {
    const payload = await verifyAuth(token);
    if (payload) {
      let redirectPath = "/dashboard";
      if (payload.role === "superadmin") redirectPath = "/dashboard/super";
      else if (payload.role === "admin") redirectPath = "/dashboard/admin";
      else if (payload.role === "recruiter") redirectPath = "/dashboard/recruiter";
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/api/protected") ||
    pathname.startsWith("/api/companies") ||
    pathname.startsWith("/api/employees") ||
    pathname.startsWith("/api/users");

  if (!isProtectedRoute) return NextResponse.next();

  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = await verifyAuth(token);

  if (!payload) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("token");
    return response;
  }

  const userRole = payload.role;

  // 🚀 DELETE PROTECTION: Sirf Super Admin delete kar sakta hai
  if (pathname.startsWith("/api/employees") && method === "DELETE") {
    if (userRole !== "superadmin") {
      return NextResponse.json(
        { success: false, message: "Access Denied: Only Super Admin can delete candidates" },
        { status: 403 }
      );
    }
  }

  if (!hasPermission(pathname, userRole)) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 🚀 Request headers modify karna taaki backend API ko x-user-id aur x-user-role mil sake
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.id);
  requestHeaders.set("x-user-role", payload.role);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/employees/:path*',
    '/api/companies/:path*',
    '/api/auth/me'
  ],
};
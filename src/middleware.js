import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if the user is logged in by looking for a token in localStorage
  // Note: localStorage is only available on the client-side, so we use cookies or headers for the server-side.

  const token = request.cookies.get("token"); // For example, token could be stored in cookies
  const url = request.url;

  // If token is present and the user is trying to access login or signup, redirect them to the dashboard
  if (token && (url.includes("/login") || url.includes("/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url)); // or any page you want to redirect to
  }

  // Allow other pages to continue if not logged in
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup"], // Apply this middleware to login and signup pages only
};

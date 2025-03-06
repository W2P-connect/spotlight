import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split("Bearer ")[1] || null;

  if (!token) {
    return { error: "No token provided", response: NextResponse.json({ message: "No token provided", success: false, data: null }, { status: 401 }) };
  }

  const supabase = await createClient();
  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { error: "User not authenticated", response: NextResponse.json({ message: "User not authenticated", error, success: false, data: null }, { status: 401 }) };
  }

  return { user: user.user };
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/v1/protected")) {
    const { user, response, error } = await authenticateUser(request);

    if (error) return response;

    const modifiedHeaders = new Headers(request.headers);

    if (user?.id) {
      modifiedHeaders.set("x-user-id", user.id);
    } else {
      return NextResponse.json({
        message: 'Unauthorized: user-id header is missing',
        data: [],
        success: false,
      }, { status: 401 });
    }

    return NextResponse.next({ request: { headers: modifiedHeaders } });
  }

  return await updateSession(request);
}


// Configuration : mise à jour de session pour tout sauf fichiers statiques/images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

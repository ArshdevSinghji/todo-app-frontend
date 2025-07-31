import { cookies } from "next/dist/server/request/cookies";
import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get("access_token")?.value;
  //   if (token) return NextResponse.next();
  //   return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  //   matcher: ["/home/:path*"],
};

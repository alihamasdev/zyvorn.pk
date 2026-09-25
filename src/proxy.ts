import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (session.user.role !== "admin" && request.nextUrl.pathname.startsWith("/dashboard")) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/account/:path*"],
};

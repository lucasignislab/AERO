import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    // Bypass for preview mode
    return NextResponse.next({
        request,
    });
}

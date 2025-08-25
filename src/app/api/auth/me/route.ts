// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // JWT format: header.payload.signature
    const payloadBase64 = token.split(".")[1];
    const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf8");
    const payload = JSON.parse(payloadJson);

    return NextResponse.json({
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    });
  } catch (err) {
    console.error("Failed to decode JWT", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_key"
);

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    
    // Cookie valid hai, toh frontend ko sirf basic details wapas bhej do
    return NextResponse.json({
      success: true,
      data: {
        userId: verified.payload.id,
        role: verified.payload.role,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
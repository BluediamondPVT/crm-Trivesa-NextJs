import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Please provide email and password" }, { status: 400 });
    }

    // .select("+password") zaroori hai login compare karne ke liye
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // Password match check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    // JWT Token Generate
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret_key", 
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      success: true,
      data: {
        token,
        role: user.role,
        userId: user._id,
        email: user.email 
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
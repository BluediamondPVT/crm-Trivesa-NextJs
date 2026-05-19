import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User"; 

export async function GET(request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const role = url.searchParams.get("role");

    const query = {};
    if (role) query.role = role;

    const users = await User.find(query)
      .select("email role")
      .sort({ email: 1 });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password, role } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists!" },
        { status: 400 }
      );
    }
    
    // Create new user (Schema will handle hashing automatically)
    const newUser = await User.create({
      email,
      password: password, 
      role: role || "recruiter", 
      isActive: true,
    });

    return NextResponse.json(
      { success: true, message: "Recruiter created successfully!", data: { _id: newUser._id, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
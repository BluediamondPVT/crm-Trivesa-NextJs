// src/app/api/employees/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";

export async function GET(request) {
  try {
    await dbConnect();
    
    // NAYA: URL se check karo ki kaun data maang raha hai
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    let query = {}; // By default admin ke liye sab fetch hoga

    // Agar recruiter hai, toh sirf uska khudka add kiya hua data dikhao
    if (role === "recruiter" && userId) {
      query = { addedBy: userId };
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 }).populate("addedBy", "email");
    return NextResponse.json({ success: true, data: employees });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}


export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const employee = await Employee.create(body);
    return NextResponse.json({ success: true, message: "Employee added successfully!", data: employee }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create employee" }, { status: 500 });
  }
}
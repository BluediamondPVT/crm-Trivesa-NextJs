// src/app/api/employees/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";

export async function GET() {
  try {
    await dbConnect();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
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
    return NextResponse.json(
      {
        success: true,
        message: "Employee added successfully!",
        data: employee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create employee" },
      { status: 500 },
    );
  }
}

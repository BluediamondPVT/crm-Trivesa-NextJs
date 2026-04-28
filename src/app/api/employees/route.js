// src/app/api/employees/route.js
export const dynamic = "force-dynamic"; // 🚀 NEXT.JS CACHING DISABLE (Har baar naya data layega)

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";

// 🚀 BINGO: Ye rahi wo magic line jo missing thi! Iske bina populate crash hota hai.
import User from "@/models/User"; 

export async function GET(request) {
  try {
    await dbConnect();
    
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    // 🚀 DEBUG LOG: Apne VS Code ke terminal mein check karo ye print ho raha hai ya nahi
    console.log("Headers check - ID:", userId, "Role:", userRole);

    if (!userId || !userRole) {
      console.log("❌ Error: API didn't get headers from middleware");
      // Agar header nahi hai, toh empty data bhej do crash karne ke bajaye
      return NextResponse.json({ success: true, data: [] });
    }

    let query = {}; 
    if (userRole === "recruiter") {
      query = { addedBy: userId };
    }

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .populate({ path: "addedBy", select: "email", strictPopulate: false });

    return NextResponse.json({ success: true, data: employees });
  } catch (error) {
    console.error("API CRASHED:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const userId = request.headers.get("x-user-id");
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing User ID" },
        { status: 401 },
      );
    }

    const employeeData = {
      ...body,
      addedBy: userId, // 🚀 Current user ki ID properly assign hogi
    };

    const employee = await Employee.create(employeeData);

    return NextResponse.json(
      {
        success: true,
        message: "Employee added successfully!",
        data: employee,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Employees Crash Detail:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create employee",
      },
      { status: 500 },
    );
  }
}
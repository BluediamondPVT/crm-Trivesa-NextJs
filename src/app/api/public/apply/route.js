import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const defaultUser = await User.findOne({ role: { $in: ["superadmin", "admin"] } });
    
    if (!defaultUser) {
       return NextResponse.json(
         { success: false, message: "System error: No admin user found to assign the lead." }, 
         { status: 500 }
       );
    }
 
    const candidateData = {
      ...data,
      status: "future",
      source: "Web Form", 
      addedBy: defaultUser._id,
    };

    const newCandidate = await Employee.create(candidateData);

    return NextResponse.json({ 
      success: true, 
      message: "Application submitted successfully!",
      data: newCandidate
    });
  } catch (error) {
    console.error("Public Form Submission Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
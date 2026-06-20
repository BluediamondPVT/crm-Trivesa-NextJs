import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WebLead from "@/models/WebLead";

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all records, sorted by newest first
    const leads = await WebLead.find({}).sort({ createdAt: -1 });

    // Return the data
    return NextResponse.json(
      { success: true, data: leads },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching web leads:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import WebLead from "@/models/WebLead";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const body = await req.json();

    // Find and update the lead
    const updatedLead = await WebLead.findByIdAndUpdate(
      id,
      { $set: body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedLead },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating web lead:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const deletedLead = await WebLead.findByIdAndDelete(id);

    if (!deletedLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Lead deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting web lead:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

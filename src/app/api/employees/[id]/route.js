// src/app/api/employees/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Employee from "@/models/Employee";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const employee = await Employee.findById(id);
    if (!employee)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );

    return NextResponse.json({ success: true, data: employee });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();

    // 1. Pehle purana employee data nikaalo taaki compare kar sakein
    const existingEmployee = await Employee.findById(id);
    if (!existingEmployee)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );

    // 2. LOGIC: Agar Status, Company, Process ya Remark change hua hai, toh history banao
    if (
      existingEmployee.status !== body.status ||
      existingEmployee.assignedCompanyId !== body.assignedCompanyId ||
      existingEmployee.assignedProcess !== body.assignedProcess ||
      existingEmployee.remark !== body.remark
    ) {
      const historyLog = {
        companyName:
          body.assignedCompanyName || existingEmployee.assignedCompanyName,
        process: body.assignedProcess || existingEmployee.assignedProcess,
        status: body.status || existingEmployee.status,
        remark: body.remark || "",
        date: new Date(),
      };

      // Ensure history array exists in body
      if (!body.assignmentHistory) {
        body.assignmentHistory = existingEmployee.assignmentHistory || [];
      }
      body.assignmentHistory.push(historyLog);
    }

    // 3. Naye data (aur history) ke sath DB update maar do
    const updatedEmployee = await Employee.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedEmployee)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );

    return NextResponse.json({
      success: true,
      message: "Updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee)
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 },
      );

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}

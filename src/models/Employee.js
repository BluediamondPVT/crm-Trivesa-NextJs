// src/models/Employee.js
import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    age: { type: String },
    qualification: { type: String },
    specialization: { type: String },
    skills: [{ type: String }], 
    experience: { type: String },
    lastSalary: { type: String },
    expectedSalary: { type: String },
    actualSalary: { type: String },
    source: { type: String },

    assignmentHistory: [
      {
        companyName: { type: String },
        process: { type: String },
        status: { type: String },
        remark: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],

    assignedCompanyId: { type: String },
    assignedCompanyName: { type: String },
    assignedProcess: { type: String },
    interviewDate: { type: String },
    remark: { type: String },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "LineUp",
        "Attendees",
        "Selected",
        "Rejected",
        "On Hold",
        "Joining",
        "Payout",
        "future",
      ],
      default: "LineUp",
    },
  },
  { timestamps: true },
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
export default Employee;

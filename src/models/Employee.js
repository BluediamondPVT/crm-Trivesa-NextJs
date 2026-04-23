// src/models/Employee.js
import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    age: { type: String },
    qualification: { type: String },
    specialization: { type: String },
    expertise: { type: String },
    experience: { type: String },
    lastSalary: { type: String },
    expectedSalary: { type: String },
    actualSalary: { type: String },

    assignedCompanyId: { type: String },
    assignedCompanyName: { type: String },
    assignedProcess: { type: String },
    interviewDate: { type: String },
    remark: { type: String },

    addedBy: { type: String },

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
      ],
      default: "LineUp",
    },
  },
  { timestamps: true },
);

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
export default Employee;

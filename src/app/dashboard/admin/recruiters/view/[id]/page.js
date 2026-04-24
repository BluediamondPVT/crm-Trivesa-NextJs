"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// Components Import
import EmployeeTopNav from "@/components/employee/EmployeeTopNav";
import ProfileHeader from "@/components/employee/ProfileHeader";
import ContactInfo from "@/components/employee/ContactInfo";
import ProfessionalDetailsView from "@/components/employee/ProfessionalDetailsView";
import PlacementAssignmentView from "@/components/employee/PlacementAssignmentView";
import PlacementHistoryTimeline from "@/components/employee/PlacementHistoryTimeline"; // <--- NAYA COMPONENT

export default function ViewEmployeePage() {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`/api/employees/${id}`);
        if (res.data.success) {
          setEmployee(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load candidate details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEmployee();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-[#092a49] mt-20">
        Loading Candidate Profile...
      </div>
    );

  if (!employee)
    return (
      <div className="p-10 text-center font-bold text-red-500 mt-20">
        Candidate not found!
      </div>
    );

  let formattedDate = "Not Scheduled";
  if (employee.interviewDate) {
    try {
      const dateObj = new Date(employee.interviewDate);
      if (!isNaN(dateObj))
        formattedDate = dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
    } catch (e) {}
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto mb-20">
      {/* 1. Top Navigation Component */}
      <EmployeeTopNav employeeId={employee._id} />

      {/* 2. Profile Header Component */}
      <ProfileHeader employee={employee} />

      {/* CANDIDATE SOURCE BADGE */}
      {employee.source && (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 shadow-sm transition-all hover:bg-indigo-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
            />
          </svg>
          <span className="text-xs font-bold tracking-wide uppercase opacity-80">
            Candidate Source:
          </span>
          <span className="text-sm font-black">{employee.source}</span>
        </div>
      )}

      {/* 3. Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex">
          <ContactInfo employee={employee} />
        </div>
        <div className="lg:col-span-2 flex">
          <ProfessionalDetailsView employee={employee} />
        </div>
        <div className="lg:col-span-3">
          <PlacementAssignmentView
            employee={employee}
            formattedDate={formattedDate}
          />
        </div>
      </div>

      {/* 4. Placement History Timeline Component (NAYA) */}
      <PlacementHistoryTimeline history={employee.assignmentHistory} />
    </div>
  );
}

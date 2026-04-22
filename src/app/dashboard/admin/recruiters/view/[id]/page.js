"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

export default function ViewEmployeePage() {
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-[#092a49] mt-20">
        Loading Candidate Profile...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-10 text-center font-bold text-red-500 mt-20">
        Candidate not found!
      </div>
    );
  }

  // FIX: Better Date Formatting Logic
  let formattedDate = "Not Scheduled";
  if (employee.interviewDate) {
    try {
      const dateObj = new Date(employee.interviewDate);
      if (!isNaN(dateObj)) {
        formattedDate = dateObj.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      }
    } catch (e) {
      console.error("Date formatting error", e);
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto mb-20">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#1d4ed8] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back to List
        </button>
        <Link href={`/dashboard/admin/recruiters/edit/${employee._id}`}>
          <button className="bg-[#1d4ed8] text-white cursor-pointer px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#1e40af] shadow-md transition-all flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit Profile
          </button>
        </Link>
      </div>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border-l-8 border-[#092a49] p-6 sm:p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            {employee.name}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Candidate ID: {employee._id}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
            Current Status
          </span>
          <span
            className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full border 
            ${employee.status === "Selected" ? "bg-green-50 text-green-700 border-green-200" : ""}
            ${employee.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
            ${employee.status === "Attendees" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
            ${employee.status === "LineUp" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
            ${employee.status === "On Hold" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
          `}
          >
            {employee.status}
          </span>
        </div>
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-6 border-b border-gray-50 pb-3">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-3.903-7.161-6.911l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Phone Number
                </p>
                <p className="font-bold text-gray-800">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Email Address
                </p>
                <p className="font-bold text-gray-800">
                  {employee.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">
                  Location / Address
                </p>
                <p className="font-bold text-gray-800">
                  {employee.address || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-6 border-b border-gray-50 pb-3">
            Professional Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Experience
              </span>
              <span className="font-bold text-[#092a49]">
                {employee.experience || "Fresher / N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <span className="text-xs font-bold text-gray-500 uppercase">
                Last Salary
              </span>
              <span className="font-bold text-[#092a49]">
                ₹ {employee.lastSalary || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#e6f4ff] p-3 rounded-lg border border-blue-100">
              <span className="text-xs font-bold text-blue-800 uppercase">
                Expected Salary
              </span>
              <span className="font-extrabold text-[#1d4ed8]">
                ₹ {employee.expectedSalary || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Placement Info (Full Width) */}
        <div className="lg:col-span-2 bg-[#f8fafc] rounded-2xl shadow-sm border border-blue-100 p-6">
          <h2 className="text-sm font-bold text-blue-800 tracking-wider uppercase mb-6 border-b border-blue-200 pb-3">
            Placement Assignment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                Target Company
              </p>
              <p className="text-xl font-extrabold text-[#092a49]">
                {employee.assignedCompanyName || "Not Assigned"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                Process / Opening
              </p>
              <p className="text-xl font-bold text-gray-800">
                {employee.assignedProcess || "N/A"}
              </p>
            </div>

            {/* Interview Date Info */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                Interview Date
              </p>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                <p
                  className={`text-base font-bold ${employee.interviewDate ? "text-blue-700" : "text-gray-400 italic"}`}
                >
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Conditional Remark Viewer for On Hold */}
            {employee.status === "On Hold" && employee.remark && (
              <div className="md:col-span-3 mt-4 p-5 bg-yellow-50/80 border border-yellow-200 rounded-xl">
                <p className="text-xs font-bold text-yellow-700 tracking-wider uppercase mb-2 flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                    />
                  </svg>
                  Hold Reason (Remark)
                </p>
                <p className="text-sm font-bold text-yellow-900">
                  {employee.remark}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

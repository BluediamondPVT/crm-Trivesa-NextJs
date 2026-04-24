"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";

// Components Import
import ProfileHeader from "@/components/employee/ProfileHeader";
import ContactInfo from "@/components/employee/ContactInfo";
import ProfessionalDetailsView from "@/components/employee/ProfessionalDetailsView";
import PlacementAssignmentView from "@/components/employee/PlacementAssignmentView";

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

      <ProfileHeader employee={employee} />

      {/* Grid Layout Fix: Top boxes equal height, Bottom box full width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Contact) - Flex ensure it stretches */}
        <div className="lg:col-span-1 flex">
          <ContactInfo employee={employee} />
        </div>

        {/* Right Column (Professional Details) - Flex ensure it stretches */}
        <div className="lg:col-span-2 flex">
          <ProfessionalDetailsView employee={employee} />
        </div>

        {/* Bottom Row (Placement Assignment) - Takes full width of the 3 columns */}
        <div className="lg:col-span-2">  {/* YAHAN 2 KI JAGAH 3 KARNA HAI */}
          <PlacementAssignmentView
            employee={employee}
            formattedDate={formattedDate}
          />
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-bold text-[#092a49] border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Placement History / Journey
        </h2>

        {employee.assignmentHistory && employee.assignmentHistory.length > 0 ? (
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 mt-4">
            {/* Hum history ko ulta (reverse) karke dikhayenge taaki latest upar aaye */}
            {[...employee.assignmentHistory].reverse().map((history, index) => (
              <div key={index} className="relative pl-6">
                {/* Timeline Dot */}
                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  history.status === "Selected" || history.status === "Joining" ? "bg-green-500" :
                  history.status === "Rejected" ? "bg-red-500" :
                  "bg-blue-500"
                }`}></span>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                    <h3 className="font-bold text-gray-800 text-base">
                      {history.companyName || "N/A"} <span className="text-gray-400 font-normal text-sm">| {history.process || "No Process Assigned"}</span>
                    </h3>
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-md w-fit
                      ${history.status === "Selected" || history.status === "Joining" ? "bg-green-100 text-green-700" : 
                        history.status === "Rejected" ? "bg-red-100 text-red-700" : 
                        "bg-blue-100 text-blue-700"}`}
                    >
                      {history.status}
                    </span>
                  </div>
                  
                  {/* NAYA: INTERVIEW DATE DIKHANE KA LOGIC */}
                  {history.interviewDate && (
                    <p className="text-sm text-blue-700 mb-2 font-bold flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                      </svg>
                      Interview: {new Date(history.interviewDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  
                  {/* UPDATE TIME (System update kab hua tha) */}
                  <p className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    Updated on: {new Date(history.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {history.remark && (
                    <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">Remark:</span> {history.remark}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="font-medium text-gray-500">No history available yet.</p>
            <p className="text-xs mt-1">Future status or company assignment changes will be recorded here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

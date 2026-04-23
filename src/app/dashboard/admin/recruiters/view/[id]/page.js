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
        <div className="lg:col-span-2">
          <PlacementAssignmentView
            employee={employee}
            formattedDate={formattedDate}
          />
        </div>
      </div>
    </div>
  );
}

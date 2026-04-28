// src/components/employee/EmployeeTopNav.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployeeTopNav({ employeeId }) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  // 🚀 NAYA: Role fetch karo taaki Edit link sahi bane
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) {
          setUserRole(data.data.role);
        }
      } catch (error) {
        console.error("Failed to fetch role", error);
      }
    };
    fetchRole();
  }, []);

  // 🚀 DYNAMIC PATH LOGIC
  // Agar recruiter hai toh recruiter wala path, warna admin wala
  const editPath = userRole === "recruiter" 
  ? `/dashboard/recruiter/recruiters/edit/${employeeId}` 
  : `/dashboard/admin/recruiters/edit/${employeeId}`;

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-sm font-semibold text-gray-500 hover:text-[#1d4ed8] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to List
      </button>
      
      {/* 🚀 Dynamic Link use kar rahe hain */}
      <Link href={editPath}>
        <button className="bg-[#1d4ed8] text-white cursor-pointer px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#1e40af] shadow-md transition-all flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Edit Profile
        </button>
      </Link>
    </div>
  );
}
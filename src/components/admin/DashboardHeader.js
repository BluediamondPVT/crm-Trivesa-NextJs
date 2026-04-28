import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardHeader() {
  const [userRole, setUserRole] = useState(null);

  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.data?.role) {
          setUserRole(data.data.role);
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    };
    fetchUserRole();
  }, []); // <-- Ye Khali array bahut zaroori hai!

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
      <div>
        <h1 className="text-3xl font-bold text-[#092a49]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your system performance</p>
      </div>

      {/* Sirf Admin aur Superadmin ko dikhega */}
      {userRole && userRole !== "recruiter" && (
        <Link
          href="/dashboard/admin/add-client"
          className="bg-[#183e61] inline-block text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#061a2e] shadow-sm transition-colors"
        >
          + Add Clients
        </Link>
      )}
    </div>
  );
}
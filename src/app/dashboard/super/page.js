"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚀 NAYA SECURE WAY: Server se user data fetch karo cookie ke through
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch superadmin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // 🗑️ handleLogout aur Sidebar logic yahan se hata di hai
  // kyunki wo Layout.js aur Sidebar.js mein handle ho rahi hai.

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold text-[#092a49] tracking-tight">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            System overview and master management control.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Admins */}
        <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-blue-600 p-6 flex justify-between items-center transform hover:scale-[1.02] transition-all">
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
              Total Admins
            </p>
            <h3 className="text-4xl font-black text-gray-800">5</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Employees */}
        <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-green-600 p-6 flex justify-between items-center transform hover:scale-[1.02] transition-all">
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
              Total Candidates
            </p>
            <h3 className="text-4xl font-black text-gray-800">150</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Projects */}
        <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-purple-600 p-6 flex justify-between items-center transform hover:scale-[1.02] transition-all">
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
              Active Clients
            </p>
            <h3 className="text-4xl font-black text-gray-800">12</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v14.25A2.25 2.25 0 0 0 5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V6.75A2.25 2.25 0 0 0 18.75 4.5H5.25A2.25 2.25 0 0 0 3 6.75V19.5"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Positions */}
        <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-orange-600 p-6 flex justify-between items-center transform hover:scale-[1.02] transition-all">
          <div>
            <p className="text-xs font-bold text-gray-500 tracking-wider mb-2 uppercase">
              Open Roles
            </p>
            <h3 className="text-4xl font-black text-gray-800">28</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.15v4.25c0 1.094-.896 1.975-1.975 1.975H5.725a1.975 1.975 0 0 1-1.975-1.975V14.15M8.25 9.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5M6 9.75h12A2.25 2.25 0 0 1 20.25 12v.008c0 1.242-1.008 2.242-2.25 2.242H6c-1.242 0-2.242-1.00-2.242-2.242V12c0-1.242 1.00-2.242 2.242-2.242Z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Privileges Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#092a49] rounded-2xl flex items-center justify-center text-white shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#092a49]">
            Master Control Center
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              "Audit logs & full system activity tracking",
              "Manage enterprise-level admin accounts",
              "Global candidate & employee database control",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 font-bold text-sm tracking-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              "System-wide analytics and financial reporting",
              "Advanced role-based permission management",
              "Full access to hiring pipeline configurations",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-blue-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span className="text-gray-700 font-bold text-sm tracking-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Banner */}
        <div className="mt-12 p-6 bg-[#1d4ed8] rounded-2xl shadow-xl flex items-center gap-5">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-black text-lg">
              Logged in Securely
            </h4>
            <p className="text-blue-100 text-sm font-medium">
              Admin session verified for:{" "}
              <span className="font-bold underline">{user?.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

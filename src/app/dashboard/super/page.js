"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const authChecked = useRef(false);

  useEffect(() => {
    // Only check auth once to prevent re-redirects on browser back
    if (authChecked.current) return;
    authChecked.current = true;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token or wrong role, redirect to login using replace (doesn't add to history)
    if (!token || role !== "superadmin") {
      router.replace("/");
      return;
    }

    // Simulate user data fetch
    setUser({ email: "superadmin@trivesa.com", role: "superadmin" });
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    authChecked.current = false; // Reset for next login
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f4]">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8f6f4]">
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:text-[#092a49] hover:bg-gray-100 rounded-lg focus:outline-none"
            >
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <span className="text-lg font-bold text-[#092a49]">
              Trivesa CRM
            </span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
              <div>
                <h1 className="text-3xl font-bold text-[#092a49]">
                  Super Admin Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  System overview and management
                </p>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-blue-500 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
                    Total Admins
                  </p>
                  <h3 className="text-4xl font-bold text-gray-800">5</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72v-3.5a3 3 0 0 0-3-3h-.15M9 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM9 12a6 6 0 0 0-6 6v.75a3.75 3.75 0 0 0 3.75 3.75h4.5a3.75 3.75 0 0 0 3.75-3.75V18a6 6 0 0 0-6-6z"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-green-500 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
                    Total Employees
                  </p>
                  <h3 className="text-4xl font-bold text-gray-800">150</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 7.121-3.46m-9.746 6.216a9.375 9.375 0 0 1-12.561-3.83m19.19-13.196a9.375 9.375 0 0 1-9.191 16.506 9.375 9.375 0 0 1-6.319-15.066"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-purple-500 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
                    Active Projects
                  </p>
                  <h3 className="text-4xl font-bold text-gray-800">12</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 18 4.5h-2.25A2.25 2.25 0 0 0 13.5 6.75v11.25A2.25 2.25 0 0 0 15.75 20.25z"
                    />
                  </svg>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-orange-500 p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">
                    Open Positions
                  </p>
                  <h3 className="text-4xl font-bold text-gray-800">28</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m0 0C5.25 5.089 8.25 4.5 12 4.5c3.75 0 6.75.589 8.25 1.875"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-[#092a49] mb-6">
                Super Admin Privileges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">Manage all Admins</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Full Employee Management
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      System Configuration & Settings
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Advanced Reports & Analytics
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      Audit Logs & Activity Tracking
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                        className="w-4 h-4 text-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">
                      User Roles & Permissions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <p className="text-purple-800">
                <strong>👑 Full System Access:</strong> You are logged in as{" "}
                <strong>{user?.email}</strong> with complete administrative
                control.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

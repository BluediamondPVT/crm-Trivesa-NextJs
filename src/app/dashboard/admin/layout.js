// src/app/dashboard/admin/layout.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const authChecked = useRef(false);

useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Agar token nahi hai, ya role in teeno mein se koi nahi hai, toh bahar pheko
    if (!token || (role !== "admin" && role !== "superadmin" && role !== "recruiter")) {
      router.replace("/");
    } else {
      // YAHAN FIX HAI: Apna sahi variable name use karo (jyadatar setLoading hota hai)
      setLoading(false); 
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    authChecked.current = false;
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f4]">
        <div className="text-2xl font-semibold text-gray-700">
          Loading Admin...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f6f4]">
      {/* Sidebar Component remains fixed across all sub-pages */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header remains fixed */}
        <header className="md:hidden bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu" // <--- Ye zaroori hai
              className="p-2 -ml-2 text-white bg-[#092a49] hover:bg-[#0680d9] rounded-lg focus:outline-none transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
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

        {/* Scrollable Main Content (This is where page.js is injected) */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

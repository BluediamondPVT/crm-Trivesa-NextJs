"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Sidebar from "@/components/Sidebar";

export default function SuperAdminLayout({ children }) {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Sirf superadmin ko yahan allow karna hai
    if (!token || role !== "superadmin") {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f4]">
        <div className="w-8 h-8 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f6f4] overflow-hidden">
      {/* Sidebar Component */}
      {/* <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      /> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0">
          <span className="font-bold text-[#092a49] text-lg">Super Admin</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
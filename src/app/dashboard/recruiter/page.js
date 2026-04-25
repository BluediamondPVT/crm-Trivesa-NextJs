"use client";

import { useState, Suspense } from "react"; // <--- NAYA: Suspense import kiya
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function RecruiterDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* MAGIC FIX: Sidebar ko Suspense mein wrap kar diya */}
      <Suspense fallback={<div className="w-64 h-screen bg-[#092a49] hidden md:block">Loading Menu...</div>}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          handleLogout={handleLogout}
        />
      </Suspense>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shrink-0 shadow-sm z-30">
          <span className="font-extrabold text-[#092a49] text-lg tracking-wide">CRM Dashboard</span>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 text-gray-600 hover:text-[#092a49] focus:outline-none transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        {/* Actual Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#1d4ed8]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-[#092a49] mb-4">
              Welcome, Recruiter!
            </h1>
            
            <p className="text-gray-500 max-w-md leading-relaxed font-medium">
              Your dedicated dashboard is currently under construction. Stay tuned for updates! In the meantime, use the sidebar to manage your candidate pipeline.
            </p>
          </div>
        </main>
        
      </div>
    </div>
  );
}
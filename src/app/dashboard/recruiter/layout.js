// src/app/dashboard/recruiter/layout.js
"use client";

import { useState, Suspense } from "react"; 
import Sidebar from "@/components/Sidebar";

export default function RecruiterLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8f6f4]">
      {/* 🚀 MAGIC FIX: Sidebar ko Suspense mein wrap kiya */}
      <Suspense fallback={<div className="w-64 bg-[#092a49] h-full animate-pulse" />}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Suspense>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm border-b border-gray-100 flex items-center justify-between px-4 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
              className="p-2 -ml-2 text-white bg-[#092a49] hover:bg-[#0680d9] rounded-lg focus:outline-none transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <span className="text-lg font-bold text-[#092a49]">
              Trivesa CRM
            </span>
          </div>
        </header>

        {/* 🚀 MAGIC FIX: Children ko bhi Suspense de diya taaki pages bhi safe rahein */}
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div></div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
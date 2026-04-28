// src/app/dashboard/super/layout.js
"use client";

import { useState, Suspense } from "react"; // 🚀 Suspense import kiya
import Sidebar from "@/components/Sidebar";

export default function SuperAdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8f6f4] overflow-hidden">
      {/* 🚀 MAGIC FIX: Sidebar ko Suspense mein wrap kiya */}
      <Suspense fallback={<div className="w-64 bg-[#092a49] h-full animate-pulse" />}>
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Suspense>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 shrink-0">
          <span className="font-bold text-[#092a49] text-lg uppercase tracking-wider">
            Super Admin
          </span>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 text-white bg-[#092a49] rounded-lg hover:bg-[#1d4ed8] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </header>

        {/* 🚀 MAGIC FIX: Children ko Suspense mein wrap kiya */}
        <main className="flex-1 overflow-y-auto w-full">
          <Suspense fallback={<div className="p-10 flex justify-center"><div className="w-8 h-8 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div></div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
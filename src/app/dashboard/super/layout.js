// src/app/dashboard/super/layout.js
"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function SuperAdminLayout({ children }) {
  // Sidebar ki state handle karne ke liye
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * 🚀 KYA UPDATE HUA HAI:
   
   * 2. Loading state delete kar di hai taaki UI instantly load ho.
   * 3. Middleware (src/middleware.js) ab automatically check karega ki yahan 
   * sirf "superadmin" hi enter kare.
   * 4. Sidebar ab standalone hai, wo apna logout khud handle karta hai.
   */

  return (
    <div className="flex h-screen bg-[#f8f6f4] overflow-hidden">
      {/* Sidebar Component: Ab isme handleLogout pass karne ki zarurat nahi hai */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Mobile Header: Sirf choti screens ke liye */}
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

        {/* Page Content: Yahan tere dashboard ke baaki pages inject honge */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function MetricsGrid({ counts }) {
  const [userRole, setUserRole] = useState(null);

  // 🚀 MAGIC: Component load hote hi check karo user kaun hai
  useEffect(() => {
    const fetchRole = async () => {
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
    fetchRole();
  }, []);

  // 🚀 DYNAMIC PATH LOGIC: Role ke hisaab se path badal do
  const basePath = userRole === "recruiter" ? "/dashboard/recruiter" : "/dashboard/admin";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-10">
      
      {/* 1. Total Clients (No Link) */}
      <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-[#092a49] p-5 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Total Clients
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{counts.total}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#092a49] shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
      </div>

      {/* 2. Active */}
      <Link
        href={`${basePath}/companies/active`}
        className="bg-white rounded-2xl shadow-sm border-l-[6px] border-green-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
      >
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Active
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{counts.active}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
      </Link>

      {/* 3. Non Active */}
      <Link
        href={`${basePath}/companies/non-active`}
        className="bg-white rounded-2xl shadow-sm border-l-[6px] border-red-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
      >
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Non Active
          </p>
          <h3 className="text-3xl font-bold text-gray-800">
            {counts.nonActive}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
          </svg>
        </div>
      </Link>

      {/* 4. Process */}
      <Link
        href={`${basePath}/companies/process`}
        className="bg-white rounded-2xl shadow-sm border-l-[6px] border-orange-400 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
      >
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Process
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{counts.process}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
      </Link>

      {/* 5. Listed */}
      <Link
        href={`${basePath}/companies/listed`}
        className="bg-white rounded-2xl shadow-sm border-l-[6px] border-blue-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
      >
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Listed
          </p>
          <h3 className="text-3xl font-bold text-gray-800">{counts.listed}</h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
      </Link>

      {/* 6. Active Jobs (No Link) */}
      <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-purple-500 p-5 flex justify-between items-center hover:-translate-y-1 hover:shadow-md transition-all duration-200">
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Active Jobs
          </p>
          <h3 className="text-3xl font-bold text-gray-800">
            {counts.activeOpenings}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.896 1.975-1.975 1.975H5.725a1.975 1.975 0 0 1-1.975-1.975V14.15M8.25 9.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5M6 9.75h12A2.25 2.25 0 0 1 20.25 12v.008c0 1.242-1.008 2.242-2.25 2.242H6c-1.242 0-2.242-1.00-2.242-2.242V12c0-1.242 1.00-2.242 2.242-2.242Z" />
          </svg>
        </div>
      </div>

      {/* 7. Expired Jobs (No Link) */}
      <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-slate-400 p-5 flex justify-between items-center hover:-translate-y-1 hover:shadow-md transition-all duration-200">
        <div>
          <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
            Expired Jobs
          </p>
          <h3 className="text-3xl font-bold text-gray-800">
            {counts.nonActiveOpenings}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useSearchParams,useRouter } from "next/navigation";

// Components
import DashboardHeader from "@/components/recruiter/DashboardHeader";
import MetricsMatrix from "@/components/recruiter/MetricsMatrix";
import TabsFilter from "@/components/recruiter/TabsFilter";
import EmployeeTable from "@/components/recruiter/EmployeeTable";
import RemarkModal from "@/components/recruiter/RemarkModal";

function RecruiterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");

  const tabs = ["All", "LineUp", "Attendees", "On Hold", "Selected", "Joining", "Rejected", "Payout","future"];
  
  const isCandidateView = tabFromUrl && tabs.includes(tabFromUrl);
  const activeTab = isCandidateView ? tabFromUrl : "LineUp";

  const setActiveTab = (newTab) => {
    router.push(`/dashboard/recruiter?tab=${newTab}`);
  };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isCandidateView) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/employees`);
        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load your candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [isCandidateView]);

  useEffect(() => {
    if (isCandidateView) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success) setUserData(data.data);
      } catch (error) {
        console.error("Failed to fetch user");
      }
    };
    fetchUser();
  }, [isCandidateView]);

  const filteredByDate = dateFilter === "All" ? employees : employees.filter(emp => {
    const empDate = new Date(emp.createdAt).getTime();
    const today = new Date().setHours(0,0,0,0);
    if (dateFilter === "Today") return empDate >= today;
    if (dateFilter === "Yesterday") return empDate >= (today - 86400000) && empDate < today;
    return true;
  });

  const getCounts = () => {
    const counts = { All: filteredByDate.length, LineUp: 0, Attendees: 0, "On Hold": 0, Selected: 0, Rejected: 0, Joining: 0, Payout: 0, future: 0 };
    filteredByDate.forEach(emp => { if (counts[emp.status] !== undefined) counts[emp.status]++; });
    return counts;
  };

  const tableData = activeTab === "All" ? filteredByDate : filteredByDate.filter(emp => emp.status === activeTab);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between bg-white border-b p-4 shadow-sm z-30">
          <span className="font-bold text-[#092a49]">Recruiter CRM</span>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          
          {isCandidateView ? (
            <>
              {/* 🚀 DashboardHeader ko bhi role pass karna zaroori hai (agar nahi kiya ho toh) */}
              <DashboardHeader role="recruiter" dateFilter={dateFilter} setDateFilter={setDateFilter} handleDownload={() => {}} />
             <MetricsMatrix counts={getCounts()} activeTab={activeTab} setActiveTab={setActiveTab} />
             <TabsFilter tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              
              {/* 🚀 NAYA FIX: EmployeeTable ko role pass kiya! */}
              <EmployeeTable 
                filteredData={tableData} 
                loading={loading} 
                activeTab={activeTab} 
                setSelectedRemark={setSelectedRemark} 
                role="recruiter" 
              />
              
              <RemarkModal selectedRemark={selectedRemark} onClose={() => setSelectedRemark(null)} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-[#1d4ed8]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-black text-[#092a49] mb-4">
                Welcome, {userData?.role || "Recruiter"}!
              </h1>
              
              <p className="text-gray-500 max-w-md leading-relaxed font-medium mb-6">
                Your personal dashboard is active. Use the <strong>Candidates</strong> menu in the sidebar to manage your pipeline, add new leads, and track their status.
              </p>

              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                System Access Verified
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <RecruiterContent />
    </Suspense>
  );
}
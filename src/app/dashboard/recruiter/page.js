"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useSearchParams, useRouter } from "next/navigation";

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

  const tabs = [
    "All",
    "LineUp",
    "Attendees",
    "On Hold",
    "Selected",
    "Joining",
    "Rejected",
    "Payout",
    "future",
    "Abscond"
  ];

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

  // 🚀 NAYA: Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  // 🚀 NAYA: Debounce Logic (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ====== FILTERING LOGIC ======
  let filteredData = employees;

  // 1. DATE FILTER
  if (dateFilter !== "All") {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    filteredData = filteredData.filter((emp) => {
      const empDate = new Date(emp.createdAt).getTime();

      if (dateFilter === "Today") {
        return empDate >= today;
      } else if (dateFilter === "Yesterday") {
        const yesterday = today - 24 * 60 * 60 * 1000;
        return empDate >= yesterday && empDate < today;
      } else if (dateFilter === "7Days") {
        const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;
        return empDate >= sevenDaysAgo;
      } else if (dateFilter === "30Days") {
        const thirtyDaysAgo = today - 30 * 24 * 60 * 60 * 1000;
        return empDate >= thirtyDaysAgo;
      }
      return true;
    });
  }

  // 2. 🚀 NAYA: ULTIMATE GLOBAL DEEP SEARCH FILTER (Debounced)
  if (debouncedSearch.trim() !== "") {
    const lowerSearch = debouncedSearch.toLowerCase();
    filteredData = filteredData.filter((emp) => {
      const searchString = [
        emp.name,
        emp.email,
        emp.phone,
        emp.address,
        emp.age,
        emp.qualification,
        emp.specialization,
        emp.experience,
        emp.lastSalary,
        emp.expectedSalary,
        emp.actualSalary,
        emp.source,
        emp.assignedCompanyName,
        emp.assignedProcess,
        emp.remark,
        emp.status,
        ...(emp.skills || []),
        ...(emp.assignmentHistory?.map(
          (h) => `${h.companyName} ${h.process} ${h.status} ${h.remark}`,
        ) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchString.includes(lowerSearch);
    });
  }

  // 3. TAB FILTER (For Table Only)
  const tableData =
    activeTab === "All"
      ? filteredData
      : filteredData.filter((emp) => emp.status === activeTab);

  const getCounts = () => {
    const counts = {
      All: filteredData.length,
      LineUp: 0,
      Attendees: 0,
      "On Hold": 0,
      Selected: 0,
      Rejected: 0,
      Joining: 0,
      Payout: 0,
      future: 0,
      Abscond: 0,
    };
    filteredData.forEach((emp) => {
      if (counts[emp.status] !== undefined) counts[emp.status]++;
    });
    return counts;
  };

  // ====== EXCEL EXPORT LOGIC ======
  const handleDownloadExcel = () => {
    if (!tableData || tableData.length === 0) {
      toast.error("No data available to download!");
      return;
    }

    const excelData = tableData.map((emp) => {
      let recruiterName = "N/A";
      if (emp.addedBy && emp.addedBy.email) {
        recruiterName = emp.addedBy.email.split("@")[0];
      } else if (typeof emp.addedBy === "string") {
        recruiterName = emp.addedBy;
      }

      return {
        "Candidate Name": emp.name || "N/A",
        "Phone Number": emp.phone || "N/A",
        "Email Address": emp.email || "N/A",
        Source: emp.source || "N/A",
        "Assigned Company": emp.assignedCompanyName || "N/A",
        "Job Process": emp.assignedProcess || "N/A",
        Status: emp.status || "N/A",
        "Added By (Recruiter)": recruiterName,
        "Date Added": new Date(emp.createdAt).toLocaleDateString("en-IN"),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    const colWidths = [
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates_Report");
    XLSX.writeFile(
      workbook,
      `Recruitment_Report_${dateFilter}_${activeTab}.xlsx`,
    );

    toast.success("Detailed Excel Report Exported!");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between bg-white border-b p-4 shadow-sm z-30">
          <span className="font-bold text-[#092a49]">Recruiter CRM</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600"
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
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 relative">
          {isCandidateView ? (
            <>
              <DashboardHeader
                role="recruiter"
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                handleDownload={handleDownloadExcel}
              />

              <MetricsMatrix
                counts={getCounts()}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              {/* 🚀 NAYA: Global Search Bar (Right Aligned / End) */}
              <div className="mb-6 flex flex-col items-end animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, phone, skills, salary..."
                    className="w-full p-4 pl-12 text-base font-medium text-[#092a49] bg-white border-2 border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-300 focus:bg-blue-50/30 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all duration-300 placeholder-gray-400 tracking-wide"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <TabsFilter
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                counts={getCounts()}
              />

              <EmployeeTable
                filteredData={tableData}
                loading={loading}
                activeTab={activeTab}
                setSelectedRemark={setSelectedRemark}
                role="recruiter"
              />

              <RemarkModal
                selectedRemark={selectedRemark}
                onClose={() => setSelectedRemark(null)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-[#1d4ed8]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-[#092a49] mb-4">
                Welcome, {userData?.role || "Recruiter"}!
              </h1>

              <p className="text-gray-500 max-w-md leading-relaxed font-medium mb-6">
                Your personal dashboard is active. Use the{" "}
                <strong>Candidates</strong> menu in the sidebar to manage your
                pipeline, add new leads, and track their status.
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
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RecruiterContent />
    </Suspense>
  );
}

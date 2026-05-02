"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useSearchParams } from "next/navigation";

// Component Imports
import DashboardHeader from "@/components/recruiter/DashboardHeader";
import MetricsMatrix from "@/components/recruiter/MetricsMatrix";
import TabsFilter from "@/components/recruiter/TabsFilter";
import EmployeeTable from "@/components/recruiter/EmployeeTable";
import RemarkModal from "@/components/recruiter/RemarkModal";

export default function RecruiterDashboard() {
  const searchParams = useSearchParams();
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
  ];

  const initialTab =
    tabFromUrl && tabs.includes(tabFromUrl) ? tabFromUrl : "LineUp";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRemark, setSelectedRemark] = useState(null);

  const [userRole, setUserRole] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");

  // 🚀 NAYA: Search State & Debounce State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const authRes = await fetch("/api/auth/me");
        const authData = await authRes.json();

        if (authData.success && authData.data?.role) {
          setUserRole(authData.data.role);
        }

        const res = await axios.get("/api/employees");

        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (error) {
        toast.error("Failed to load candidates data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🚀 NAYA: Debounce Logic (300ms delay)
  // Isse performance mast rehti hai kyunki har ek letter type hone par filter function nahi chalta.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer); // Cleanup timeout agar user jaldi type kar raha ho
  }, [searchTerm]);

  // ====== FILTERING LOGIC ======
  let filteredData = employees;

  // 1. DATE FILTER
  if (dateFilter !== "All") {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
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

  // 2. 🚀 ULTIMATE GLOBAL DEEP SEARCH FILTER (Debounced)
  if (debouncedSearch.trim() !== "") {
    const lowerSearch = debouncedSearch.toLowerCase();
    filteredData = filteredData.filter((emp) => {
      // 🚀 MAGIC: Candidate ka saara zinda data ek string mein jod do
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
        ...(emp.skills || []), // Array ko bhi check karega
        ...(emp.assignmentHistory?.map(
          (h) => `${h.companyName} ${h.process} ${h.status} ${h.remark}`
        ) || []), // Purani placement history mein bhi search karega!
      ]
        .filter(Boolean) // Jo fields khali (null/undefined) hain unko hata dega
        .join(" ")       // Sabko ek line mein jod dega
        .toLowerCase();

      // Ab check karega ki jo tune type kiya, wo us badi string mein kahin bhi hai ya nahi
      return searchString.includes(lowerSearch);
    });
  }

  // 3. TAB FILTER (For Table Only)
  let tableFilteredData = filteredData;
  if (activeTab !== "All") {
    tableFilteredData = tableFilteredData.filter(
      (emp) => emp.status === activeTab
    );
  }

  // Counts update honge based on Date AND Search Filter
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
    };
    filteredData.forEach((emp) => {
      if (counts[emp.status] !== undefined) counts[emp.status]++;
    });
    return counts;
  };

  // ====== EXCEL EXPORT LOGIC ======
  const handleDownloadExcel = () => {
    if (!tableFilteredData || tableFilteredData.length === 0) {
      toast.error("No data available to download!");
      return;
    }

    const excelData = tableFilteredData.map((emp) => {
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
      `Recruitment_Report_${dateFilter}_${activeTab}.xlsx`
    );

    toast.success("Detailed Excel Report Exported!");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10 relative">
      <DashboardHeader
        role={userRole}
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
        
        {/* Search Input Container */}
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
      />

      <EmployeeTable
        filteredData={tableFilteredData}
        loading={loading}
        activeTab={activeTab}
        setSelectedRemark={setSelectedRemark}
        role={userRole}
      />

      <RemarkModal
        selectedRemark={selectedRemark}
        onClose={() => setSelectedRemark(null)}
      />
    </div>
  );
}
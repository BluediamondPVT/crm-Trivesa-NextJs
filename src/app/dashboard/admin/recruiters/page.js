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
  const [companies, setCompanies] = useState([]); // 🚀 NAYA: Companies ka data yahan store hoga calculation ke liye
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRemark, setSelectedRemark] = useState(null);

  const [userRole, setUserRole] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [totalPayout, setTotalPayout] = useState(0); // 🚀 NAYA: Total Payout state

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

        // 🚀 NAYA: Dono API ek sath call kar rahe hain (Fast Performance)
        const [empRes, compRes] = await Promise.all([
          axios.get("/api/employees"),
          axios.get("/api/companies").catch(() => ({ data: { success: false, data: [] } }))
        ]);

        if (empRes.data.success) {
          setEmployees(empRes.data.data);
        }
        if (compRes.data?.success) {
          setCompanies(compRes.data.data);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ====== FILTERING LOGIC ======
  let filteredData = employees;

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
          (h) => `${h.companyName} ${h.process} ${h.status} ${h.remark}`
        ) || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchString.includes(lowerSearch);
    });
  }

  let tableFilteredData = filteredData;
  if (activeTab !== "All") {
    tableFilteredData = tableFilteredData.filter(
      (emp) => emp.status === activeTab
    );
  }

  // 🚀 JADOO: GRAND TOTAL PAYOUT CALCULATOR 
  // Ye tab chalega jab bhi tum search karoge, tab change karoge ya date change karoge
  useEffect(() => {
    const calculateTotalPayout = () => {
      const isAdminOrSuper = ["admin", "superadmin"].includes(userRole?.toLowerCase());
      
      // Sirf admin ko dikhega aur relevant tabs par
      if (!isAdminOrSuper || !["Joining", "Payout", "All"].includes(activeTab) || companies.length === 0) {
        setTotalPayout(0);
        return;
      }

      let sum = 0;
      
      // Sirf wo candidates lo jo Joining ya Payout me hain (current filtered list me se)
      const eligibleEmps = tableFilteredData.filter(
        (e) => e.status === "Joining" || e.status === "Payout"
      );

      eligibleEmps.forEach((emp) => {
        if (!emp.assignedCompanyId || !emp.assignedProcess) return;

        const company = companies.find((c) => c._id === emp.assignedCompanyId);
        if (!company) return;

        const candidateProcess = String(emp.assignedProcess).toLowerCase().trim();
        const opening = company.openings?.find(
          (o) => String(o.title).toLowerCase().trim() === candidateProcess
        );

        if (opening) {
          let type = opening.payoutType || "Flat Amount";
          let amount = 0;

          if (type === "Flat Amount") {
            amount = opening.flatAmount || 0;
          } 
          else if (type === "Percentage") {
            const rawStr = String(emp.actualSalary || "0").toLowerCase().trim();
            let actual = parseFloat(rawStr.replace(/[^0-9.]/g, "")) || 0;
            let isAnnual = false;
            
            if (rawStr.includes("l") || rawStr.includes("lac") || rawStr.includes("lpa") || rawStr.includes("pa")) {
              actual = actual * 100000;
              isAnnual = true;
            } else if (rawStr.includes("k")) {
              actual = actual * 1000;
              isAnnual = false;
            } else if (actual > 0 && actual < 100) {
              actual = actual * 100000;
              isAnnual = true;
            } else if (actual > 150000) {
              isAnnual = true;
            }

            const annualCTC = isAnnual ? actual : (actual * 12);
            const percent = Number(opening.percentageValue) || 0;
            amount = Math.round((annualCTC * percent) / 100); 
          } 
          else if (type === "Slab Wise") {
            // Slab ke liye total count nikalna zaroori hai usi company/process ka
            const joinedEmps = employees.filter(
              (e) => 
                e.assignedCompanyId === emp.assignedCompanyId &&
                String(e.assignedProcess).toLowerCase().trim() === candidateProcess &&
                (e.status === "Joining" || e.status === "Payout")
            );

            let totalJoinedCount = joinedEmps.length || 1;

            let matchedSlab = opening.slabs?.find(
              (s) => totalJoinedCount >= s.minJoinees && totalJoinedCount <= s.maxJoinees
            );

            if (!matchedSlab && opening.slabs?.length > 0) {
              matchedSlab = opening.slabs.reduce((prev, current) => 
                (prev.maxJoinees > current.maxJoinees) ? prev : current
              );
            }

            if (matchedSlab) {
              amount = matchedSlab.amount;
            }
          }
          
          sum += amount; // Amount jodd lo
        }
      });

      setTotalPayout(sum);
    };

    calculateTotalPayout();
  }, [tableFilteredData, employees, companies, userRole, activeTab]);

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
      { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
    ];
    worksheet["!cols"] = colWidths;
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates_Report");
    XLSX.writeFile(workbook, `Recruitment_Report_${dateFilter}_${activeTab}.xlsx`);
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

      {/* 🚀 NAYA: Payout Total (Left) & Search Bar (Right) */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        
        {/* LEFT SIDE: TOTAL PAYOUT WIDGET (Only for Admin/SuperAdmin on relevant tabs) */}
        <div className="w-full sm:w-auto h-full flex items-center">
          {["admin", "superadmin"].includes(userRole?.toLowerCase()) && ["Joining", "Payout", "All"].includes(activeTab) && totalPayout > 0 && (
            <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 px-5 py-3 rounded-2xl shadow-sm w-full sm:w-auto">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg shadow-sm border border-purple-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Total Candidate Payout</p>
                <h3 className="text-xl sm:text-2xl font-black text-purple-900 tracking-tight leading-none">
                  ₹{totalPayout.toLocaleString('en-IN')}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: SEARCH BAR */}
        <div className="relative w-full sm:max-w-lg">
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
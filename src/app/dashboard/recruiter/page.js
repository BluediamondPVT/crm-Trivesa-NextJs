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
  const recruiterId = searchParams.get("recruiterId");

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
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");
  const [companyTypeFilter, setCompanyTypeFilter] = useState("All");
  const [userData, setUserData] = useState(null);

  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [totalPayout, setTotalPayout] = useState(0);

  useEffect(() => {
    if (!isCandidateView) return;

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const [empRes, compRes] = await Promise.all([
          axios.get(`/api/employees`),
          axios.get(`/api/companies`).catch(() => ({ data: { success: false, data: [] } })),
        ]);
        if (empRes.data.success) {
          setEmployees(empRes.data.data);
        }
        if (compRes.data?.success) {
          setCompanies(compRes.data.data);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ====== 🚀 SMART TIMELINE FILTERING LOGIC ======
  const isWithinDateRange = (timestamp, filterType = dateFilter) => {
    if (!timestamp) return false;
    if (filterType === "All") return true;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const empDate = new Date(timestamp).getTime();

    if (filterType === "Today") {
      return empDate >= todayStart;
    } else if (filterType === "Yesterday") {
      const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
      return empDate >= yesterdayStart && empDate < todayStart;
    } else if (filterType === "7Days") {
      const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
      return empDate >= sevenDaysAgo;
    } else if (filterType === "30Days") {
      const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;
      return empDate >= thirtyDaysAgo;
    } else if (filterType === "Custom") {
      if (!customStartDate && !customEndDate) return true;
      const rangeStart = customStartDate ? new Date(customStartDate).setHours(0, 0, 0, 0) : null;
      const rangeEnd = customEndDate ? new Date(customEndDate).setHours(23, 59, 59, 999) : null;

      if (rangeStart && rangeEnd) return empDate >= rangeStart && empDate <= rangeEnd;
      if (rangeStart) return empDate >= rangeStart;
      if (rangeEnd) return empDate <= rangeEnd;
    }
    return true;
  };

  let filteredData = employees;

  if (dateFilter !== "All") {
    filteredData = filteredData.filter((emp) => {
      // 1. ALWAYS include if they were created (Lined Up) in this date range
      if (isWithinDateRange(emp.createdAt)) return true;

      // 2. Include if any history event matches this date range
      if (emp.statusHistory && emp.statusHistory.length > 0) {
        return emp.statusHistory.some((h) => isWithinDateRange(h.timestamp));
      }

      // 3. Fallback for old data without history
      return isWithinDateRange(emp.updatedAt);
    });
  }

  if (companyTypeFilter !== "All" && companies.length > 0) {
    filteredData = filteredData.filter((emp) => {
      if (!emp.assignedCompanyId) return false;
      const company = companies.find((c) => String(c._id) === String(emp.assignedCompanyId));
      return company && company.companyType === companyTypeFilter;
    });
  }

  if (debouncedSearch.trim() !== "") {
    const lowerSearch = debouncedSearch.toLowerCase();
    filteredData = filteredData.filter((emp) => {
      const searchString = [
        emp.name, emp.email, emp.phone, emp.address, emp.age, emp.qualification,
        emp.specialization, emp.experience, emp.lastSalary, emp.expectedSalary,
        emp.actualSalary, emp.source, emp.assignedCompanyName, emp.assignedProcess,
        emp.remark, emp.status, ...(emp.skills || []),
        ...(emp.assignmentHistory?.map((h) => `${h.companyName} ${h.process} ${h.status} ${h.remark}`) || []),
      ].filter(Boolean).join(" ").toLowerCase();

      return searchString.includes(lowerSearch);
    });
  }

  if (recruiterId) {
    filteredData = filteredData.filter((emp) => {
      const addedBy = emp.addedBy;
      return (
        (addedBy?._id && String(addedBy._id) === recruiterId) ||
        (typeof addedBy === "string" && addedBy === recruiterId)
      );
    });
  }

  // ====== 🚀 SMART TAB DATA (Table me wahi log dikhenge jo us din us status me the) ======
  let tableData = filteredData;
  if (activeTab !== "All") {
    tableData = tableData.filter((emp) => {
      if (dateFilter === "All") {
        return emp.status === activeTab;
      } else {
        // Agar LineUp tab hai, aur candidate us din create hua tha, toh 100% dikhao!
        if (activeTab === "LineUp" && isWithinDateRange(emp.createdAt)) {
          return true;
        }
        // Baaki tabs ke liye history check karo
        if (emp.statusHistory && emp.statusHistory.length > 0) {
          return emp.statusHistory.some((h) => h.status === activeTab && isWithinDateRange(h.timestamp));
        }
        // Fallback for old data
        return emp.status === activeTab && isWithinDateRange(emp.updatedAt);
      }
    });
  }

  // ====== 🚀 ACCURATE ACTION COUNTER (Kabhi LineUp minus nahi hoga!) ======
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
      if (dateFilter === "All") {
        if (counts[emp.status] !== undefined) counts[emp.status]++;
      } else {
        const countedStatuses = new Set();

        // 1. UNIVERSAL TRUTH: Jis din candidate create hua, us din +1 LineUp hoga hi hoga!
        if (isWithinDateRange(emp.createdAt)) {
          counts["LineUp"]++;
          countedStatuses.add("LineUp");
        }

        // 2. Check history for OTHER actions (Attendees, Selected, etc.)
        if (emp.statusHistory && emp.statusHistory.length > 0) {
          emp.statusHistory.forEach((history) => {
            if (isWithinDateRange(history.timestamp)) {
              if (counts[history.status] !== undefined && !countedStatuses.has(history.status)) {
                counts[history.status]++;
                countedStatuses.add(history.status);
              }
            }
          });
        } else {
          // 3. Fallback for old data
          if (isWithinDateRange(emp.updatedAt)) {
            if (counts[emp.status] !== undefined && !countedStatuses.has(emp.status)) {
              counts[emp.status]++;
              countedStatuses.add(emp.status);
            }
          }
        }
      }
    });
    return counts;
  };

  // ====== GRAND TOTAL PAYOUT CALCULATOR ======
  useEffect(() => {
    const calculateTotalPayout = () => {
      const isAdminOrSuper = ["admin", "superadmin"].includes(
        userData?.role?.toLowerCase() || "recruiter",
      );

      if (
        !isAdminOrSuper ||
        !["Joining", "Payout", "All"].includes(activeTab) ||
        companies.length === 0
      ) {
        setTotalPayout(0);
        return;
      }

      let sum = 0;
      const eligibleEmps = tableData.filter(
        (e) => e.status === "Joining" || e.status === "Payout",
      );

      eligibleEmps.forEach((emp) => {
        if (!emp.assignedCompanyId || !emp.assignedProcess) return;

        const company = companies.find((c) => c._id === emp.assignedCompanyId);
        if (!company) return;

        const candidateProcess = String(emp.assignedProcess)
          .toLowerCase()
          .trim();
        const opening = company.openings?.find(
          (o) => String(o.title).toLowerCase().trim() === candidateProcess,
        );

        if (opening) {
          let type = opening.payoutType || "Flat Amount";
          let amount = 0;

          if (type === "Flat Amount") {
            amount = opening.flatAmount || 0;
          } else if (type === "Percentage") {
            const rawStr = String(emp.actualSalary || "0")
              .toLowerCase()
              .trim();
            let actual = parseFloat(rawStr.replace(/[^0-9.]/g, "")) || 0;
            let isAnnual = false;

            if (
              rawStr.includes("l") ||
              rawStr.includes("lac") ||
              rawStr.includes("lpa") ||
              rawStr.includes("pa")
            ) {
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

            const annualCTC = isAnnual ? actual : actual * 12;
            const percent = Number(opening.percentageValue) || 0;
            amount = Math.round((annualCTC * percent) / 100);
          } else if (type === "Slab Wise") {
            const joinedEmps = employees.filter(
              (e) =>
                e.assignedCompanyId === emp.assignedCompanyId &&
                String(e.assignedProcess).toLowerCase().trim() ===
                candidateProcess &&
                (e.status === "Joining" || e.status === "Payout"),
            );

            let totalJoinedCount = joinedEmps.length || 1;

            let matchedSlab = opening.slabs?.find(
              (s) =>
                totalJoinedCount >= s.minJoinees &&
                totalJoinedCount <= s.maxJoinees,
            );

            if (!matchedSlab && opening.slabs?.length > 0) {
              matchedSlab = opening.slabs.reduce((prev, current) =>
                prev.maxJoinees > current.maxJoinees ? prev : current,
              );
            }

            if (matchedSlab) {
              amount = matchedSlab.amount;
            }
          }

          sum += amount;
        }
      });

      setTotalPayout(sum);
    };

    calculateTotalPayout();
  }, [tableData, employees, companies, userData, activeTab]);

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
      { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 20 },
      { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates_Report");
    XLSX.writeFile(workbook, `Recruitment_Report_${dateFilter}_${activeTab}.xlsx`);

    toast.success("Detailed Excel Report Exported!");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between bg-white border-b p-4 shadow-sm z-30">
          <span className="font-bold text-[#092a49]">Recruiter CRM</span>
          <button className="p-2 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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
                companyTypeFilter={companyTypeFilter}
                setCompanyTypeFilter={setCompanyTypeFilter}
                handleDownload={handleDownloadExcel}
                customStartDate={customStartDate}
                setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}
                setCustomEndDate={setCustomEndDate}
              />

              <MetricsMatrix
                counts={getCounts()}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <div className="mb-6 flex flex-col items-end animate-in fade-in slide-in-from-top-4 duration-500 mt-2">
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, phone, skills, salary..."
                    className="w-full p-4 pl-12 text-sm font-medium text-[#092a49] bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-300 focus:bg-blue-50/30 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all duration-300 placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
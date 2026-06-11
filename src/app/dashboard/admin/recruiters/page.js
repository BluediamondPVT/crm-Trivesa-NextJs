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
import DashboardToolbar from "@/components/recruiter/DashboardToolbar";

export default function RecruiterDashboard() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const recruiterId = searchParams.get("recruiterId");

  const tabs = [
    "All", "LineUp", "Attendees", "On Hold", "Selected",
    "Joining", "Rejected", "Payout", "future", "Abscond",
  ];

  const initialTab = tabFromUrl && tabs.includes(tabFromUrl) ? tabFromUrl : "LineUp";

  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRemark, setSelectedRemark] = useState(null);

  const [userRole, setUserRole] = useState(null);

  // ====== 🚀 SMART FILTER PERSISTENCE (Save filters on page change) ======
  const [dateFilter, setDateFilter] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("dateFilter") || "All";
    return "All";
  });
  
  const [companyTypeFilter, setCompanyTypeFilter] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("companyTypeFilter") || "All";
    return "All";
  });

  const [customStartDate, setCustomStartDate] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("customStartDate") || "";
    return "";
  });

  const [customEndDate, setCustomEndDate] = useState(() => {
    if (typeof window !== "undefined") return sessionStorage.getItem("customEndDate") || "";
    return "";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalPayout, setTotalPayout] = useState(0);

  // 🚀 UPDATE SESSION STORAGE WHENEVER FILTERS CHANGE
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dateFilter", dateFilter);
      sessionStorage.setItem("companyTypeFilter", companyTypeFilter);
      sessionStorage.setItem("customStartDate", customStartDate);
      sessionStorage.setItem("customEndDate", customEndDate);
    }
  }, [dateFilter, companyTypeFilter, customStartDate, customEndDate]);

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

        const [empRes, compRes] = await Promise.all([
          axios.get("/api/employees"),
          axios.get("/api/companies").catch(() => ({ data: { success: false, data: [] } })),
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

  // ====== 🚀 HELPER: DATE CHECKER ======
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
      // 1. Lined up in date range
      if (isWithinDateRange(emp.createdAt)) return true;

      // 2. Achieved ANY other status in date range
      if (emp.statusHistory && emp.statusHistory.length > 0) {
        return emp.statusHistory.some((h) => isWithinDateRange(h.timestamp));
      }

      // 3. Fallback for old data
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

  // ====== 🚀 STRICT TAB DATA (Filter data by what happened that day) ======
  let tableFilteredData = filteredData;
  if (activeTab !== "All") {
    tableFilteredData = tableFilteredData.filter((emp) => {
      if (dateFilter === "All") return emp.status === activeTab;

      // Agar LineUp hai toh ONLY unko dikhao jo sach me us din create hue the
      if (activeTab === "LineUp") {
        return isWithinDateRange(emp.createdAt);
      }

      // Baaki kisi tab ke liye, history mein check karo ki kya wo is din us tab wale status me tha
      if (emp.statusHistory && emp.statusHistory.length > 0) {
        return emp.statusHistory.some((h) => h.status === activeTab && isWithinDateRange(h.timestamp));
      }

      // Fallback
      return emp.status === activeTab && isWithinDateRange(emp.updatedAt);
    });
  }

  // ====== 🚀 STRICT MULTI-EVENT TRACKER COUNTER ======
  const getCounts = () => {
    const counts = {
      All: filteredData.length,
      LineUp: 0, Attendees: 0, "On Hold": 0, Selected: 0,
      Joining: 0, Rejected: 0, Payout: 0, future: 0, Abscond: 0,
    };

    filteredData.forEach((emp) => {
      if (dateFilter === "All") {
        // Snapshot snapshot of all time current status
        if (counts[emp.status] !== undefined) counts[emp.status]++;
      } else {
        // 1. STRICT LINEUP: Sirf jis din create hua, us din LineUp count hoga
        if (isWithinDateRange(emp.createdAt)) {
          counts["LineUp"]++;
        }

        // 2. OTHER STATUSES: Us selected din pe candidate ne kya kya naye status achieve kiye?
        if (emp.statusHistory && emp.statusHistory.length > 0) {
          // Find ALL history events that happened on the filtered date
          const eventsInDateRange = emp.statusHistory.filter(h => isWithinDateRange(h.timestamp));
          
          if (eventsInDateRange.length > 0) {
            // Get unique statuses achieved on that specific day
            const statusesAchievedThatDay = new Set(eventsInDateRange.map(h => h.status));

            statusesAchievedThatDay.forEach((status) => {
              // LineUp humne createdAt se gin liya hai, so don't double count it here
              if (status !== "LineUp" && counts[status] !== undefined) {
                counts[status]++;
              }
            });
          }
        } else {
          // Fallback for old legacy data without history array
          if (isWithinDateRange(emp.updatedAt)) {
            if (emp.status !== "LineUp" && counts[emp.status] !== undefined) {
              counts[emp.status]++;
            }
          }
        }
      }
    });
    return counts;
  };

  // GRAND TOTAL PAYOUT CALCULATOR
  useEffect(() => {
    const calculateTotalPayout = () => {
      const isAdminOrSuper = ["admin", "superadmin"].includes(userRole?.toLowerCase());

      if (!isAdminOrSuper || !["Joining", "Payout", "All"].includes(activeTab) || companies.length === 0) {
        setTotalPayout(0);
        return;
      }

      let sum = 0;
      const eligibleEmps = tableFilteredData.filter((e) => e.status === "Joining" || e.status === "Payout");

      eligibleEmps.forEach((emp) => {
        if (!emp.assignedCompanyId || !emp.assignedProcess) return;

        const company = companies.find((c) => c._id === emp.assignedCompanyId);
        if (!company) return;

        const candidateProcess = String(emp.assignedProcess).toLowerCase().trim();
        const opening = company.openings?.find((o) => String(o.title).toLowerCase().trim() === candidateProcess);

        if (opening) {
          let type = opening.payoutType || "Flat Amount";
          let amount = 0;

          if (type === "Flat Amount") {
            amount = opening.flatAmount || 0;
          } else if (type === "Percentage") {
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

            const annualCTC = isAnnual ? actual : actual * 12;
            const percent = Number(opening.percentageValue) || 0;
            amount = Math.round((annualCTC * percent) / 100);
          } else if (type === "Slab Wise") {
            const joinedEmps = employees.filter((e) => e.assignedCompanyId === emp.assignedCompanyId && String(e.assignedProcess).toLowerCase().trim() === candidateProcess && (e.status === "Joining" || e.status === "Payout"));
            let totalJoinedCount = joinedEmps.length || 1;
            let matchedSlab = opening.slabs?.find((s) => totalJoinedCount >= s.minJoinees && totalJoinedCount <= s.maxJoinees);

            if (!matchedSlab && opening.slabs?.length > 0) {
              matchedSlab = opening.slabs.reduce((prev, current) => prev.maxJoinees > current.maxJoinees ? prev : current);
            }
            if (matchedSlab) amount = matchedSlab.amount;
          }
          sum += amount;
        }
      });
      setTotalPayout(sum);
    };
    calculateTotalPayout();
  }, [tableFilteredData, employees, companies, userRole, activeTab]);

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
    const colWidths = [{ wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
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

      <DashboardToolbar
        userRole={userRole}
        activeTab={activeTab}
        totalPayout={totalPayout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <TabsFilter
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={getCounts()}
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
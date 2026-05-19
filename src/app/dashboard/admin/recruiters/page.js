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
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRemark, setSelectedRemark] = useState(null);

  const [userRole, setUserRole] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");

  // 🚀 NAYA: Ab sirf ek hi Custom Date store karenge
  const [customStartDate, setCustomStartDate] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [totalPayout, setTotalPayout] = useState(0);

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
          axios
            .get("/api/companies")
            .catch(() => ({ data: { success: false, data: [] } })),
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
      now.getDate(),
    ).getTime();

    filteredData = filteredData.filter((emp) => {
      const dateToUse = emp.updatedAt ? emp.updatedAt : emp.createdAt;
      const empDate = new Date(dateToUse).getTime();

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
      // 🚀 CUSTOM DATE LOGIC: Picked Date se leke Aak tak (Today)
      else if (dateFilter === "Custom") {
        if (!customStartDate) return true; // Jab tak select na ho, sab dikhao

        const pickedDate = new Date(customStartDate);
        pickedDate.setHours(0, 0, 0, 0); // Start of picked date

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); // End of today

        // Taki agar user galti se future date daal de toh bhi range sahi kaam kare
        const rangeStart = Math.min(pickedDate.getTime(), endOfToday.getTime());
        const rangeEnd = Math.max(pickedDate.getTime(), endOfToday.getTime());

        return empDate >= rangeStart && empDate <= rangeEnd;
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
          (h) => `${h.companyName} ${h.process} ${h.status} ${h.remark}`,
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
      (emp) => emp.status === activeTab,
    );
  }

  // GRAND TOTAL PAYOUT CALCULATOR
  useEffect(() => {
    const calculateTotalPayout = () => {
      const isAdminOrSuper = ["admin", "superadmin"].includes(
        userRole?.toLowerCase(),
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
      const eligibleEmps = tableFilteredData.filter(
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
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10 relative">
      <DashboardHeader
        role={userRole}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        handleDownload={handleDownloadExcel}
        // 🚀 NAYA: Sirf ek Custom Start Date pass kiya
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
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

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useSearchParams } from "next/navigation"; // <--- NAYA IMPORT YAHAN HAI

// Component Imports
import DashboardHeader from "@/components/recruiter/DashboardHeader";
import MetricsMatrix from "@/components/recruiter/MetricsMatrix";
import TabsFilter from "@/components/recruiter/TabsFilter";
import EmployeeTable from "@/components/recruiter/EmployeeTable";
import RemarkModal from "@/components/recruiter/RemarkModal";

export default function RecruiterDashboard() {
  const searchParams = useSearchParams(); // URL ko read karne ke liye
  const tabFromUrl = searchParams.get("tab"); // URL se ?tab= ki value nikal rahe hain

  const tabs = [
    "All",
    "LineUp",
    "Attendees",
    "On Hold",
    "Selected",
    "Joining",
    "Rejected",
    "Payout",
  ];

  // Agar URL mein tab hai aur wo valid hai, toh usey default rakho, warna 'LineUp'
  const initialTab =
    tabFromUrl && tabs.includes(tabFromUrl) ? tabFromUrl : "LineUp";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab); // Initial tab set kar diya
  const [selectedRemark, setSelectedRemark] = useState(null);

  const [userRole, setUserRole] = useState(null);
  const [dateFilter, setDateFilter] = useState("All");

  // NAYA: URL change hone pe activeTab bhi update hona chahiye (jab user sidebar se click kare)
  useEffect(() => {
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        setUserRole(role);

        const res = await axios.get(
          `/api/employees?userId=${userId}&role=${role}`,
        );
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

  // ====== FILTERING LOGIC ======
  let dateFilteredEmployees = employees;

  if (dateFilter !== "All") {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    dateFilteredEmployees = employees.filter((emp) => {
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

  const getCounts = () => {
    const counts = {
      All: dateFilteredEmployees.length,
      LineUp: 0,
      Attendees: 0,
      "On Hold": 0,
      Selected: 0,
      Rejected: 0,
      Joining: 0,
      Payout: 0,
    };
    dateFilteredEmployees.forEach((emp) => {
      if (counts[emp.status] !== undefined) counts[emp.status]++;
    });
    return counts;
  };

  let tableFilteredData = dateFilteredEmployees;
  if (activeTab !== "All") {
    tableFilteredData = tableFilteredData.filter(
      (emp) => emp.status === activeTab,
    );
  }

  // ====== EXCEL EXPORT LOGIC ======
  const handleDownloadExcel = () => {
    if (!tableFilteredData || tableFilteredData.length === 0) {
      toast.error("No data available to download!");
      return;
    }

    const excelData = tableFilteredData.map((emp) => ({
      "Candidate Name": emp.name || "N/A",
      "Phone Number": emp.phone || "N/A",
      "Email Address": emp.email || "N/A",
      Source: emp.source || "N/A",
      "Assigned Company": emp.assignedCompanyName || "N/A",
      "Job Process": emp.assignedProcess || "N/A",
      Status: emp.status || "N/A",
      "Added By (Recruiter)": emp.addedBy || "N/A",
      "Date Added": new Date(emp.createdAt).toLocaleDateString("en-IN"),
    }));

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
      { wch: 25 },
      { wch: 15 },
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates_Full_Report");
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
      />

      <MetricsMatrix
        counts={getCounts()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
      />

      <RemarkModal
        selectedRemark={selectedRemark}
        onClose={() => setSelectedRemark(null)}
      />
    </div>
  );
}

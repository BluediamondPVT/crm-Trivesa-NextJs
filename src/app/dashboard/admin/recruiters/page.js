"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

// Component Imports
import DashboardHeader from "@/components/recruiter/DashboardHeader";
import MetricsMatrix from "@/components/recruiter/MetricsMatrix";
import TabsFilter from "@/components/recruiter/TabsFilter";
import EmployeeTable from "@/components/recruiter/EmployeeTable";
import RemarkModal from "@/components/recruiter/RemarkModal";

export default function RecruiterDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("LineUp");
  const [selectedRemark, setSelectedRemark] = useState(null);

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

  // NAYA: Ek hi solid useEffect jo sab handle karega (Fetch + Filter + Loading)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Fetch shuru hone se pehle loading ON
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        const res = await axios.get(
          `/api/employees?userId=${userId}&role=${role}`,
        );

        if (res.data.success) {
          setEmployees(res.data.data);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
        toast.error("Failed to load candidates data");
      } finally {
        setLoading(false); // Data aane ke baad (ya error ke baad) loading OFF
      }
    };

    fetchData();
  }, []);

  const filteredData =
    activeTab === "All"
      ? employees
      : employees.filter((emp) => emp.status === activeTab);

  // Calculate Metrics Counts
  const getCounts = () => {
    const counts = {
      All: employees.length,
      LineUp: 0,
      Attendees: 0,
      "On Hold": 0,
      Selected: 0,
      Rejected: 0,
      Joining: 0,
      Payout: 0,
    };
    employees.forEach((emp) => {
      if (counts[emp.status] !== undefined) counts[emp.status]++;
    });
    return counts;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10 relative">
      <DashboardHeader />

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
        filteredData={filteredData}
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

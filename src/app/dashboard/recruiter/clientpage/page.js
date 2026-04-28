"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

// Components Import
import DashboardHeader from "@/components/admin/DashboardHeader";
import MetricsGrid from "@/components/admin/MetricsGrid";
import CRMTable from "@/components/admin/CRMTable";

export default function AdminDashboard() {
  const [tableData, setTableData] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    nonActive: 0,
    process: 0,
    listed: 0,
    activeOpenings: 0,
    nonActiveOpenings: 0,
  });
  const [loading, setLoading] = useState(true);
  

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/companies");

      if (response.data.success) {
        const allCompanies = response.data.data;

        let active = 0,
          nonActive = 0,
          process = 0,
          listed = 0;
        let activeOpeningsCount = 0,
          nonActiveOpeningsCount = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        allCompanies.forEach((company) => {
          if (company.status === "Active") active++;
          if (company.status === "Non Active") nonActive++;
          if (company.status === "Process") process++;
          if (company.status === "Listed") listed++;

          if (company.openings && Array.isArray(company.openings)) {
            company.openings.forEach((op) => {
              if (!op.expiryDate) {
                activeOpeningsCount++;
              } else {
                const expDate = new Date(op.expiryDate);
                if (expDate >= today) {
                  activeOpeningsCount++;
                } else {
                  nonActiveOpeningsCount++;
                }
              }
            });
          }
        });

        setCounts({
          total: allCompanies.length,
          active,
          nonActive,
          process,
          listed,
          activeOpenings: activeOpeningsCount,
          nonActiveOpenings: nonActiveOpeningsCount,
        });

        // Pura filtered data Table ko denge, ab wahan Pagination hogi (slice nahi kiya)
        const filteredForTable = allCompanies.filter(
          (company) =>
            company.status !== "Listed" && company.status !== "Process",
        );
        setTableData(filteredForTable);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id, companyName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${companyName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }
    try {
      const response = await axios.delete(`/api/companies/${id}`);
      if (response.data.success) {
        toast.success(`Client "${companyName}" deleted successfully`);
        setTableData(tableData.filter((company) => company._id !== id));
        fetchDashboardData(); // Counters update karne ke liye
      } else {
        toast.error(response.data.message || "Failed to delete company");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex justify-center font-bold text-[#092a49]">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10">
      <DashboardHeader />
      <MetricsGrid counts={counts} />
      <CRMTable data={tableData} onDelete={handleDelete} />
    </div>
  );
}

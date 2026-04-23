"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import CompanyStatusTable from "@/components/admin/CompanyStatusTable"; // Table Component Import kiya

export default function CompanyStatusPage() {
  const params = useParams();
  const rawStatus = params.status;

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusMap = {
    active: "Active",
    "non-active": "Non Active",
    process: "Process",
    listed: "Listed",
  };

  const currentStatus = statusMap[rawStatus] || "Active";

  const fetchCompaniesByStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/companies");
      if (response.data.success) {
        const allCompanies = response.data.data;
        const filtered = allCompanies.filter(
          (company) => company.status === currentStatus,
        );
        setFilteredCompanies(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompaniesByStatus();
  }, [currentStatus]);

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
        setFilteredCompanies(
          filteredCompanies.filter((company) => company._id !== id),
        );
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
      <div className="p-10 text-center font-bold text-gray-500 flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#092a49] border-t-transparent rounded-full animate-spin"></div>
        Loading {currentStatus} Companies...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center text-sm cursor-pointer font-semibold text-gray-500 hover:text-[#0796fe] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Dashboard
      </button>

      <div className="mb-8 border-l-[6px] pl-4 rounded-sm border-gray-800">
        <h1 className="text-3xl font-extrabold text-[#092a49]">
          {currentStatus} <span className="font-light">Companies</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Showing all companies currently marked as{" "}
          {currentStatus.toLowerCase()}.
        </p>
      </div>

      {/* Child Component Jisme Infinite Scroll Hai */}
      <CompanyStatusTable
        filteredCompanies={filteredCompanies}
        currentStatus={currentStatus}
        handleDelete={handleDelete}
      />
    </div>
  );
}

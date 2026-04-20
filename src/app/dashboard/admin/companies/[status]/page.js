"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner"; // IMPORT TOAST

export default function CompanyStatusPage() {
  const params = useParams();
  const rawStatus = params.status; // URL se milega: 'active', 'non-active', 'process', 'listed'

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL wale status ko actual DB status se map karne ka logic
  const statusMap = {
    active: "Active",
    "non-active": "Non Active",
    process: "Process",
    listed: "Listed",
  };

  const currentStatus = statusMap[rawStatus] || "Active"; // Default to Active

  const fetchCompaniesByStatus = async () => {
    try {
      const response = await axios.get("/api/companies");

      if (response.data.success) {
        const allCompanies = response.data.data;
        // Filter data by current status
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

  // NAYA DELETE FUNCTION
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
        // Remove from UI state immediately
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

  // Dynamic header color design
  const getHeaderStyle = () => {
    if (currentStatus === "Active") return "border-[#16a34a] text-[#16a34a]"; // Green
    if (currentStatus === "Non Active")
      return "border-[#dc2626] text-[#dc2626]"; // Red
    if (currentStatus === "Process") return "border-[#ea580c] text-[#ea580c]"; // Orange
    if (currentStatus === "Listed") return "border-[#2563eb] text-[#2563eb]"; // Blue
    return "border-[#092a49] text-[#092a49]";
  };

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-gray-500">
        Loading {currentStatus} Companies...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-[#0796fe] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div
          className={`px-6 py-4 border-b-2 bg-gray-50/50 ${getHeaderStyle()}`}
        >
          <h3 className="font-bold uppercase tracking-wider text-sm">
            {currentStatus} LIST ({filteredCompanies.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-600 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4 w-48">Company Name</th>
                <th className="px-6 py-4 w-32">Phone Number</th>
                <th className="px-6 py-4 w-40">Email</th>
                <th className="px-6 py-4 min-w-50">Address</th>
                <th className="px-6 py-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <tr
                    key={company._id}
                    className="hover:bg-[#e6f4ff] transition-colors group"
                  >
                    <td className="px-6 py-5 font-medium text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-800 line-clamp-1">
                        {company.name}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-gray-600 whitespace-nowrap">
                      {company.phone}
                    </td>

                    <td className="px-6 py-5 text-gray-600 truncate max-w-40">
                      {company.email}
                    </td>
                    
                    <td className="px-6 py-5 text-gray-500 text-xs line-clamp-2 mt-2">
                      {company.address || "N/A"}
                    </td>

                    <td className="px-6 py-5 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/dashboard/admin/company/${company._id}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md font-medium text-xs transition-all border border-blue-200 shadow-sm cursor-pointer whitespace-nowrap">
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(company._id, company.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium text-xs transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-600 font-medium italic bg-gray-50/30"
                  >
                    No {currentStatus.toLowerCase()} companies found right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

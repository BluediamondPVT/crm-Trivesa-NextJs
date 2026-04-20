"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [recentCRM, setRecentCRM] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/companies");
      if (response.data.success) {
        const allCompanies = response.data.data;
        // Filter Recent CRM Table (Exclude Listed and Process)
        const filteredForTable = allCompanies.filter(
          (company) =>
            company.status !== "Listed" && company.status !== "Process",
        );
        setRecentCRM(filteredForTable.slice(0, 10));
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

  // NAYA DELETE FUNCTION
  const handleDelete = async (id, companyName) => {
    // Basic confirmation
    if (
      !window.confirm(
        `Are you sure you want to delete "${companyName}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      // Backend ko delete request bhej rahe hain
      const response = await axios.delete(`/api/companies/${id}`);

      if (response.data.success) {
        toast.success(`${companyName} deleted successfully`);
        // UI ko refresh karne ke liye table data dubara fetch karo ya array filter karo
        setRecentCRM(recentCRM.filter((company) => company._id !== id));
      } else {
        toast.error("Failed to delete company");
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
    <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Overview of your system performance
          </p>
        </div>

        <Link
          href="/dashboard/admin/add-client"
          className="bg-[#183e61] inline-block text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#061a2e] shadow-sm transition-colors"
        >
          + Add Clients
        </Link>
      </div>

      {/* Recent CRM Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10 border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#092a49]">
            Recent CRM (Active/Non-Active)
          </h3>
          <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded">
            Excluding Process & Listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12 text-center">#</th>
                <th className="px-6 py-4 w-48">Company Name</th>
                <th className="px-6 py-4 w-24">Status</th>
                <th className="px-6 py-4 w-32">Phone</th>
                <th className="px-6 py-4 min-w-50">Address</th>
                <th className="px-6 py-4 w-32 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {recentCRM.length > 0 ? (
                recentCRM.map((company, index) => (
                  <tr
                    key={company._id}
                    className="hover:bg-[#e6f4ff] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 text-gray-400 font-medium text-center">
                      {index + 1}
                    </td>

                    {/* Company Name */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 line-clamp-1">
                        {company.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.email}
                      </div>
                    </td>

                    {/* Status (Compact) */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold rounded-md ${company.status === "Active" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
                      >
                        {company.status}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                      {company.phone}
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 text-gray-500 text-xs line-clamp-2 mt-2">
                      {company.address || "N/A"}
                    </td>

                    {/* Actions (View & Delete) */}
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/dashboard/admin/company/${company._id}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#0796fe] bg-blue-50 hover:bg-blue-100 rounded-md font-medium text-xs transition-colors cursor-pointer">
                          View
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
                    className="text-center py-10 text-gray-400 font-medium bg-gray-50/30"
                  >
                    No active or non-active companies found.
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

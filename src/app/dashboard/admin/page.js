"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [recentCRM, setRecentCRM] = useState([]);
  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    nonActive: 0,
    process: 0,
    listed: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/companies");

      if (response.data.success) {
        const allCompanies = response.data.data;

        // 1. Calculate counts for cards dynamically
        let active = 0,
          nonActive = 0,
          process = 0,
          listed = 0;
        allCompanies.forEach((company) => {
          if (company.status === "Active") active++;
          if (company.status === "Non Active") nonActive++;
          if (company.status === "Process") process++;
          if (company.status === "Listed") listed++;
        });

        setCounts({
          total: allCompanies.length,
          active,
          nonActive,
          process,
          listed,
        });

        // 2. Filter Recent CRM Table (Exclude Listed and Process)
        const filteredForTable = allCompanies.filter(
          (company) =>
            company.status !== "Listed" && company.status !== "Process",
        );

        // Optionally, limit to latest 10 records
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

  // --- DELETE FUNCTIONALITY ---
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
        setRecentCRM(recentCRM.filter((company) => company._id !== id));
        // Optionally, fetchDashboardData() again to update total counts
        fetchDashboardData();
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
    <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-10">
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-[#092a49] p-5 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
              Total
            </p>
            <h3 className="text-3xl font-bold text-gray-800">{counts.total}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#092a49] shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
          </div>
        </div>
        <Link
          href="/dashboard/admin/companies/active"
          className="bg-white rounded-2xl shadow-sm border-l-[6px] border-green-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
              Active
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {counts.active}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/companies/non-active"
          className="bg-white rounded-2xl shadow-sm border-l-[6px] border-red-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
              Non Active
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {counts.nonActive}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/companies/process"
          className="bg-white rounded-2xl shadow-sm border-l-[6px] border-orange-400 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
              Process
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {counts.process}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/dashboard/admin/companies/listed"
          className="bg-white rounded-2xl shadow-sm border-l-[6px] border-blue-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-xs font-bold text-gray-600 tracking-wider mb-2 uppercase">
              Listed
            </p>
            <h3 className="text-3xl font-bold text-gray-800">
              {counts.listed}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
          </div>
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
                    <td className="px-6 py-4 text-gray-600 font-medium text-center">
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
                      {/* Optimized View Link */}
                      <Link
                        href={`/dashboard/admin/company/${company._id}`}
                        aria-label={`View details for ${company.name}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#1d4ed8] bg-blue-50 hover:bg-blue-100 rounded-md font-medium text-xs transition-colors cursor-pointer"
                      >
                        View
                      </Link>

                      {/* Optimized Delete Button */}
                      <button
                        onClick={() => handleDelete(company._id, company.name)}
                        aria-label={`Delete company ${company.name}`}
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
                    className="text-center py-10 text-gray-600 font-medium bg-gray-50/30"
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

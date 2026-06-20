"use client";

import { useEffect, useState } from "react";

export default function WebLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/web-leads");
        const result = await response.json();
        if (result.success) {
          setLeads(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch web leads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "New":
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            New
          </span>
        );
      case "Contacted":
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            Contacted
          </span>
        );
      case "Closed":
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
        <div>
          <h1 className="text-3xl font-extrabold text-[#092a49] tracking-tight">
            Website Leads
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Manage and view inquiries submitted through the external website.
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Business Email
                </th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Message
                </th>
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton Rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                    <td className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="p-5 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="p-5 text-sm font-bold text-gray-800">
                      {lead.companyName}
                    </td>
                    <td className="p-5 text-sm text-blue-600 font-medium">
                      <a href={`mailto:${lead.businessEmail}`}>
                        {lead.businessEmail}
                      </a>
                    </td>
                    <td className="p-5 text-sm text-gray-600">
                      {lead.phone || "-"}
                    </td>
                    <td className="p-5 text-sm text-gray-600 max-w-xs truncate" title={lead.message}>
                      {lead.message || "-"}
                    </td>
                    <td className="p-5 text-sm text-center">
                      {getStatusBadge(lead.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-500 font-medium"
                  >
                    No website leads found.
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

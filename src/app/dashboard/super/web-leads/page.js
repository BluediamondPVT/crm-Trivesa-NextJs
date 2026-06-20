"use client";

import { useEffect, useState } from "react";

export default function WebLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  useEffect(() => {
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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;

    try {
      const response = await fetch(`/api/web-leads/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setLeads(leads.filter((lead) => lead._id !== id));
      } else {
        alert("Failed to delete lead: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Error deleting lead.");
    }
  };

  const handleEditClick = (lead) => {
    setCurrentLead(lead);
    setIsEditing(true);
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`/api/web-leads/${currentLead._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentLead.status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setLeads(
          leads.map((lead) =>
            lead._id === currentLead._id ? result.data : lead
          )
        );
        setIsEditing(false);
        setCurrentLead(null);
      } else {
        alert("Failed to update lead: " + result.error);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      alert("Error updating lead.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10 relative">
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
                <th className="p-5 text-sm font-bold text-gray-600 uppercase tracking-wider text-right">
                  Actions
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
                    <td className="p-5 text-right">
                      <div className="h-6 bg-gray-200 rounded w-16 ml-auto"></div>
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
                    <td className="p-5 text-sm text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(lead)}
                        className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors mr-2"
                        title="Edit Lead"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors"
                        title="Delete Lead"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
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

      {/* Edit Modal */}
      {isEditing && currentLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-[#092a49]">Edit Lead Details</h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateLead} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                <select
                  value={currentLead.status}
                  onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-sm font-bold text-white bg-[#092a49] hover:bg-[#163a5d] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

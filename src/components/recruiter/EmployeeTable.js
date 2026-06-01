// src/components/recruiter/EmployeeTable.js
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import PayoutBadge from "./PayoutBadge";

// ✅ Sort Icon Component
function SortIcon({ column, sortConfig }) {
  const isActive = sortConfig.key === column;
  const isAsc = isActive && sortConfig.direction === "asc";
  const isDesc = isActive && sortConfig.direction === "desc";

  return (
    <span className="inline-flex flex-col ml-1.5 gap-[2px] align-middle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 8 5"
        className={`w-2 h-2 transition-colors ${isAsc ? "text-blue-600" : "text-gray-300"}`}
        fill="currentColor"
      >
        <path d="M4 0L8 5H0L4 0Z" />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 8 5"
        className={`w-2 h-2 transition-colors ${isDesc ? "text-blue-600" : "text-gray-300"}`}
        fill="currentColor"
      >
        <path d="M4 5L0 0H8L4 5Z" />
      </svg>
    </span>
  );
}

export default function EmployeeTable({
  filteredData,
  loading,
  activeTab,
  setSelectedRemark,
  role = "admin",
}) {
  const [visibleCount, setVisibleCount] = useState(20);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef(null);

  // ✅ Sort State: key = column name, direction = "asc" | "desc" | null
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const isAdminOrSuper = ["admin", "superadmin"].includes(role?.toLowerCase());
  const showPayoutColumn =
    isAdminOrSuper && ["Joining", "Payout"].includes(activeTab);

  useEffect(() => {
    setVisibleCount(20);
  }, [activeTab, filteredData.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          visibleCount < filteredData.length &&
          !isFetchingMore
        ) {
          loadMoreData();
        }
      },
      { threshold: 0.1 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleCount, filteredData.length, isFetchingMore]);

  const loadMoreData = () => {
    setIsFetchingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setIsFetchingMore(false);
    }, 800);
  };

  // ✅ Sort Handler: 3-state cycle → asc → desc → none
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: null };
    });
  };

  const getRecruiterName = (addedBy) => {
    if (!addedBy) return "Unknown";
    if (addedBy.email) return addedBy.email.split("@")[0];
    if (typeof addedBy === "string" && addedBy.includes("@"))
      return addedBy.split("@")[0];
    return "Unknown";
  };

  // ✅ Sorted Data (memoized for performance)
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = "";
      let bVal = "";

      switch (sortConfig.key) {
        case "name":
          aVal = a.name || "";
          bVal = b.name || "";
          break;
        case "phone":
          aVal = a.phone || "";
          bVal = b.phone || "";
          break;
        case "company":
          aVal = a.assignedCompanyName || "";
          bVal = b.assignedCompanyName || "";
          break;
        case "process":
          aVal = a.assignedProcess || "";
          bVal = b.assignedProcess || "";
          break;
        case "status":
          aVal = a.status || "";
          bVal = b.status || "";
          break;
        case "addedBy":
          aVal = getRecruiterName(a.addedBy);
          bVal = getRecruiterName(b.addedBy);
          break;
        default:
          return 0;
      }

      const cmp = String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase());
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
  }, [filteredData, sortConfig]);

  const visibleData = sortedData.slice(0, visibleCount);

  const getActionPath = (actionType, id) => {
    const basePath =
      role === "recruiter"
        ? "/dashboard/recruiter/recruiters"
        : "/dashboard/admin/recruiters";
    return `${basePath}/${actionType}/${id}`;
  };

  const confirmDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const res = await axios.delete(`/api/employees/${id}`);
        if (res.data.success) {
          toast.success("Candidate deleted successfully!");
          window.location.reload();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete candidate",
        );
      }
    }
  };

  const getColSpan = () => {
    let span = 6;
    if (isAdminOrSuper) span += 1;
    if (showPayoutColumn) span += 1;
    return span;
  };

  // ✅ Reusable sortable TH
  const SortableTh = ({ label, column, className = "" }) => (
    <th
      className={`px-6 py-4 cursor-pointer select-none hover:text-blue-600 hover:bg-blue-50/50 transition-colors ${className}`}
      onClick={() => handleSort(column)}
    >
      <span className="inline-flex items-center gap-0.5">
        {label}
        <SortIcon column={column} sortConfig={sortConfig} />
      </span>
    </th>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 w-12 text-center">ID</th>

              <SortableTh label="Employee Details" column="name" />
              <SortableTh label="Contact" column="phone" />
              <SortableTh label="Placement Company" column="company" />
              <SortableTh label="Process / Opening" column="process" />

              {isAdminOrSuper && (
                <SortableTh label="Added By" column="addedBy" />
              )}

              {showPayoutColumn && <th className="px-6 py-4">Payout</th>}

              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={getColSpan()}
                  className="text-center py-10 font-bold text-[#092a49]"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#1d4ed8] border-t-transparent rounded-full animate-spin"></div>
                    Loading Employees...
                  </div>
                </td>
              </tr>
            ) : visibleData.length > 0 ? (
              <>
                {visibleData.map((emp, index) => (
                  <tr
                    key={emp._id}
                    className="border-b border-gray-50 even:bg-gray-50/50 hover:bg-[#e6f4ff] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 font-bold text-gray-400 text-center">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Exp: {emp.experience || "N/A"}
                      </div>
                      <div className="mt-1.5 inline-flex flex-wrap gap-1">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border 
                          ${emp.status === "Selected" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${emp.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
                          ${emp.status === "Attendees" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                          ${emp.status === "LineUp" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          ${emp.status === "On Hold" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
                          ${emp.status === "Joining" ? "bg-teal-50 text-teal-700 border-teal-300" : ""}
                          ${emp.status === "Payout" ? "bg-purple-50 text-purple-700 border-purple-300" : ""}
                          ${emp.status === "Abscond" ? "bg-slate-50 text-slate-700 border-slate-300" : ""}
                        `}
                        >
                          {emp.status}
                        </span>

                        {emp.status === "Joining" && emp.actualSalary && (
                          <div className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            FINAL: ₹{emp.actualSalary}
                          </div>
                        )}
                        {emp.remark && (
                          <button
                            onClick={() =>
                              setSelectedRemark({
                                name: emp.name,
                                text: emp.remark,
                              })
                            }
                            className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 px-2 py-0.5 rounded shadow-sm transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                            </svg>
                            View Remark
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-m text-gray-800">
                      <div className="font-medium whitespace-nowrap">
                        {emp.phone}
                      </div>
                      <div className="text-xs mt-0.5 truncate max-w-37.5">
                        {emp.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#092a49]">
                      {emp.assignedCompanyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.assignedProcess}
                    </td>

                    {isAdminOrSuper && (
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold capitalize shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          {getRecruiterName(emp.addedBy)}
                        </div>
                      </td>
                    )}

                    {showPayoutColumn && (
                      <td className="px-6 py-4">
                        {emp.status === "Joining" || emp.status === "Payout" ? (
                          <PayoutBadge emp={emp} />
                        ) : (
                          <span className="text-gray-300 text-xs">-</span>
                        )}
                      </td>
                    )}

                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link href={getActionPath("view", emp._id)}>
                        <button className="px-4 py-1.5 cursor-pointer text-[#092a49] bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-bold transition-colors">
                          View
                        </button>
                      </Link>
                      <Link href={getActionPath("edit", emp._id)}>
                        <button className="px-4 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer text-xs font-bold transition-colors">
                          Edit
                        </button>
                      </Link>
                      {role === "superadmin" && (
                        <button
                          onClick={() => confirmDelete(emp._id, emp.name)}
                          className="px-4 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer text-xs font-bold transition-colors border border-red-100"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {visibleCount < filteredData.length && (
                  <tr ref={loaderRef}>
                    <td colSpan={getColSpan()} className="text-center py-6">
                      <div className="flex justify-center items-center gap-2 text-gray-500 font-medium text-sm">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Loading more candidates...
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td
                  colSpan={getColSpan()}
                  className="text-center py-10 text-gray-400 italic"
                >
                  No {activeTab} employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
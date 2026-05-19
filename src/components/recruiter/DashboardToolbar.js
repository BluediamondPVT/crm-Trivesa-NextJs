// src/components/recruiter/DashboardToolbar.js
import React from "react";

export default function DashboardToolbar({
  userRole,
  activeTab,
  totalPayout,
  searchTerm,
  setSearchTerm,
}) {
  const isAdminOrSuper = ["admin", "superadmin"].includes(
    userRole?.toLowerCase(),
  );

  const showTotalPayout =
    isAdminOrSuper &&
    ["Joining", "Payout", "All"].includes(activeTab) &&
    totalPayout > 0;

  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* LEFT SIDE: TOTAL PAYOUT WIDGET (Only for Admin/SuperAdmin) */}
      <div className="w-full sm:w-auto h-full flex items-center">
        {showTotalPayout && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 px-5 py-3 rounded-2xl shadow-sm w-full sm:w-auto">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg shadow-sm border border-purple-200/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                Total Candidate Payout
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-purple-900 tracking-tight leading-none">
                ₹{totalPayout.toLocaleString("en-IN")}
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: SEARCH BAR */}
      <div className="relative w-full sm:max-w-lg">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, phone, skills, salary..."
          className="w-full p-4 pl-12 text-base font-medium text-[#092a49] bg-white border-2 border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:border-blue-300 focus:bg-blue-50/30 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all duration-300 placeholder-gray-400 tracking-wide"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

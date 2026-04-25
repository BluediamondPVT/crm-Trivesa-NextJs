import Link from "next/link";

export default function DashboardHeader({
  role,
  dateFilter,
  setDateFilter,
  handleDownload,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-[#092a49]">
          Candidates / LineUps
        </h1>
        <p className="text-gray-500 mt-1">
          Manage Candidates pipelines and Attendees
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* 1. DATE FILTER DROPDOWN */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2.5 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
        >
          <option value="All">All Time</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="7Days">Last 7 Days</option>
          <option value="30Days">Last 30 Days</option>
        </select>

        {/* 2. EXPORT BUTTON (Only for Admin) */}
        {role && role.toLowerCase() === "admin" && (
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white text-sm px-4 py-2.5 rounded-lg font-semibold hover:bg-green-700 shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export Data
          </button>
        )}

        {/* 3. ADD EMPLOYEE BUTTON */}
        <Link
          href="/dashboard/admin/recruiters/add"
          className="bg-[#183e61] text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-[#061a2e] shadow-sm transition-colors"
        >
          + Add Employee
        </Link>
      </div>
    </div>
  );
}

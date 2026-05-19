// src/components/recruiter/DashboardHeader.js
import Link from "next/link";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // 🚀 NAYA: Calendar ki Premium CSS

export default function DashboardHeader({
  role,
  dateFilter,
  setDateFilter,
  handleDownload,
  customStartDate,
  setCustomStartDate,
}) {
  console.log("Current Role in Header:", role);

  const addCandidatePath =
    role === "recruiter"
      ? "/dashboard/recruiter/recruiters/add"
      : "/dashboard/admin/recruiters/add";

  // 🚀 JADOO: React Datepicker ke liye Custom Button (Design wahi purana premium wala)
  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className="relative flex items-center gap-2 px-3 py-1.5 hover:bg-blue-50/50 transition-colors cursor-pointer group"
    >
      <span
        className={`text-sm font-bold tracking-wide ${
          value ? "text-[#092a49]" : "text-gray-400"
        }`}
      >
        {value || "Select Date"}
      </span>

      <div
        className={`p-1.5 rounded-md transition-colors ${
          value
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
          />
        </svg>
      </div>
    </div>
  ));
  CustomDateInput.displayName = "CustomDateInput";

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
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              if (e.target.value !== "Custom") {
                if (setCustomStartDate) setCustomStartDate("");
              }
            }}
            className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2.5 rounded-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer"
          >
            <option value="All">All Time</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="7Days">Last 7 Days</option>
            <option value="30Days">Last 30 Days</option>
            <option value="Custom">Custom Date</option>
          </select>

          {/* 🚀 THIRD-PARTY DATE PICKER COMPONENT */}
          {dateFilter === "Custom" && (
            <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm animate-in fade-in zoom-in duration-300 overflow-visible z-50">
              <div className="px-3 py-2 bg-gray-50 border-r border-gray-200">
                <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                  From
                </span>
              </div>

              {/* 🚀 Pura Calendar Magic Idhar Hai */}
              <DatePicker
                selected={customStartDate ? new Date(customStartDate) : null}
                onChange={(date) => setCustomStartDate(date ? date.toISOString() : "")}
                
                // 🚀 MAGIC: In dono lines ki wajah se Picked Date aur Today ke beech YELLOW line aayegi!
                startDate={customStartDate ? new Date(customStartDate) : null} 
                endDate={new Date()} 

                customInput={<CustomDateInput />}
                dateFormat="dd-MM-yyyy"
                maxDate={new Date()} // Aaj ke aage ki date block kar di
                showMonthDropdown 
                showYearDropdown 
                dropdownMode="select"
              />

              <div className="px-3 py-2 border-l border-gray-200 bg-blue-50/50">
                <span className="text-blue-700 font-black text-[10px] uppercase tracking-wider">
                  To Today
                </span>
              </div>
            </div>
          )}
        </div>

        {role && ["admin", "superadmin"].includes(role.toLowerCase()) && (
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

        <Link href={addCandidatePath}>
          <button className="bg-[#092a49] cursor-pointer text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
            + Add Candidate
          </button>
        </Link>
      </div>
    </div>
  );
}

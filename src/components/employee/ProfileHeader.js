// src/components/employee/ProfileHeader.js
export default function ProfileHeader({ employee }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-l-8 border-[#092a49] p-6 sm:p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
          {employee.name}
        </h1>
        <p className="text-gray-500 text-sm font-medium">
          Candidate ID: {employee._id}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">
          Current Status
        </span>
        <span
          className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-full border 
            ${employee.status === "Selected" ? "bg-green-50 text-green-700 border-green-200" : ""}
            ${employee.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
            ${employee.status === "Attendees" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
            ${employee.status === "LineUp" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
            ${employee.status === "On Hold" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
            ${employee.status === "Joining" ? "bg-teal-50 text-teal-700 border-teal-300" : ""}
          `}
        >
          {employee.status}
        </span>
      </div>
    </div>
  );
}
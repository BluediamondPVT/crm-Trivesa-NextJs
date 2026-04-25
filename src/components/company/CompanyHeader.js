import Link from "next/link"; // Ye import add karo
import { useEffect, useState } from "react";

export default function CompanyHeader({ company }) {

  // NAYA: Role save karne ke liye state
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border-l-8 border-[#092a49] p-6 sm:p-8 mb-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {company.name}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${company.status === "Active" ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}
            >
              {company.status}
            </span>
          </div>
          <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">
            {company.description}
          </p>
        </div>
        
        {/* NAYA: Link wrapper add kiya yahan */}
        {userRole !== "recruiter" && (
        <Link href={`/dashboard/admin/edit-client/${company._id}`}>
          <button className="bg-[#1d4ed8] text-white cursor-pointer px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1e40af] shadow-md transition-all flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            Edit Company
          </button>
        </Link>
        )}
      </div>
    </div>
  );
}
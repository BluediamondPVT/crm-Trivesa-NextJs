import { useState, useEffect } from "react";
import Link from "next/link";

export default function CRMTable({ data, onDelete }) {
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Agar delete karne se current page khali ho jaye toh pichle page par bhej do
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [data.length, currentPage, totalPages]);

  // Current page ka data slice karo
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10 border border-gray-100 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#092a49]">
          Recent CRM (Active/Non-Active)
        </h3>
        <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded">
          Excluding Process & Listed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <th className="px-6 py-4 w-12 text-center">#</th>
              <th className="px-6 py-4 w-48">Company Name</th>
              <th className="px-6 py-4 w-24">Status</th>
              <th className="px-6 py-4 w-32">Phone</th>
              <th className="px-6 py-4 min-w-[200px]">Address</th>
              <th className="px-6 py-4 w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((company, index) => (
                <tr
                  key={company._id}
                  className="hover:bg-[#e6f4ff] transition-colors duration-200 group"
                >
                  <td className="px-6 py-4 text-gray-600 font-medium text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800 line-clamp-1">
                      {company.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {company.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-1 text-[10px] font-bold rounded-md ${
                        company.status === "Active"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-medium whitespace-nowrap">
                    {company.phone}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs line-clamp-2 mt-2">
                    {company.address || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                    <Link
                      href={`/dashboard/admin/company/${company._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[#1d4ed8] bg-blue-50 hover:bg-blue-100 rounded-md font-medium text-xs transition-colors cursor-pointer"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => onDelete(company._id, company.name)}
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

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center mt-auto">
          <span className="text-sm text-gray-500 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
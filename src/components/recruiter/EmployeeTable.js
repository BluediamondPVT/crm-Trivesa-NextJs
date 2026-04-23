import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function EmployeeTable({
  filteredData,
  loading,
  activeTab,
  setSelectedRemark,
}) {
  // Infinite Scroll States
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef(null);

  // Jab bhi tab change ho (e.g., LineUp se Selected), count wapas 10 kar do
  useEffect(() => {
    setVisibleCount(10);
  }, [activeTab, filteredData.length]);

  // Intersection Observer (Scroll detect karne ke liye)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
      
        if (target.isIntersecting && visibleCount < filteredData.length && !isFetchingMore) {
          loadMoreData();
        }
      },
      { threshold: 0.1 } // Thoda sa dikhte hi trigger ho jayega
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleCount, filteredData.length, isFetchingMore]);

  const loadMoreData = () => {
    setIsFetchingMore(true);
    // Fake delay taaki user ko loader dikhe (UX acha karne ke liye)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setIsFetchingMore(false);
    }, 800);
  };

  // Sirf utna hi data dikhao jitna visibleCount allow kare
  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 w-12 text-center">ID</th>
              <th className="px-6 py-4">Employee Details</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Placement Company</th>
              <th className="px-6 py-4">Process / Opening</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-10 font-bold text-[#092a49]">
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
                      {emp.status === "Joining" && emp.actualSalary && (
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          FINAL: ₹{emp.actualSalary}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-m text-gray-800">
                      <div className="font-medium whitespace-nowrap">{emp.phone}</div>
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
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-start gap-2">
                        <span
                          className={`px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full border 
                          ${emp.status === "Selected" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${emp.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
                          ${emp.status === "Attendees" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                          ${emp.status === "LineUp" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          ${emp.status === "On Hold" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
                          ${emp.status === "Joining" ? "bg-teal-50 text-teal-700 border-teal-300" : ""}
                          ${emp.status === "Payout" ? "bg-purple-50 text-purple-700 border-purple-300" : ""}
                        `}
                        >
                          {emp.status}
                        </span>
                        {emp.remark && (
                          <button
                            onClick={() =>
                              setSelectedRemark({
                                name: emp.name,
                                text: emp.remark,
                              })
                            }
                            className="flex items-center gap-1.5 text-[10px] bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 px-2.5 py-1.5 rounded shadow-sm transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
                            </svg>
                            View Remark
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link href={`/dashboard/admin/recruiters/view/${emp._id}`}>
                        <button className="px-4 py-1.5 cursor-pointer text-[#092a49] bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-bold transition-colors">
                          View
                        </button>
                      </Link>
                      <Link href={`/dashboard/admin/recruiters/edit/${emp._id}`}>
                        <button className="px-4 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer text-xs font-bold transition-colors">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}

                {/* SCROLL LOADER (Intersection Observer Target) */}
                {visibleCount < filteredData.length && (
                  <tr ref={loaderRef}>
                    <td colSpan="7" className="text-center py-6">
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
                <td colSpan="7" className="text-center py-10 text-gray-400 italic">
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
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function CompanyStatusTable({ filteredCompanies, currentStatus, handleDelete }) {
  // Infinite Scroll States
  const [visibleCount, setVisibleCount] = useState(20);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef(null);

  const [userRole, setUserRole] = useState(null);

  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.data?.role) {
          setUserRole(data.data.role);
        }
      } catch (error) {
        console.error("Failed to fetch role:", error);
      }
    };
    fetchUserRole();
  }, []);

  // Status change hone pe visible count reset karo
  useEffect(() => {
    setVisibleCount(20);
  }, [currentStatus]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleCount < filteredCompanies.length && !isFetchingMore) {
          loadMoreData();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [visibleCount, filteredCompanies.length, isFetchingMore]);

  const loadMoreData = () => {
    setIsFetchingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 20);
      setIsFetchingMore(false);
    }, 600); // 600ms ka smooth fake delay
  };

  // Header Color Logic
  const getHeaderStyle = () => {
    if (currentStatus === "Active") return "border-[#16a34a] text-[#16a34a]"; // Green
    if (currentStatus === "Non Active") return "border-[#dc2626] text-[#dc2626]"; // Red
    if (currentStatus === "Process") return "border-[#ea580c] text-[#ea580c]"; // Orange
    if (currentStatus === "Listed") return "border-[#2563eb] text-[#2563eb]"; // Blue
    return "border-[#092a49] text-[#092a49]";
  };

  // 🚀 FIX 3: Dynamic Path Logic for Admin vs Recruiter
  const getViewPath = (id) => {
    const basePath = userRole === "recruiter" ? "/dashboard/recruiter" : "/dashboard/admin";
    return `${basePath}/company/${id}`;
  };

  // Sirf utna data nikaalo jitna dikhana hai
  const visibleData = filteredCompanies.slice(0, visibleCount);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`px-6 py-4 border-b-2 bg-gray-50/50 ${getHeaderStyle()}`}>
        <h3 className="font-bold uppercase tracking-wider text-sm">
          {currentStatus} LIST ({filteredCompanies.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-225">
          <thead>
            <tr className="bg-white border-b border-gray-100 text-xs text-gray-600 font-bold uppercase tracking-wider">
              <th className="px-6 py-4 w-12">#</th>
              <th className="px-6 py-4 w-48">Company Name</th>
              <th className="px-6 py-4 w-32">Phone Number</th>
              <th className="px-6 py-4 w-40">Email</th>
              <th className="px-6 py-4 min-w-50">Address</th>
              <th className="px-6 py-4 w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {visibleData.length > 0 ? (
              <>
                {visibleData.map((company, index) => (
                  <tr key={company._id} className="hover:bg-[#e6f4ff] transition-colors group">
                    <td className="px-6 py-5 font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-800 line-clamp-1">
                        {company.name}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-600 whitespace-nowrap">
                      {company.phone}
                    </td>
                    <td className="px-6 py-5 text-gray-600 truncate max-w-40">
                      {company.email}
                    </td>
                    <td className="px-6 py-5 text-gray-500 text-xs line-clamp-2 mt-2">
                      {company.address || "N/A"}
                    </td>
                    <td className="px-6 py-5 text-right space-x-2 whitespace-nowrap">
                      
                      {/* 🚀 Dynamic Link Apply Kiya */}
                      <Link href={getViewPath(company._id)}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md font-medium text-xs transition-all border border-blue-200 shadow-sm cursor-pointer whitespace-nowrap">
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </Link>
                      
                      {userRole !== "recruiter" && (
                        <button
                          onClick={() => handleDelete(company._id, company.name)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium text-xs transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Loader Observer Target */}
                {visibleCount < filteredCompanies.length && (
                  <tr ref={loaderRef}>
                    <td colSpan="6" className="text-center py-6">
                      <div className="flex justify-center items-center gap-2 text-gray-500 font-medium text-sm">
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Loading more clients...
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-600 font-medium italic bg-gray-50/30"
                >
                  No {currentStatus.toLowerCase()} companies found right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
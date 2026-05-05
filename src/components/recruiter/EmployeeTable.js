import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

// 🚀 NAYA JADOO: Smart Payout Calculator Component (PERCENTAGE BUG FIXED!)
const PayoutBadge = ({ emp }) => {
  const [payout, setPayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculatePayout = async () => {
      if (!emp.assignedCompanyId || !emp.assignedProcess) {
        setLoading(false);
        return;
      }

      try {
        const compRes = await axios.get(`/api/companies/${emp.assignedCompanyId}`);
        
        if (compRes.data.success) {
          const company = compRes.data.data;
          
          const candidateProcess = String(emp.assignedProcess).toLowerCase().trim();
          const opening = company.openings?.find(
            (o) => String(o.title).toLowerCase().trim() === candidateProcess
          );

          if (opening) {
            let amount = 0;
            let type = opening.payoutType || "Flat Amount";

            // 🟢 LOGIC 1: FLAT AMOUNT
            if (type === "Flat Amount") {
              amount = opening.flatAmount || 0;
            } 
            // 🟢 LOGIC 2: PERCENTAGE (🛠️ 15k, 5LPA BUG FIXED)
            else if (type === "Percentage") {
              const rawStr = String(emp.actualSalary || "0").toLowerCase().trim();
              let actual = parseFloat(rawStr.replace(/[^0-9.]/g, "")) || 0;
              
              // 🧠 SMART PARSER
              if (rawStr.includes("l") || rawStr.includes("lac") || rawStr.includes("lpa")) {
                actual = actual * 100000; // Agar 'L' likha hai, toh 1 Lakh se multiply (e.g., 5.5L -> 550000)
              } else if (rawStr.includes("k")) {
                actual = actual * 1000; // Agar 'k' likha hai, toh 1000 se multiply (e.g., 15k -> 15000)
              } else if (actual > 0 && actual < 100) {
                actual = actual * 100000; // Agar kuch nahi likha par value 100 se kam hai (e.g., "5.5"), toh default Lakhs manega
              }

              const percent = Number(opening.percentageValue) || 0;
              
              // Calculation: (Salary * Percentage) / 100
              amount = Math.round((actual * percent) / 100); 

              // Note: Agar 15k monthly CTC hai aur tu chahta hai ki Payout saal (12 months) pe calculate ho,
              // toh bata dena, hum (actual * 12 * percent) / 100 kar denge. Abhi exact value pe ho raha hai.
            } 
            // 🟢 LOGIC 3: SLAB WISE
            else if (type === "Slab Wise") {
              const empRes = await axios.get("/api/employees"); 
              if (empRes.data.success) {
                const allEmps = empRes.data.data;
                
                const joinedEmps = allEmps.filter(
                  (e) => 
                    e.assignedCompanyId === emp.assignedCompanyId &&
                    String(e.assignedProcess).toLowerCase().trim() === candidateProcess &&
                    (e.status === "Joining" || e.status === "Payout")
                );

                joinedEmps.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

                const rankIndex = joinedEmps.findIndex((e) => e._id === emp._id);
                const rank = rankIndex !== -1 ? rankIndex + 1 : joinedEmps.length + 1;

                const matchedSlab = opening.slabs?.find(
                  (s) => rank >= s.minJoinees && rank <= s.maxJoinees
                );

                if (matchedSlab) {
                  amount = matchedSlab.amount;
                }
              }
            }

            setPayout({ amount, type });
          }
        }
      } catch (error) {
        console.error("Error calculating payout:", error);
      } finally {
        setLoading(false);
      }
    };

    calculatePayout();
  }, [emp]);

  if (loading) return <span className="mt-1.5 ml-2 text-[10px] text-gray-400 animate-pulse">Calculating...</span>;
  if (!payout) return null;

  return (
    <div className="mt-1.5 ml-2 inline-flex items-center gap-1 bg-purple-50 border border-purple-200 text-purple-700 px-2.5 py-0.5 rounded text-[10px] font-black tracking-wide shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      PAYOUT: ₹{payout.amount}
      <span className="text-[8px] font-semibold opacity-75 ml-0.5 uppercase">({payout.type})</span>
    </div>
  );
};

export default function EmployeeTable({
  filteredData,
  loading,
  activeTab,
  setSelectedRemark,
  role = "admin", 
}) {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const loaderRef = useRef(null);

  const isAdminOrSuper = ["admin", "superadmin"].includes(role?.toLowerCase());

  useEffect(() => {
    setVisibleCount(10);
  }, [activeTab, filteredData.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && visibleCount < filteredData.length && !isFetchingMore) {
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
  }, [visibleCount, filteredData.length, isFetchingMore]);

  const loadMoreData = () => {
    setIsFetchingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 10);
      setIsFetchingMore(false);
    }, 800);
  };

  const visibleData = filteredData.slice(0, visibleCount);

  const getActionPath = (actionType, id) => {
    const basePath = role === "recruiter"
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
        toast.error(error.response?.data?.message || "Failed to delete candidate");
      }
    }
  };

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
                      
                      <div className="flex flex-wrap items-center mt-1">
                        {emp.status === "Joining" && emp.actualSalary && (
                          <div className="mt-1.5 inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            FINAL: ₹{emp.actualSalary}
                          </div>
                        )}

                        {isAdminOrSuper && emp.status === "Joining" && (
                           <PayoutBadge emp={emp} />
                        )}
                      </div>
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
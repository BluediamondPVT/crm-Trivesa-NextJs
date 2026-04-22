"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";

export default function RecruiterStatusPage() {
  const params = useParams();
  const router = useRouter();
  const rawStatus = params.status;

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL status ko Database status se match karne ka map
  const statusMap = {
    lineup: "LineUp",
    attendees: "Attendees", // Fixed spelling
    selected: "Selected",
    rejected: "Rejected",
  };

  const currentStatus = statusMap[rawStatus] || "LineUp";

  const fetchEmployeesByStatus = async () => {
    try {
      const response = await axios.get("/api/employees");

      if (response.data.success) {
        const allEmployees = response.data.data;
        const filtered = allEmployees.filter(
          (emp) => emp.status === currentStatus
        );
        setFilteredEmployees(filtered);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesByStatus();
  }, [currentStatus]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`/api/employees/${id}`);
      toast.success("Employee deleted successfully");
      setFilteredEmployees(filteredEmployees.filter(emp => emp._id !== id));
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Header Colors based on Status
  const getHeaderStyle = () => {
    if (currentStatus === "LineUp") return "border-[#1d4ed8] text-[#1d4ed8]";
    if (currentStatus === "Attendees") return "border-[#ea580c] text-[#ea580c]";
    if (currentStatus === "Selected") return "border-[#16a34a] text-[#16a34a]";
    if (currentStatus === "Rejected") return "border-[#dc2626] text-[#dc2626]";
    return "border-[#092a49] text-[#092a49]";
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-gray-500">Loading {currentStatus} Candidates...</div>;
  }

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto">
      
      <button 
        onClick={() => router.push('/dashboard/admin/recruiters')} 
        className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-[#0796fe] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        Back to All Recruiters
      </button>

      <div className="mb-8 border-l-[6px] pl-4 rounded-sm border-gray-800">
        <h1 className="text-3xl font-extrabold text-[#092a49]">
          {currentStatus} <span className="font-light">Candidates</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Showing all candidates currently in {currentStatus.toLowerCase()} status.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`px-6 py-4 border-b-2 bg-gray-50/50 ${getHeaderStyle()}`}>
          <h3 className="font-bold uppercase tracking-wider text-sm">
            {currentStatus} LIST ({filteredEmployees.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-600 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-12">#</th>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Placement Company</th>
                <th className="px-6 py-4">Process / Opening</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => (
                  <tr key={emp._id} className="hover:bg-[#e6f4ff] transition-colors group">
                    <td className="px-6 py-5 font-medium text-gray-500">{index + 1}</td>
                    
                    <td className="px-6 py-5">
                      <div className="font-bold text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Exp: {emp.experience || 'N/A'}</div>
                    </td>
                    
                    <td className="px-6 py-5 text-gray-600 whitespace-nowrap">
                      <div>📞 {emp.phone}</div>
                      <div className="text-xs mt-0.5">✉️ {emp.email || 'N/A'}</div>
                    </td>
                    
                    <td className="px-6 py-5 font-bold text-[#092a49]">
                      {emp.assignedCompanyName || 'Unassigned'}
                    </td>

                    <td className="px-6 py-5 text-gray-600">
                      {emp.assignedProcess || 'N/A'}
                    </td>
                    
                   {/* // Sirf Actions wale <td> ko isse replace kar do table body mein */}
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-600 font-medium italic bg-gray-50/30">
                    No {currentStatus.toLowerCase()} candidates found right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
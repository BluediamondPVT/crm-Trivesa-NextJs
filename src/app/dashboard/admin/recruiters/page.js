"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function RecruiterDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState("LineUp");
  
  // Modal dikhane ke liye state
  const [selectedRemark, setSelectedRemark] = useState(null); 

  // NAYA: "Joining" tab add kiya
  const tabs = [
    "All",
    "LineUp",
    "Attendees",
    "On Hold",
    "Selected",
    "Rejected",
    "Joining", 
    "Payout", 
  ];

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/employees");
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
      toast.success("Employee deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Filter logic based on tab
  const filteredData =
    activeTab === "All"
      ? employees
      : employees.filter((emp) => emp.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">
            Recruiters / LineUps
          </h1>
          <p className="text-gray-500 mt-1">
            Manage employee pipelines and Attendees
          </p>
        </div>
        <Link
          href="/dashboard/admin/recruiters/add"
          className="bg-[#183e61] text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-[#061a2e] shadow-sm transition-colors"
        >
          + Add Employee
        </Link>
      </div>

      {/* TABS UI */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#092a49] text-white border-b-4 border-blue-500"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border-b-4 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
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
                  <td
                    colSpan="7"
                    className="text-center py-10 font-bold text-[#092a49]"
                  >
                    Loading Employees...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((emp, index) => (
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
                      
                      {/* NAYA: ACTUAL SALARY SHOW IN TABLE */}
                      {emp.status === 'Joining' && emp.actualSalary && (
                        <div className="mt-1.5 inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          FINAL: ₹{emp.actualSalary}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-m text-gray-800">
                      <div className="font-medium whitespace-nowrap">
                        {emp.phone}
                      </div>
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
                        {/* Status Badge (Added Joining color) */}
                        <span
                          className={`px-4 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-full border 
                          ${emp.status === "Selected" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${emp.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" : ""}
                          ${emp.status === "Attendees" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                          ${emp.status === "LineUp" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          ${emp.status === "On Hold" ? "bg-yellow-50 text-yellow-700 border-yellow-300" : ""}
                          ${emp.status === "Joining" ? "bg-teal-50 text-teal-700 border-teal-300" : ""}
                        `}
                        >
                          {emp.status}
                        </span>

                        {/* NAYA: Clickable View Remark Button ab HAR status ke liye kaam karega agar remark exist karta hai */}
                        {emp.remark && (
                          <button
                            onClick={() => setSelectedRemark({ name: emp.name, text: emp.remark })}
                            className="flex items-center gap-1.5 text-[10px] bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200 px-2.5 py-1.5 rounded shadow-sm transition-colors cursor-pointer"
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
                      <Link
                        href={`/dashboard/admin/recruiters/view/${emp._id}`}
                      >
                        <button className="px-4 py-1.5 cursor-pointer text-[#092a49] bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-bold transition-colors">
                          View
                        </button>
                      </Link>
                      <Link
                        href={`/dashboard/admin/recruiters/edit/${emp._id}`}
                      >
                        <button className="px-4 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer text-xs font-bold transition-colors">
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No {activeTab} employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REMARK MODAL / POPUP ALERT */}
      {selectedRemark && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full overflow-hidden transform scale-100 transition-all" style={{ maxWidth: '500px' }}>
            
            {/* Modal Header */}
            <div className="bg-[#f8fafc] border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#092a49] flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#1d4ed8]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                Candidate Remark
              </h3>
              <button 
                onClick={() => setSelectedRemark(null)}
                className="text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Candidate: <span className="text-[#092a49] font-extrabold">{selectedRemark.name}</span>
              </p>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl min-h-[100px]">
                <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedRemark.text}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setSelectedRemark(null)}
                className="bg-[#092a49] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#183e61] transition-colors shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
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

  const tabs = ["All", "LineUp", "Attendance", "Selected", "Rejected"];

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
      setEmployees(employees.filter(emp => emp._id !== id));
      toast.success("Employee deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Filter logic based on tab
  const filteredData = activeTab === "All" 
    ? employees 
    : employees.filter(emp => emp.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Recruiters / LineUps</h1>
          <p className="text-gray-500 mt-1">Manage employee pipelines and attendance</p>
        </div>
        <Link href="/dashboard/admin/recruiters/add" className="bg-[#183e61] text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-[#061a2e] shadow-sm transition-colors">
          + Add Employee
        </Link>
      </div>

      {/* TABS UI */}
      <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
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
          <table className="w-full text-left border-collapse min-w-225">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-800 uppercase tracking-wider">
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
                <tr><td colSpan="6" className="text-center py-10 font-bold text-[#092a49]">Loading Employees...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map(emp => (
                  <tr 
                    key={emp._id} 
                    // NAYA: Zebra (even:bg-gray-50/50) and Hover (hover:bg-[#e6f4ff]) Add kiya hai
                    className="border-b border-gray-50 even:bg-gray-50/50 hover:bg-[#e6f4ff] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Exp: {emp.experience || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="font-medium whitespace-nowrap"> {emp.phone}</div>
                      <div className="text-s mt-0.5 truncate max-w-37.5"> {emp.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#092a49]">{emp.assignedCompanyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{emp.assignedProcess}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border 
                        ${emp.status === 'Selected' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${emp.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        ${emp.status === 'Attendance' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                        ${emp.status === 'LineUp' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      `}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {/* Edit Button theek kiya aur Link banaya */}
                      <Link href={`/dashboard/admin/recruiters/${emp._id}`}>
                        <button className="px-3 py-1.5 cursor-pointer text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-md text-xs font-bold transition-colors">
                          View 
                        </button>
                      </Link>
                      {/* Delete Button theek kiya */}
                      <button 
                        onClick={() => handleDelete(emp._id, emp.name)} 
                        className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-md cursor-pointer text-xs font-bold transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400 italic">No {activeTab} employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
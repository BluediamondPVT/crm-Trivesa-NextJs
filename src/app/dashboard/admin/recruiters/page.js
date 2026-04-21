// src/app/dashboard/admin/recruiters/page.js
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function RecruiterDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState("All"); 

  const tabs = ["All (LineUp)", "Attendance", "Selected", "Rejected"];

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
      // Create this delete route later just like you did for companies
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
        <Link href="/dashboard/admin/recruiters/add" className="bg-[#183e61] text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-[#061a2e] shadow-sm">
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase">
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Placement Company</th>
                <th className="px-6 py-4">Process / Opening</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10 font-bold">Loading...</td></tr>
              ) : filteredData.length > 0 ? (
                filteredData.map(emp => (
                  <tr key={emp._id} className="hover:bg-blue-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{emp.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">Exp: {emp.experience || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>📞 {emp.phone}</div>
                      <div className="text-xs">✉️ {emp.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#092a49]">{emp.assignedCompanyName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.assignedProcess}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full 
                        ${emp.status === 'Selected' ? 'bg-green-100 text-green-700' : ''}
                        ${emp.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${emp.status === 'Attendance' ? 'bg-orange-100 text-orange-700' : ''}
                        ${emp.status === 'LineUp' ? 'bg-blue-100 text-blue-700' : ''}
                      `}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="px-3 py-1.5 text-blue-600 bg-blue-50 rounded-md text-xs font-bold">View</button>
                      <button onClick={() => handleDelete(emp._id, emp.name)} className="px-3 py-1.5 text-red-600 bg-red-50 rounded-md text-xs font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-10 text-gray-500 italic">No {activeTab} employees found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [recentCRM, setRecentCRM] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/companies');
        
        if (response.data.success) {
          const allCompanies = response.data.data;

         

          // 2. Filter Recent CRM Table (Exclude Listed and Process)
          const filteredForTable = allCompanies.filter(
            (company) => company.status !== 'Listed' && company.status !== 'Process'
          );
          
          // Optionally, limit to latest 10 records
          setRecentCRM(filteredForTable.slice(0, 10));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-10 flex justify-center font-bold text-[#092a49]">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your system performance</p>
        </div>
        
        <Link 
          href="/dashboard/admin/add-client"
          className="bg-[#183e61] inline-block text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#061a2e] shadow-sm transition-colors"
        >
          + Add Clients
        </Link>
      </div>


      {/* Recent CRM Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#092a49]">Recent CRM (Active/Non-Active)</h3>
          <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded">Excluding Process & Listed</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">  
              {recentCRM.length > 0 ? recentCRM.map((company, index) => (
                <tr key={company._id} className="border-b border-gray-50 even:bg-gray-50/50 hover:bg-[#e6f4ff] transition-colors duration-200 group">
                  <td className="px-6 py-5 text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-5 font-bold text-gray-800">{company.name}</td>
                  <td className="px-3 py-5 text-gray-600">{company.phone}</td>
                  <td className="px-6 py-5 text-gray-600">{company.email}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${company.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right space-x-2 whitespace-nowrap">
                    <Link href={`/dashboard/admin/company/${company._id}`}>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 group-hover:bg-white rounded-md font-medium text-xs transition-all border border-green-200 shadow-sm cursor-pointer">
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">No active or non-active companies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
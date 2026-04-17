'use client';

import { useState } from 'react';

export default function RecruitersPage() {
  // Temporary Dummy Data for Recruiters
  const [recruiters] = useState([
    { id: 1, name: 'Amit Sharma', email: 'amit@trivesa.com', phone: '+91 9876543210', activeCompanies: 12, status: 'Active' },
    { id: 2, name: 'Priya Patel', email: 'priya@trivesa.com', phone: '+91 8765432109', activeCompanies: 8, status: 'Active' },
    { id: 3, name: 'Rahul Verma', email: 'rahul@trivesa.com', phone: '+91 7654321098', activeCompanies: 0, status: 'On Leave' },
  ]);

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Recruiters Team</h1>
          <p className="text-gray-500 mt-1">Manage your recruiting staff and their performance.</p>
        </div>
        <button className="bg-[#0796fe] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0680d9] shadow-sm">
          + Add Recruiter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Recruiter Name</th>
                <th className="px-6 py-4">Contact Details</th>
                <th className="px-6 py-4 text-center">Assigned Companies</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {recruiters.map((recruiter, index) => (
                <tr key={recruiter.id} className="hover:bg-[#e6f4ff] transition-colors group">
                  <td className="px-6 py-4 font-medium text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{recruiter.name}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{recruiter.email}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{recruiter.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-[#0796fe]">{recruiter.activeCompanies}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${recruiter.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {recruiter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium text-xs transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
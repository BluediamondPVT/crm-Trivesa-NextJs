// src/app/dashboard/admin/page.js
'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  const recentCRM = [
    { id: 1, companyName: 'Tata Consultancy Services', phone: '+91 22 6778 9999', email: 'careers@tcs.com', address: 'Banyan Park, Andheri East, Mumbai' },
    { id: 2, companyName: 'Infosys Limited', phone: '+91 80 2852 0261', email: 'talent@infosys.com', address: 'Electronics City, Bengaluru' },
    { id: 3, companyName: 'Tech Mahindra', phone: '+91 20 6601 8100', email: 'hr.support@techmahindra.com', address: 'Hinjewadi Phase III, Pune' },
    { id: 4, companyName: 'Wipro Technologies', phone: '+91 80 2844 0011', email: 'reachus@wipro.com', address: 'Sarjapur Road, Bengaluru' },
    { id: 5, companyName: 'HCLTech', phone: '+91 120 436 1200', email: 'careers@hcl.com', address: 'Sector 126, Noida' },
    { id: 6, companyName: 'Cognizant Technology Solutions', phone: '+91 44 4209 6000', email: 'inquiry@cognizant.com', address: 'MEPZ Special Economic Zone, Chennai' },
    { id: 7, companyName: 'Accenture India', phone: '+91 22 4151 6000', email: 'india.careers@accenture.com', address: 'Vikhroli Corporate Park, Mumbai' },
    { id: 8, companyName: 'Capgemini India', phone: '+91 20 2756 3000', email: 'contact.in@capgemini.com', address: 'Talwade MIDC IT Tower, Pune' },
    { id: 9, companyName: 'IBM India', phone: '+91 80 4068 3000', email: 'recruitment@in.ibm.com', address: 'Manyata Tech Park, Bengaluru' },
    { id: 10, companyName: 'Oracle India', phone: '+91 40 6605 0000', email: 'hr-india_in@oracle.com', address: 'HITEC City, Hyderabad' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 md:p-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 mt-2 sm:mt-0">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your system performance</p>
        </div>
        <button className="bg-[#183e61] text-white cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#061a2e] shadow-sm">
          + Add Clients
        </button>
      </div>

      {/* Metric Cards */}
   {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        
        {/* Card 1: Total (Non-clickable just for overall stats) */}
        <div className="bg-white rounded-2xl shadow-sm border-l-[6px] border-[#092a49] p-5 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Total</p>
            <h3 className="text-3xl font-bold text-gray-800">42</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#092a49] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
          </div>
        </div>

        {/* Card 2: Active (Clickable) */}
        <Link href="/dashboard/admin/companies/active" className="bg-white rounded-2xl shadow-sm border-l-[6px] border-green-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Active</p>
            <h3 className="text-3xl font-bold text-gray-800">18</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
            {/* Check/Bolt Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
          </div>
        </Link>

        {/* Card 3: Non Active (Clickable) */}
        <Link href="/dashboard/admin/companies/non-active" className="bg-white rounded-2xl shadow-sm border-l-[6px] border-red-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Non Active</p>
            <h3 className="text-3xl font-bold text-gray-800">5</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
            {/* Pause/Cancel Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" /></svg>
          </div>
        </Link>

        {/* Card 4: Process (Clickable) */}
        <Link href="/dashboard/admin/companies/process" className="bg-white rounded-2xl shadow-sm border-l-[6px] border-orange-400 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Process</p>
            <h3 className="text-3xl font-bold text-gray-800">7</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            {/* Clock/Refresh Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
          </div>
        </Link>

        {/* Card 5: Listed (Clickable) */}
        <Link href="/dashboard/admin/companies/listed" className="bg-white rounded-2xl shadow-sm border-l-[6px] border-blue-500 p-5 flex justify-between items-center cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-200">
          <div>
            <p className="text-xs font-bold text-gray-400 tracking-wider mb-2 uppercase">Listed</p>
            <h3 className="text-3xl font-bold text-gray-800">12</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            {/* Document/List Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
          </div>
        </Link>

      </div>

      {/* Recent CRM Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-10">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#092a49]">Recent CRM</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">  
              {recentCRM.map((post, index) => (
                <tr key={post.id} className="border-b border-gray-50 even:bg-gray-50/50 hover:bg-[#e6f4ff] transition-colors duration-200 group">
                  <td className="px-6 py-5 text-gray-500 font-medium">{index + 1}</td>
                  <td className="px-6 py-5 font-medium text-gray-800">{post.companyName}</td>
                  <td className="px-3 py-5 text-gray-600">{post.phone}</td>
                  <td className="px-6 py-5 text-gray-600">{post.email}</td>
                  <td className="px-3 py-5 text-gray-500">{post.address}</td>
                  <td className="px-6 py-5 text-right space-x-2 whitespace-nowrap">
                    <Link href={`/dashboard/admin/company/${post.id}`}>
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 group-hover:bg-white rounded-md font-medium text-xs transition-all border border-green-200 shadow-sm cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </Link>
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
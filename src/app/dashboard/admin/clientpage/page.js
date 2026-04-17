// src/app/dashboard/admin/page.js
'use client';
import Link from 'next/link';

export default function ClientsPage() {
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
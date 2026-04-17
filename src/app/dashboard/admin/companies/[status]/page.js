'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompanyStatusPage() {
  const params = useParams();
  const rawStatus = params.status; // URL se milega: 'active', 'non-active', 'process', 'listed'

  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  // URL wale status ko actual DB status se map karne ka logic
  const statusMap = {
    'active': 'Active',
    'non-active': 'Non Active',
    'process': 'Process',
    'listed': 'Listed'
  };

  const currentStatus = statusMap[rawStatus] || 'Active'; // Default to Active

  useEffect(() => {
    // Ye wahi dashboard wala dummy data hai, abhi ke liye test karne ke liye
    // Jab backend judega, tab hum direct /api/companies?status=currentStatus hit karenge
    const allCompanies = [
      { id: 1, companyName: 'Tata Consultancy Services', phone: '+91 22 6778 9999', email: 'careers@tcs.com', status: 'Active' },
      { id: 2, companyName: 'Infosys Limited', phone: '+91 80 2852 0261', email: 'talent@infosys.com', status: 'Process' },
      { id: 3, companyName: 'Tech Mahindra', phone: '+91 20 6601 8100', email: 'hr@techm.com', status: 'Non Active' }, 
      { id: 4, companyName: 'Wipro Technologies', phone: '+91 80 2844 0011', email: 'reachus@wipro.com', status: 'Listed' },
      { id: 5, companyName: 'HCLTech', phone: '+91 120 436 1200', email: 'careers@hcl.com', status: 'Active' },
    ];

    setTimeout(() => {
      // Data ko filter kar rahe hain status ke hisaab se
      const filtered = allCompanies.filter(company => company.status === currentStatus);
      setFilteredCompanies(filtered);
      setLoading(false);
    }, 500);
  }, [currentStatus]);

  // Dynamic header color design
  const getHeaderStyle = () => {
    if (currentStatus === 'Active') return 'border-[#16a34a] text-[#16a34a]'; // Green
    if (currentStatus === 'Non Active') return 'border-[#dc2626] text-[#dc2626]'; // Red
    if (currentStatus === 'Process') return 'border-[#ea580c] text-[#ea580c]'; // Orange
    if (currentStatus === 'Listed') return 'border-[#2563eb] text-[#2563eb]'; // Blue
    return 'border-[#092a49] text-[#092a49]';
  };

  if (loading) {
    return <div className="p-10 text-center font-bold text-gray-500">Loading {currentStatus} Companies...</div>;
  }

  return (
    <div className="p-4 sm:p-8 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 border-l-[6px] pl-4 rounded-sm border-gray-800">
        <h1 className="text-3xl font-extrabold text-[#092a49]">
          {currentStatus} <span className="font-light">Companies</span>
        </h1>
        <p className="text-gray-500 mt-1">Showing all companies currently marked as {currentStatus.toLowerCase()}.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`px-6 py-4 border-b-2 bg-gray-50/50 ${getHeaderStyle()}`}>
          <h3 className="font-bold uppercase tracking-wider text-sm">{currentStatus} LIST ({filteredCompanies.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company, index) => (
                  <tr key={company.id} className="hover:bg-[#e6f4ff] transition-colors group">
                    <td className="px-6 py-5 font-medium text-gray-500">{index + 1}</td>
                    <td className="px-6 py-5 font-bold text-gray-800">{company.companyName}</td>
                    <td className="px-6 py-5 text-gray-600">{company.phone}</td>
                    <td className="px-6 py-5 text-gray-600">{company.email}</td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/dashboard/admin/company/${company.id}`}>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-green-600 bg-green-50 group-hover:bg-white rounded-md font-medium text-xs transition-all border border-green-200 shadow-sm cursor-pointer">
                          <span className="hidden sm:inline">View Details</span>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium italic bg-gray-50/30">
                    No {currentStatus.toLowerCase()} companies found right now.
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
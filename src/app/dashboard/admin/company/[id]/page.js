'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CompanyDetails() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // TEMPORARY DUMMY DATA (Backend banne ke baad hum isko API se replace karenge)
        setTimeout(() => {
          setCompany({
            _id: id,
            name: id === '1' ? 'Tata Consultancy Services' : 'Tech Innovators Pvt Ltd',
            phone: '+91 22 6778 9999',
            email: 'careers@company.com',
            website: 'www.company.com',
            address: 'Banyan Park, Andheri East, Mumbai, Maharashtra 400069',
            status: 'Active',
            description: 'Leading IT services consulting and business solutions organization delivering real results to global business.',
            // Contact Person Details
            contactPerson: {
              name: 'Rahul Sharma',
              designation: 'Senior HR Manager',
              phone: '+91 98765 43210',
              email: 'rahul.s@company.com'
            },
            // Job Openings Array
            openings: [
              {
                id: 101,
                title: 'MERN Stack Developer',
                experience: '2 - 4 Years',
                salary: '₹8,00,000 - ₹12,00,000',
                vacancies: 5,
                // Future Date: Ye Active dikhega
                expiryDate: '2026-08-15', 
                description: 'Looking for an experienced MERN stack developer with solid knowledge of Next.js and Tailwind CSS.'
              },
              {
                id: 102,
                title: 'React.js Frontend Engineer',
                experience: '1 - 3 Years',
                salary: '₹5,00,000 - ₹8,00,000',
                vacancies: 2,
                // Past Date: Ye automatic Non-Active/Expired dikhega
                expiryDate: '2026-03-10', 
                description: 'Requires strong proficiency in JavaScript, React hooks, and Redux toolkit.'
              },
              {
                id: 103,
                title: 'Node.js Backend Developer',
                experience: '3 - 5 Years',
                salary: '₹10,00,000 - ₹15,00,000',
                vacancies: 1,
                // Future Date
                expiryDate: '2026-05-20', 
                description: 'Backend specialist needed for building scalable APIs and microservices.'
              }
            ]
          });
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Failed to fetch", error);
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Logic to check if an opening is still active based on expiry date
  const isOpeningActive = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for accurate date comparison
    const expDate = new Date(expiryDate);
    return expDate >= today;
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#0796fe] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[#092a49] font-medium tracking-wide">Loading Company Details...</div>
      </div>
    );
  }

  if (!company) return <div className="p-10 text-red-500">Company not found!</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <button 
        onClick={() => router.back()} 
        className="mb-6 flex items-center text-sm font-semibold text-gray-500 hover:text-[#0796fe] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Back to Dashboard
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border-l-[8px] border-[#092a49] p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-40 h-40"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" /></svg> */}
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{company.name}</h1>
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${company.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                {company.status}
              </span>
            </div>
            <p className="text-gray-500 max-w-2xl text-sm leading-relaxed">{company.description}</p>
          </div>
          <button className="bg-[#0796fe] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#0680d9] shadow-md transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
            Edit Company
          </button>
        </div>
      </div>

      {/* Info Grid (Company Details & Contact Person) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Company Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" /></svg>
            </div>
            <h3 className="text-base font-bold text-[#092a49]">Company Details</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Email:</span>
              <span className="text-gray-800 font-medium">{company.email}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Phone:</span>
              <span className="text-gray-800 font-medium">{company.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Website:</span>
              <a href={`https://${company.website}`} target="_blank" className="text-[#0796fe] hover:underline font-medium">{company.website}</a>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Address:</span>
              <span className="text-gray-800 font-medium leading-relaxed">{company.address}</span>
            </div>
          </div>
        </div>

        {/* Contact Person Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
            </div>
            <h3 className="text-base font-bold text-[#092a49]">Contact Person</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Name:</span>
              <span className="text-gray-800 font-bold">{company.contactPerson.name}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Role:</span>
              <span className="text-gray-800 font-medium">{company.contactPerson.designation}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Phone:</span>
              <span className="text-gray-800 font-medium">{company.contactPerson.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gray-400 font-semibold w-20">Email:</span>
              <span className="text-gray-800 font-medium">{company.contactPerson.email}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Current Openings Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#092a49]">Current Openings</h2>
        <span className="bg-[#092a49] text-white text-xs font-bold px-3 py-1 rounded-full">{company.openings.length} Total</span>
      </div>

      <div className="space-y-4">
        {company.openings.map((job) => {
          // Expiry logic check
          const active = isOpeningActive(job.expiryDate);

          return (
            <div key={job.id} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${active ? 'border-l-4 border-l-green-500 border-gray-100' : 'border-l-4 border-l-red-400 border-gray-100 opacity-80'}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                
                {/* Job Title & Badge */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    {active ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Active</span>
                    ) : (
                      <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">Non Active</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1">{job.description}</p>
                </div>

                {/* Expiry Date Warning */}
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${active ? 'text-orange-500' : 'text-red-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className={active ? 'text-gray-600' : 'text-red-500'}>
                    Valid till: <span className="text-gray-900 font-bold">{formatDate(job.expiryDate)}</span>
                  </span>
                </div>
              </div>

              {/* Job Meta Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">Vacancies</p>
                  <p className="text-sm font-bold text-gray-800">{job.vacancies} Openings</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">Experience</p>
                  <p className="text-sm font-bold text-gray-800">{job.experience}</p>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <p className="text-xs text-gray-400 font-semibold mb-1">Salary Range</p>
                  <p className="text-sm font-bold text-gray-800 text-[#0796fe]">{job.salary}</p>
                </div>
              </div>
              
            </div>
          );
        })}

        {company.openings.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No current openings found for this company.</p>
          </div>
        )}
      </div>

    </div>
  );
}
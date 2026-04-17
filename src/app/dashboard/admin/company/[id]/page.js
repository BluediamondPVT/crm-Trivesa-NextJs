'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// IMPORTING ALL OUR NEW COMPONENTS
import CompanyHeader from '@/components/company/CompanyHeader';
import CompanyInfo from '@/components/company/CompanyInfo';
import PayoutDetails from '@/components/company/PayoutDetails';
import ContactPersons from '@/components/company/ContactPersons';
import CurrentOpenings from '@/components/company/CurrentOpenings';

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        // TEMPORARY DUMMY DATA
        setTimeout(() => {
          setCompany({
            _id: id,
            name: id === '1' ? 'Tata Consultancy Services' : 'Tech Innovators Pvt Ltd',
            phone: '+91 22 6778 9999',
            email: 'careers@company.com',
            website: 'www.company.com',
            address: 'Banyan Park, Andheri East, Mumbai, Maharashtra 400069',
            status: 'Active',
            companyType: 'Non BPO',
            description: 'Leading IT services consulting and business solutions organization delivering real results to global business.',
            payoutDetails: {
              payoutDuration: '30 Days',
              replacementTime: '60 Days',
              commercials: '8.33% of CTC',
              paymentTerms: 'Post joining & invoice submission'
            },
            contactPersons: [
              { id: 1, name: 'Rahul Sharma', designation: 'Senior HR Manager', phone: '+91 98765 43210', email: 'rahul.s@company.com' },
              { id: 2, name: 'Sneha Kapoor', designation: 'Talent Acquisition', phone: '+91 87654 32109', email: 'sneha.k@company.com' }
            ],
            openings: [
              { id: 101, title: 'MERN Stack Developer', experience: '2 - 4 Years', salary: '₹8,00,000 - ₹12,00,000', vacancies: 5, expiryDate: '2026-08-15', description: 'Looking for an experienced developer.' },
              { id: 102, title: 'React.js Engineer', experience: '1 - 3 Years', salary: '₹5,00,000 - ₹8,00,000', vacancies: 2, expiryDate: '2026-03-10', description: 'React hooks and Redux toolkit.' }
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
        Back to Dashboard
      </button>

      {/* 1. Company Header */}
      <CompanyHeader company={company} />

      {/* 2. Top Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CompanyInfo company={company} />
        <PayoutDetails payoutDetails={company.payoutDetails} />
      </div>

      {/* 3. Contact Persons Table */}
      <ContactPersons contactPersons={company.contactPersons} />

      {/* 4. Current Openings */}
      <CurrentOpenings openings={company.openings} />

    </div>
  );
}
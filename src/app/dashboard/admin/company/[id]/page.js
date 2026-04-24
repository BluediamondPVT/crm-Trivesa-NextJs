"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

// IMPORTING ALL OUR NEW COMPONENTS
import CompanyHeader from "@/components/company/CompanyHeader";
import CompanyInfo from "@/components/company/CompanyInfo";
import PayoutDetails from "@/components/company/PayoutDetails";
import ContactPersons from "@/components/company/ContactPersons";
import CurrentOpenings from "@/components/company/CurrentOpenings";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // NAYA: Role save karne ke liye state
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Page load hote hi local storage se role nikal lo
    setUserRole(localStorage.getItem("role"));

    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`/api/companies/${id}`);
        if (response.data.success) {
          setCompany(response.data.data);
        } else {
          setCompany(null);
        }
      } catch (error) {
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[#1d4ed8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[#092a49] font-medium tracking-wide">
          Loading Company Details...
        </div>
      </div>
    );
  }

  if (!company)
    return (
      <div className="p-10 text-center font-bold text-red-500">
        Client details not found!
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-sm cursor-pointer font-semibold text-gray-500 hover:text-[#1d4ed8] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        Back to Dashboard
      </button>

      {/* 1. Company Header */}
      <CompanyHeader company={company} />

      {/* 2. Company Info (Full Width) */}
      <div className="mb-8">
        <CompanyInfo company={company} userRole={userRole} />  {/* Yahan userRole pass karna zaroori hai! */}
      </div>

      {/* 3. Payout Details (Full Width & Separate Section) */}
      {/* NAYA FIX: Sirf tab dikhega jab userRole recruiter NAHI hoga */}
      {userRole !== "recruiter" && (
        <div className="mb-8">
          <PayoutDetails payoutDetails={company.payoutDetails} />
        </div>
      )}

      {/* 4. Contact Persons Table */}
      <div className="mb-8">
        <ContactPersons contactPersons={company.contactPersons} />
      </div>

      {/* 5. Current Openings */}
      <div className="mb-8">
        <CurrentOpenings openings={company.openings} />
      </div>
    </div>
  );
}
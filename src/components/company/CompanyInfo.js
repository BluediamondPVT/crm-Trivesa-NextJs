// Dhyaan de: Yahan props mein `userRole` add kiya hai
export default function CompanyInfo({ company, userRole }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
            />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#092a49]">Company Details</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Standard Details (Sabko dikhega) */}
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-semibold w-24 shrink-0">Type:</span>
            <span className="bg-[#e6f4ff] text-[#1d4ed8] font-bold px-2.5 py-1 rounded-md text-xs tracking-wide">
              {company.companyType || "N/A"}
            </span>
          </div>

          {company.natureOfBusiness && (
            <div className="flex items-start gap-3">
              <span className="text-gray-600 font-semibold w-24 shrink-0">Nature:</span>
              <span className="bg-purple-50 text-purple-600 font-bold px-2.5 py-1 rounded-md text-xs tracking-wide">
                {company.natureOfBusiness}
              </span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-semibold w-24 shrink-0">Email:</span>
            <span className="text-gray-800 font-medium break-all">{company.email || "N/A"}</span>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-semibold w-24 shrink-0">Phone:</span>
            <span className="text-gray-800 font-medium">
              {company.phone ? `+91 ${company.phone}` : "N/A"}
            </span>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-semibold w-24 shrink-0">Website:</span>
            {company.website ? (
              <a
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1d4ed8] hover:underline font-medium break-all"
              >
                {company.website}
              </a>
            ) : (
              <span className="text-gray-500 font-medium">N/A</span>
            )}
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-semibold w-24 shrink-0">Address:</span>
            <span className="text-gray-800 font-medium leading-relaxed">{company.address || "N/A"}</span>
          </div>
        </div>

        {/* Right Side: NAYA FIX -> Sirf tab dikhega jab userRole recruiter NAHI hoga */}
        {userRole !== "recruiter" && (
          <div className="flex flex-col h-full">
            {company.internalRemark ? (
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 h-full shadow-sm">
                <h4 className="text-sm font-bold text-[#092a49] mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-blue-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  Internal Remark / Brief Data
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {company.internalRemark}
                </p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-5 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400 font-medium italic">
                  No internal remarks added for this company.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
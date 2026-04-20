export default function CompanyInfo({ company }) {
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
            aria-hidden="true"
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

      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-gray-600 font-semibold w-24 shrink-0">
            Type:
          </span>
          <span className="bg-[#e6f4ff] text-[#1d4ed8] font-bold px-2.5 py-1 rounded-md text-xs tracking-wide">
            {company.companyType}
          </span>
        </div>

        {/* NAYA KAMAAL: Agar natureOfBusiness DB se aayega, tabhi ye line dikhegi */}
        {company.natureOfBusiness && (
          <div className="flex items-start gap-3">
            <span className="text-gray-600 font-semibold w-24 shrink-0">
              Nature:
            </span>
            <span className="bg-purple-50 text-purple-600 font-bold px-2.5 py-1 rounded-md text-xs tracking-wide">
              {company.natureOfBusiness}
            </span>
          </div>
        )}

        <div className="flex items-start gap-3">
          <span className="text-gray-600 font-semibold w-24 shrink-0">
            Email:
          </span>
          <span className="text-gray-800 font-medium break-all">
            {company.email}
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-gray-600 font-semibold w-24 shrink-0">
            Phone:
          </span>
          <span className="text-gray-800 font-medium">+91 {company.phone}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-gray-600 font-semibold w-24 shrink-0">
            Website:
          </span>
          <a
            href={
              company.website?.startsWith("http")
                ? company.website
                : `https://${company.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1d4ed8] hover:underline font-medium break-all"
          >
            {company.website}
          </a>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-gray-600 font-semibold w-24 shrink-0">
            Address:
          </span>
          <span className="text-gray-800 font-medium leading-relaxed">
            {company.address}
          </span>
        </div>
      </div>
    </div>
  );
}

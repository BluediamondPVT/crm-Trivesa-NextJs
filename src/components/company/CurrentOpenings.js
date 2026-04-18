export default function CurrentOpenings({ openings }) {
  // Date format karne ka helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Logic to check if an opening is still active based on expiry date
  const isOpeningActive = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for accurate date comparison
    const expDate = new Date(expiryDate);
    return expDate >= today;
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#092a49]">Current Openings</h2>
        <span className="bg-[#092a49] text-white text-xs font-bold px-3 py-1 rounded-full">
          {openings?.length || 0} Total
        </span>
      </div>

      <div className="space-y-4">
        {openings?.map((job) => {
          const active = isOpeningActive(job.expiryDate);

          return (
            <div 
              key={job._id} // THE FIX: Yahan job.id ki jagah job._id lagaya hai
              className={`bg-white rounded-2xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
                active 
                  ? 'border-l-4 border-l-green-500 border-gray-100' 
                  : 'border-l-4 border-l-red-400 border-gray-100 opacity-80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                
                {/* Job Title & Badge */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    {active ? (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        Non Active
                      </span>
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

        {/* Agar openings ka array empty ho */}
        {(!openings || openings.length === 0) && (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-medium">No current openings found for this company.</p>
          </div>
        )}
      </div>
    </>
  );
}
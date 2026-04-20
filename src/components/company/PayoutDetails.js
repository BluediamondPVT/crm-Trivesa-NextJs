export default function PayoutDetails({ payoutDetails }) {
  // Safe check if commercials exist and is an array
  const commercials = payoutDetails?.commercials || [];
  const hasCommercials = Array.isArray(commercials) && commercials.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#092a49]">
            Payout & Commercials
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            Payment terms and fee structure
          </p>
        </div>
      </div>

      {/* Grid Layout for Full Width View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Dynamic Nested Commercials (Takes 2 columns) */}
        <div className="lg:col-span-2">
          <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 block">
            Commercial Structure Slabs
          </span>

          {hasCommercials ? (
            <div className="space-y-4">
              {commercials.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-emerald-300 transition-colors"
                >
                  {/* Category Name */}
                  {rule.category && (
                    <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-[#092a49] font-bold text-sm tracking-wide">
                        {rule.category}
                      </span>
                    </div>
                  )}

                  {/* Slabs */}
                  <div className="p-4 space-y-3">
                    {rule.slabs &&
                      rule.slabs.map((slab, slabIdx) => (
                        <div
                          key={slabIdx}
                          className="flex items-start gap-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.5 12.75l6 6 9-13.5"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">
                            {slab.slabDetails || "N/A"}
                          </span>
                        </div>
                      ))}
                    {(!rule.slabs || rule.slabs.length === 0) && (
                      <span className="text-gray-400 italic text-sm pl-2">
                        No slabs defined for this category.
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <span className="text-gray-500 font-medium">
                No commercial structure added yet.
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Other Terms (Takes 1 column) */}
        <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100/50 h-fit">
          <span className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-5 block">
            Additional Terms
          </span>

          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-xs font-semibold mb-1">
                Pay-out Duration
              </p>
              <p className="text-gray-900 font-bold text-lg">
                {payoutDetails?.payoutDuration || "N/A"} Days
              </p>
            </div>

            <div className="w-full h-px bg-blue-100"></div>

            <div>
              <p className="text-gray-500 text-xs font-semibold mb-1">
                Replacement Time
              </p>
              <p className="text-gray-900 font-bold text-lg">
                {payoutDetails?.replacementTime || "N/A"} Days
              </p>
            </div>

            <div className="w-full h-px bg-blue-100"></div>

            <div>
              <p className="text-gray-500 text-xs font-semibold mb-1">
                Payment Terms
              </p>
              <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-gray-100 mt-2">
                {payoutDetails?.paymentTerms || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayoutCommercialsForm({
  formData,
  handleChange,
  addCommercialCategory,
  removeCommercialCategory,
  handleCategoryChange,
  addSlab,
  removeSlab,
  handleSlabChange,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-[#092a49]">
          2. Payout Structure (Slabs)
        </h2>
        <button
          type="button"
          onClick={addCommercialCategory}
          className="text-sm bg-[#092a49] text-white px-3 py-1 rounded-md font-bold hover:bg-[#183e61] transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="space-y-6 mb-8">
        {formData.payoutDetails.commercials.map((categoryItem, catIdx) => (
          <div
            key={catIdx}
            className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 relative"
          >
            {formData.payoutDetails.commercials.length > 1 && (
              <button
                type="button"
                onClick={() => removeCommercialCategory(catIdx)}
                aria-label={`Remove category ${catIdx + 1}`}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1.5 bg-white rounded-md shadow-sm border border-red-100 focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            )}

            <div className="mb-4 pr-10">
              <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                Process / Category Name
              </label>
              <input
                type="text"
                value={categoryItem.category}
                onChange={(e) => handleCategoryChange(e, catIdx)}
                className="w-full sm:w-2/3 p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-[#092a49]"
                placeholder="e.g. For CSR level the payout will be:"
              />
            </div>

            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2 border-b pb-2 border-gray-100">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Slabs & Rates
                </label>
                <button
                  type="button"
                  onClick={() => addSlab(catIdx)}
                  className="text-xs text-[#1d4ed8] hover:text-[#1e40af] font-bold flex items-center gap-1"
                >
                  + Add Slab
                </button>
              </div>

              <div className="space-y-2">
                {categoryItem.slabs.map((slab, slabIdx) => (
                  <div key={slabIdx} className="flex gap-2 items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                    <input
                      type="text"
                      value={slab.slabDetails}
                      onChange={(e) => handleSlabChange(e, catIdx, slabIdx)}
                      className="flex-1 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      placeholder="e.g. Rs. 2000/- (0-03 per candidate)"
                    />
                    {categoryItem.slabs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSlab(catIdx, slabIdx)}
                        className="text-gray-600 hover:text-red-500 p-1.5 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                      >
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
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pay-out Duration
          </label>
          <input
            type="text"
            name="payoutDuration"
            value={formData.payoutDetails.payoutDuration}
            onChange={(e) => handleChange(e, "payout-basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 30 Days"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Replacement Time
          </label>
          <input
            type="text"
            name="replacementTime"
            value={formData.payoutDetails.replacementTime}
            onChange={(e) => handleChange(e, "payout-basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 60 Days"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Payment Terms
          </label>
          <input
            type="text"
            name="paymentTerms"
            value={formData.payoutDetails.paymentTerms}
            onChange={(e) => handleChange(e, "payout-basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Post joining & invoice submission"
          />
        </div>
      </div>
    </div>
  );
}

export default function OpeningsForm({
  formData,
  handleChange,
  addOpening,
  removeOpening,
}) {
  // 🚀 JADOO: Inline handlers for 3-field Slabs (Min, Max, Amount)
  const handleAddSlab = (openingIndex) => {
    const currentSlabs = formData.openings[openingIndex].slabs || [];
    const newSlabs = [
      ...currentSlabs,
      { minJoinees: "", maxJoinees: "", amount: "" }, // 🚀 Naya Schema Format
    ];
    handleChange(
      { target: { value: newSlabs } },
      "openings",
      openingIndex,
      "slabs",
    );
  };

  const handleRemoveSlab = (openingIndex, slabIndex) => {
    const currentSlabs = formData.openings[openingIndex].slabs || [];
    const newSlabs = currentSlabs.filter((_, i) => i !== slabIndex);
    handleChange(
      { target: { value: newSlabs } },
      "openings",
      openingIndex,
      "slabs",
    );
  };

  const handleSlabChangeData = (e, openingIndex, slabIndex, field) => {
    const currentSlabs = formData.openings[openingIndex].slabs || [];
    const newSlabs = [...currentSlabs];
    newSlabs[slabIndex] = {
      ...newSlabs[slabIndex],
      [field]: e.target.value, // 🚀 Min, Max ya Amount update hoga
    };
    handleChange(
      { target: { value: newSlabs } },
      "openings",
      openingIndex,
      "slabs",
    );
  };

  return (
    <div className="space-y-6">
      {/* ========================================= */}
      {/* 1. INITIAL OPENINGS & PAYOUT TYPES        */}
      {/* ========================================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#092a49]">
            4. Initial Openings & Payouts
          </h2>
          <button
            type="button"
            onClick={addOpening}
            className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md font-bold hover:bg-green-100 transition-colors"
          >
            + Add Opening
          </button>
        </div>

        {formData.openings.map((job, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start mb-6 bg-gray-50 p-5 rounded-lg border border-gray-200 relative"
          >
            {/* Row 1: Basic Job Details */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={job.title || ""}
                onChange={(e) => handleChange(e, "openings", index, "title")}
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. React Developer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Experience
              </label>
              <input
                type="text"
                value={job.experience || ""}
                onChange={(e) =>
                  handleChange(e, "openings", index, "experience")
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2-4 Years"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Salary Range
              </label>
              <input
                type="text"
                value={job.salary || ""}
                onChange={(e) => handleChange(e, "openings", index, "salary")}
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8LPA - 12LPA"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Vacancies
              </label>
              <input
                type="number"
                value={job.vacancies || ""}
                onChange={(e) =>
                  handleChange(e, "openings", index, "vacancies")
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Count"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={job.expiryDate || ""}
                onChange={(e) =>
                  handleChange(e, "openings", index, "expiryDate")
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Row 2: Job Description */}
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Job Description
              </label>
              <input
                type="text"
                value={job.description || ""}
                onChange={(e) =>
                  handleChange(e, "openings", index, "description")
                }
                className="w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short JD..."
              />
            </div>

            {formData.openings.length > 1 && (
              <button
                type="button"
                onClick={() => removeOpening(index)}
                className="md:mt-6 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-2 rounded-md transition-colors w-full md:w-auto"
              >
                Remove
              </button>
            )}

            {/* 🚀 ROW 3: PAYOUT SETTINGS */}
            <div className="md:col-span-6 bg-white p-4 rounded-lg border border-gray-200 mt-2">
              <h4 className="text-xs font-bold text-[#092a49] uppercase tracking-wide mb-4 border-b border-gray-100 pb-2">
                Payout Configuration for this Opening
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Payout Type *
                  </label>
                  <select
                    value={job.payoutType || "Flat Amount"}
                    onChange={(e) =>
                      handleChange(e, "openings", index, "payoutType")
                    }
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  >
                    <option value="Flat Amount">Flat Amount (Fixed)</option>
                    <option value="Percentage">Percentage (% of CTC)</option>
                    <option value="Slab Wise">Slab Wise (Tiered)</option>
                  </select>
                </div>

                {(job.payoutType === "Flat Amount" || !job.payoutType) && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Flat Amount (₹) per candidate
                    </label>
                    <input
                      type="number"
                      value={job.flatAmount || ""}
                      onChange={(e) =>
                        handleChange(e, "openings", index, "flatAmount")
                      }
                      placeholder="e.g. 5000"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {job.payoutType === "Percentage" && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Percentage (%) of Candidate CTC
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={job.percentageValue || ""}
                      onChange={(e) =>
                        handleChange(e, "openings", index, "percentageValue")
                      }
                      placeholder="e.g. 8.33"
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* 🚀 FIXED SLAB UI (Min, Max, Amount) */}
                {job.payoutType === "Slab Wise" && (
                  <div className="md:col-span-3 mt-2">
                    <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 relative">
                      <div className="flex justify-between items-center mb-4 border-b border-blue-100/60 pb-3">
                        <label className="block text-xs font-bold text-[#092a49] uppercase tracking-wider">
                          Slabs & Rates Structure
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddSlab(index)}
                          className="text-xs text-[#1d4ed8] hover:text-[#1e40af] font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-md shadow-sm border border-blue-200 transition-colors"
                        >
                          + Add Slab
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(job.slabs || []).map((slab, slabIdx) => (
                          <div
                            key={slabIdx}
                            className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                          >
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <span className="text-xs font-bold text-gray-500">
                                Min
                              </span>
                              <input
                                type="number"
                                value={slab.minJoinees || ""}
                                onChange={(e) =>
                                  handleSlabChangeData(
                                    e,
                                    index,
                                    slabIdx,
                                    "minJoinees",
                                  )
                                }
                                className="w-full sm:w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                                placeholder="e.g. 1"
                              />
                            </div>

                            <span className="hidden sm:block text-gray-400 font-bold">
                              to
                            </span>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <span className="text-xs font-bold text-gray-500">
                                Max
                              </span>
                              <input
                                type="number"
                                value={slab.maxJoinees || ""}
                                onChange={(e) =>
                                  handleSlabChangeData(
                                    e,
                                    index,
                                    slabIdx,
                                    "maxJoinees",
                                  )
                                }
                                className="w-full sm:w-20 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                                placeholder="e.g. 5"
                              />
                            </div>

                            <span className="hidden sm:block text-gray-400 font-bold">
                              =
                            </span>

                            <div className="flex items-center gap-2 w-full sm:flex-1">
                              <span className="text-xs font-bold text-emerald-600">
                                ₹ Amt
                              </span>
                              <input
                                type="number"
                                value={slab.amount || ""}
                                onChange={(e) =>
                                  handleSlabChangeData(
                                    e,
                                    index,
                                    slabIdx,
                                    "amount",
                                  )
                                }
                                className="w-full p-2 border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-emerald-700 bg-emerald-50/30"
                                placeholder="e.g. 2000"
                              />
                            </div>

                            {(job.slabs || []).length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSlab(index, slabIdx)}
                                className="text-gray-400 hover:text-red-500 p-2 shrink-0 transition-colors bg-gray-50 rounded-lg border border-gray-100 hover:bg-red-50 w-full sm:w-auto flex justify-center"
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
                                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}

                        {(!job.slabs || job.slabs.length === 0) && (
                          <div className="text-center py-4 bg-white/50 border border-dashed border-blue-200 rounded-lg">
                            <span className="text-xs text-blue-500 font-medium">
                              No slabs defined yet. Click &ldquo;+ Add
                              Slab&rdquo; to start.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================= */}
      {/* 2. GENERAL COMPANY PAYOUT TERMS           */}
      {/* ========================================= */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
        <div className="mb-4 border-b pb-2">
          <h2 className="text-lg font-bold text-[#092a49]">
            5. Additional Payout Terms
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            These terms will apply universally to all openings for this client.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pay-out Duration
            </label>
            <input
              type="text"
              name="payoutDuration"
              value={formData.payoutDetails?.payoutDuration || ""}
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
              value={formData.payoutDetails?.replacementTime || ""}
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
              value={formData.payoutDetails?.paymentTerms || ""}
              onChange={(e) => handleChange(e, "payout-basic")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Post invoice submission"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

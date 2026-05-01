export default function EditInterviewDetailsForm({
  formData,
  handleChange,
  activeCompanies,
  handleCompanyChange,
  availableOpenings,
  isStatusOpen,
  setIsStatusOpen,
}) {
  const isFuture = formData.status === "future";

  // Saare Status Options Edit ke liye
  const allStatuses = [
    "LineUp",
    "future",
    "Attendees",
    "On Hold",
    "Selected",
    "Rejected",
    "Joining",
    "Payout"
  ];

  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
        {isFuture ? "Candidate Status" : "Interview & Status Details"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        
        {!isFuture && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Company
              </label>
              <select
                name="assignedCompanyId"
                value={formData.assignedCompanyId || ""}
                onChange={handleCompanyChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="">-- Choose Active Client --</option>
                {activeCompanies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Process / Opening
              </label>
              <select
                name="assignedProcess"
                value={formData.assignedProcess || ""}
                onChange={handleChange}
                disabled={!formData.assignedCompanyId}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 outline-none bg-white"
              >
                <option value="">-- Select Opening --</option>
                {availableOpenings.map((op, idx) => (
                  <option key={idx} value={op.title}>
                    {op.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Interview Date
              </label>
              <input
                type="date"
                name="interviewDate"
                value={formData.interviewDate || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </>
        )}

        {/* STATUS FIELD (All Unlocked for Edit) */}
        <div className={`relative ${isFuture ? "col-span-1 md:col-span-2" : ""}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Update Status *
          </label>
          <div
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full p-2 border border-blue-400 rounded-md focus:ring-2 focus:ring-blue-500 font-bold text-[#092a49] bg-white outline-none cursor-pointer flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span className="flex w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="capitalize">{formData.status || "Select Status"}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
          
          {/* Dropdown Options */}
          {isStatusOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden max-h-56 overflow-y-auto">
              {allStatuses.map((statusOption) => (
                <div
                  key={statusOption}
                  onClick={() => {
                    handleChange({ target: { name: "status", value: statusOption } });
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer font-semibold text-gray-800 border-b border-gray-100 last:border-0 transition-colors"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${formData.status === statusOption ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                  {statusOption}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🚀 REMARK FIELD (Zaroori hai Edit ke liye taaki history me save ho) */}
        <div className="md:col-span-2 mt-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Add Remark / Feedback (Optional)
          </label>
          <textarea
            name="remark"
            value={formData.remark || ""}
            onChange={handleChange}
            rows="2"
            placeholder="Type any updates or feedback here..."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          ></textarea>
        </div>

      </div>
    </>
  );
}
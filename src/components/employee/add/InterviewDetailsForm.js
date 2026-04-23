export default function InterviewDetailsForm({
  formData,
  handleChange,
  activeCompanies,
  handleCompanyChange,
  availableOpenings,
  isStatusOpen,
  setIsStatusOpen,
}) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
        Interview Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Company *
          </label>
          <select
            required
            name="assignedCompanyId"
            value={formData.assignedCompanyId}
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
            Process / Opening *
          </label>
          <select
            required
            name="assignedProcess"
            value={formData.assignedProcess}
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
            Interview Date *
          </label>
          <input
            required
            type="date"
            name="interviewDate"
            value={formData.interviewDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Current Status
          </label>
          <div
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-bold text-[#092a49] bg-white outline-none cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              {formData.status === "LineUp" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
              <span>{formData.status}</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          {isStatusOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
              <div
                onClick={() => {
                  handleChange({ target: { name: "status", value: "LineUp" } });
                  setIsStatusOpen(false);
                }}
                className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer font-bold text-[#092a49]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>{" "}
                LineUp
              </div>
              {["Attendees", "On Hold", "Selected", "Rejected"].map(
                (statusOption) => (
                  <div
                    key={statusOption}
                    className="flex items-center gap-2 p-1 bg-gray-50 opacity-60 cursor-not-allowed text-gray-500 border-t border-gray-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>{" "}
                    {statusOption} (Edit later)
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProfessionalDetailsForm({ formData, handleChange }) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
        Experience & Salary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Experience
          </label>
          <input
            type="text"
            name="experience"
            placeholder="e.g. 2 Years"
            value={formData.experience}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Last Salary (Month)
          </label>
          <input
            type="text"
            name="lastSalary"
            placeholder="e.g. 25000"
            value={formData.lastSalary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Expected Salary (Month)
          </label>
          <input
            type="text"
            name="expectedSalary"
            placeholder="e.g. 35000"
            value={formData.expectedSalary}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* MAGIC FIX: Conditional Actual Salary Input */}
      {formData.status === "Joining" && (
        <div className="mt-5 p-4 bg-teal-50 border border-teal-200 rounded-lg shadow-sm animate-fade-in">
          <label className="block text-sm font-extrabold text-teal-800 mb-1.5 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Final / Actual Salary (Required)
          </label>
          <div className="relative w-full md:w-1/3">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-teal-600 font-bold">
              ₹
            </span>
            <input
              required
              type="number"
              name="actualSalary"
              placeholder="e.g. 32000"
              value={formData.actualSalary || ""}
              onChange={handleChange}
              className="w-full pl-8 p-2.5 bg-white border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-gray-800"
            />
          </div>
          <p className="text-xs text-teal-600 mt-2 font-medium">
            * This amount will be used by the Admin to calculate recruiter
            payouts.
          </p>
        </div>
      )}
    </>
  );
}

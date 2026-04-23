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
            Last Salary
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
            Expected Salary
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
    </>
  );
}

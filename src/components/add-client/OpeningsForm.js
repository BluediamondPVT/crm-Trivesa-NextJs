export default function OpeningsForm({
  formData,
  handleChange,
  addOpening,
  removeOpening,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-[#092a49]">
          4. Initial Openings
        </h2>
        <button
          type="button"
          onClick={addOpening}
          className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md font-bold hover:bg-green-100"
        >
          + Add Opening
        </button>
      </div>
      {formData.openings.map((job, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start mb-4 bg-gray-50 p-4 rounded-lg relative"
        >
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={job.title}
              onChange={(e) => handleChange(e, "openings", index, "title")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="e.g. React Developer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Experience
            </label>
            <input
              type="text"
              value={job.experience}
              onChange={(e) => handleChange(e, "openings", index, "experience")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="2-4 Years"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Salary Range
            </label>
            <input
              type="text"
              value={job.salary}
              onChange={(e) => handleChange(e, "openings", index, "salary")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="8LPA - 12LPA"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Vacancies
            </label>
            <input
              type="number"
              value={job.vacancies}
              onChange={(e) => handleChange(e, "openings", index, "vacancies")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Count"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={job.expiryDate}
              onChange={(e) => handleChange(e, "openings", index, "expiryDate")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Job Description
            </label>
            <input
              type="text"
              value={job.description}
              onChange={(e) =>
                handleChange(e, "openings", index, "description")
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Short JD..."
            />
          </div>
          {formData.openings.length > 1 && (
            <button
              type="button"
              onClick={() => removeOpening(index)}
              className="md:mt-6 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-2 rounded-md"
            >
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

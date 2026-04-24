export default function ProfessionalDetailsView({ employee }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full h-full flex flex-col">
      <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-6 border-b border-gray-50 pb-3">
        Professional Details
      </h2>
      <div className="space-y-3 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Experience
          </span>
          <span className="font-bold text-[#092a49]">
            {employee.experience || "Fresher / N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide shrink-0 mr-4">
            Qual & Spec.
          </span>
          <span className="font-bold text-[#092a49] text-right wrap-break-word">
            {employee.qualification || "N/A"}{" "}
            {employee.specialization ? `(${employee.specialization})` : ""}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Expertise
          </span>
          <span className="font-bold text-[#092a49] text-right">
            {employee.expertise || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Last Salary
          </span>
          <span className="font-bold text-[#092a49]">
            ₹ {employee.lastSalary || "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#e6f4ff] p-2 rounded-xl border border-blue-200 mt-2">
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">
            Expected Salary
          </span>
          <span className="font-extrabold text-[#1d4ed8] text-lg">
            ₹ {employee.expectedSalary || "N/A"}
          </span>
        </div>

        {employee.status === "Joining" && employee.actualSalary && (
          <div className="flex items-center justify-between bg-teal-50 p-2 rounded-xl border border-teal-200 mt-2">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
              Final Salary
            </span>
            <span className="font-extrabold text-teal-700 text-lg">
              ₹ {employee.actualSalary}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

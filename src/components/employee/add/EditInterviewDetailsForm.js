// src/components/employee/add/EditInterviewDetailsForm.js
export default function EditInterviewDetailsForm({
  formData,
  handleChange,
  activeCompanies,
  handleCompanyChange,
  availableOpenings,
  isStatusOpen,
  setIsStatusOpen,
}) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return {
          color: "text-green-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "Rejected":
        return {
          color: "text-red-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "Attendees":
        return {
          color: "text-orange-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "On Hold":
        return {
          color: "text-yellow-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "Joining":
        return {
          color: "text-teal-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          ),
        };
      case "Payout":
        return {
          color: "text-purple-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V4.245c0-.754-.726-1.294-1.453-1.096a60.07 60.07 0 01-15.797 2.101c-.699.03-.699 1.038 0 1.068zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          ),
        };
      case "LineUp":
      default:
        return {
          color: "text-blue-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
            />
          ),
        };
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
        Placement Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Company
          </label>
          <select
            
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
            Process / Opening 
          </label>
          <select
            
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

        {/* Edit mode mein saare Status khule hain */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Current Status
          </label>
          <div
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-bold text-[#092a49] bg-white outline-none cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={`w-5 h-5 ${getStatusStyle(formData.status).color}`}
              >
                {getStatusStyle(formData.status).icon}
              </svg>
              <span>{formData.status || "Select"}</span>
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
              {[
                "LineUp",
                "Attendees",
                "Selected",
                "Joining",
                "Payout",
                "Rejected",
                "On Hold",
              ].map((statusOption) => (
                <div
                  key={statusOption}
                  onClick={() => {
                    handleChange({
                      target: { name: "status", value: statusOption },
                    });
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer font-bold text-[#092a49] border-b border-gray-50 last:border-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-5 h-5 ${getStatusStyle(statusOption).color}`}
                  >
                    {getStatusStyle(statusOption).icon}
                  </svg>
                  {statusOption}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAYA: Universal Remark Input Box (Always Visible on Edit) */}
        <div className="md:col-span-2 mt-2 transition-all duration-300 ease-in-out">
          <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
            Remark / Notes
          </label>
          <textarea
            name="remark"
            value={formData.remark || ""}
            onChange={handleChange}
            rows="2"
            placeholder="Enter details like selection status, hold reason, joining date, etc..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-800 font-medium"
          ></textarea>
        </div>
      </div>
    </>
  );
}

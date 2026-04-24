export default function BasicDetailsForm({ formData, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-[#092a49] mb-4 border-b pb-2">
        1. Client Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Tata Consultancy Services"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Company Type
          </label>
          <select
            name="companyType"
            value={formData.companyType}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="BPO">BPO</option>
            <option value="Non BPO">Non BPO</option>
            <option value="KPO">KPO</option>
            <option value="IT">IT</option>
          </select>
        </div>

        {formData.companyType === "Non BPO" && (
          <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nature of Business
            </label>
            <select
              name="natureOfBusiness"
              value={formData.natureOfBusiness}
              onChange={(e) => handleChange(e, "basic")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Select Nature of Business --</option>
              <option value="Pharmaceutical">Pharmaceutical</option>
              <option value="Engineering">Engineering</option>
              <option value="Logistic">Logistic</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Construction">Construction</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="careers@company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="+91 9999999999"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Website
          </label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="www.company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Active</option>
            <option>Non Active</option>
            <option>Listed</option>
            <option>Process</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) => handleChange(e, "basic")}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Full Address"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e, "basic")}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Brief about the company..."
          />
        </div>

        {/* NAYA: Internal Remark Box */}
        <div className="md:col-span-2 mt-2 bg-orange-50 border border-orange-200 rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-extrabold text-orange-800 mb-1 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
            </svg>
            Internal Remark / Notes (Admin Only)
          </label>
          <p className="text-xs text-orange-700 mb-3 font-medium">
            This note will only be visible to internal team members on the company dashboard.
          </p>
          <textarea
            name="internalRemark"
            value={formData.internalRemark || ""}
            onChange={(e) => handleChange(e, "basic")}
            placeholder="Add any internal warnings, special instructions, or notes here..."
            rows="3"
            className="w-full p-2.5 border border-orange-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
          ></textarea>
        </div>
        
      </div>
    </div>
  );
}
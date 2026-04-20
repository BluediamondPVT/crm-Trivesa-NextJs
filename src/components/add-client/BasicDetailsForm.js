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
      </div>
    </div>
  );
}

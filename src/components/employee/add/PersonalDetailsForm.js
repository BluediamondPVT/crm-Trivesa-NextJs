export default function PersonalDetailsForm({ formData, handleChange }) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2">
        Personal Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Name *
          </label>
          <input
            required
            placeholder="Enter Employ Name"
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Phone *
          </label>
          <input
            required
            type="text"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* FIX: Age as text to prevent parsing errors */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Age *
          </label>
          <input
            required
            type="text"
            name="age"
            placeholder="e.g. 25"
            value={formData.age || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Qualification *
          </label>
          <select
            required
            name="qualification"
            value={formData.qualification || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select --</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Specialization *
          </label>
          <select
            required
            name="specialization"
            value={formData.specialization || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select --</option>
            <option value="Engineering">Engineering</option>
            <option value="Medical">Medical</option>
            <option value="IT">IT</option>
            <option value="Sales & Marketing">Sales & Marketing</option>
            <option value="Finance">Finance</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Expertise *
          </label>
          <select
            required
            name="expertise"
            value={formData.expertise || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select --</option>
            <option value="BSC-CS">BSC-CS</option>
            <option value="BSC-IT">BSC-IT</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </>
  );
}

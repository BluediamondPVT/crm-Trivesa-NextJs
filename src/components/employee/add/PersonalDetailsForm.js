export default function PersonalDetailsForm({
  formData,
  handleChange,
  handleAddSkill,
  handleRemoveSkill,
}) {
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
            placeholder="Enter Phone Number"
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
            placeholder="Enter Email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Age
          </label>
          <input
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
            placeholder="Enter Address here"
            value={formData.address || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* NAYA FIELD: Source Dropdown */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Source
          </label>
          <select
            name="source"
            value={formData.source || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select Source --</option>
            <option value="Job Hai">Job Hai</option>
            <option value="Apna Job">Apna Job</option>
            <option value="Naukri">Naukri</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Direct Message">Direct Message</option>
            <option value="Candidate">Candidate</option>
            <option value="Refrence">Refrence</option>
            <option value="Social Media">Social Media</option>
            <option value="Mumbai Job Group">Mumbai Job Group</option>
            <option value="Time Job">Time Job</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Qualification
          </label>
          <select
            name="qualification"
            value={formData.qualification || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select --</option>
            <option value="HSC">HSC</option>
            <option value="Graduate">Graduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Specialization
          </label>
          <select
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
        {/* Skills Input (Naukri Style) */}
        {/* 🚀 MAGIC FIX: Yahan 'md:col-span-2' add kar diya taaki width Source ke barabar ho jaye */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Skills (Type & Press Enter)
          </label>
          <div className="p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap gap-2 items-center">
            {/* Dikhne wale Chips/Tags */}
            {formData.skills &&
              formData.skills.map((skill, index) => (
                // ... tere purane chips ka code ...
                <span
                  key={index}
                  className="bg-blue-100 text-[#092a49] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-blue-500 hover:text-red-500 focus:outline-none transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </span>
              ))}

            {/* Input Box */}
            <input
              type="text"
              placeholder={
                formData.skills?.length === 0
                  ? "e.g. React, Node.js, Sales"
                  : "Add more..."
              }
              className="flex-1 outline-none bg-transparent min-w-[120px] text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleAddSkill(e.target.value);
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim() !== "") {
                  handleAddSkill(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

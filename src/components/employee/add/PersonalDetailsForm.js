export default function PersonalDetailsForm({
  formData,
  handleChange,
}) {
  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2">
        Personal Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Name */}
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

        {/* Phone */}
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

        {/* Email */}
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

        {/* Age */}
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

        {/* Address */}
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

        {/* Source Dropdown */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Source *
          </label>
          <select
            
            name="source"
            value={formData.source || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select Source --</option>
            <option value="Indeed">Indeed</option>
            <option value="Job Hai">Job Hai</option>
            <option value="Apna Job">Apna Job</option>
            <option value="Naukri">Naukri</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Direct Message">Direct Message</option>
            <option value="Candidate">Candidate</option>
            <option value="Reference">Reference</option>
            <option value="Social Media">Social Media</option>
            <option value="Mumbai Job Group">Mumbai Job Group</option>
            <option value="Instagram">Instagram</option>
            <option value="google">Google</option> 
            <option value="Whatsapp Group">Whatsapp Group</option>
            <option value="Found it">Found it</option>
            <option value="Whatsapp channel">Whatsapp channel</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Trivesa Channel">Trivesa Channel</option>
            <option value="Other">Other</option>
            

          </select>
        </div> 
  
      </div> 
    </> 
  ); 
}
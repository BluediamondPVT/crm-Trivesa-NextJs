export default function ContactPersonsForm({
  formData,
  handleChange,
  addContactPerson,
  removeContactPerson,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-[#092a49]">
          3. Contact Persons (HRs)
        </h2>
        <button
          type="button"
          onClick={addContactPerson}
          className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-md font-bold hover:bg-orange-100"
        >
          + Add Person
        </button>
      </div>
      {formData.contactPersons.map((person, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start mb-4 bg-gray-50 p-4 rounded-lg relative"
        >
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={person.name}
              onChange={(e) => handleChange(e, "contacts", index, "name")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="HR Name"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              value={person.designation}
              onChange={(e) =>
                handleChange(e, "contacts", index, "designation")
              }
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="e.g. TA Head"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={person.phone}
              onChange={(e) => handleChange(e, "contacts", index, "phone")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Phone"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={person.email}
              onChange={(e) => handleChange(e, "contacts", index, "email")}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Email"
            />
          </div>
          {formData.contactPersons.length > 1 && (
            <button
              type="button"
              onClick={() => removeContactPerson(index)}
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

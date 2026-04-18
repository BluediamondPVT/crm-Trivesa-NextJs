// Sirf key={person.id} ko key={person._id} kiya hai
export default function ContactPersons({ contactPersons }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* ... header waisa hi rahega ... */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {/* ... thead waisa hi rahega ... */}
          <tbody className="text-sm divide-y divide-gray-50">
            {contactPersons?.map((person) => (
              // THE FIX: person._id use kiya
              <tr key={person._id} className="hover:bg-[#e6f4ff] transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-800">{person.name}</td>
                <td className="px-6 py-4 font-medium text-gray-600">{person.designation}</td>
                <td className="px-6 py-4 font-medium text-gray-600">{person.phone}</td>
                <td className="px-6 py-4 font-medium text-gray-600">{person.email}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#0796fe] hover:text-[#0680d9] font-medium text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
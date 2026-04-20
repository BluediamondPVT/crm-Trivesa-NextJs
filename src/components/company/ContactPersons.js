export default function ContactPersons({ contactPersons }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h2 className="text-xl font-bold text-gray-800">Contact HR&apos;s</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-150">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Designation</th>
              <th className="px-6 py-3 font-medium">Phone</th>
              <th className="px-6 py-3 font-medium">Email</th>
              {/* Empty header for the Edit button column */}
              {/* <th className="px-6 py-3"></th> */}
            </tr>
          </thead>

          <tbody className="text-sm divide-y divide-gray-50">
            {contactPersons?.map((person) => (
              <tr
                key={person._id}
                className="hover:bg-[#e6f4ff] transition-colors group"
              >
                <td className="px-6 py-4 font-bold text-gray-800">
                  {person.name}
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">
                  {person.designation}
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">
                  {person.phone}
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">
                  {person.email?.toLowerCase()}
                </td>
                {/* <td className="px-6 py-4 text-right">
                  <button className="text-[#1d4ed8] hover:text-[#1e40af] font-medium text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    Edit
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

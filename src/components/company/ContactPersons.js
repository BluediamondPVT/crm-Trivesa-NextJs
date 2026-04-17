export default function ContactPersons({ contactPersons }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="flex items-center justify-between p-6 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </div>
          <h3 className="text-base font-bold text-[#092a49]">Contact Persons</h3>
        </div>
        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full border border-gray-200">
          {contactPersons?.length || 0} People
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {contactPersons?.map((person) => (
              <tr key={person.id} className="hover:bg-[#e6f4ff] transition-colors group">
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
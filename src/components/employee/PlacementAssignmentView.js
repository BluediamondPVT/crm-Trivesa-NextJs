export default function PlacementAssignmentView({ employee, formattedDate }) {
  return (
    <div className="bg-[#f8fafc] rounded-2xl shadow-sm border border-blue-100 p-6 sm:p-8 w-full">
      <h2 className="text-sm font-bold text-blue-800 tracking-wider uppercase mb-6 border-b border-blue-200 pb-3">
        Placement Assignment
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Target Company</p>
          <p className="text-xl font-extrabold text-[#092a49] leading-tight break-words">{employee.assignedCompanyName || "Not Assigned"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Process / Opening</p>
          <p className="text-lg font-bold text-gray-800 leading-tight break-words">{employee.assignedProcess || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Interview Date</p>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
            <p className={`text-base font-bold ${employee.interviewDate ? "text-blue-700" : "text-gray-400 italic"}`}>{formattedDate}</p>
          </div>
        </div>
      </div>

      {employee.remark && (
        <div className="mt-8 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
            Remark / Notes
          </p>
          <p className="text-sm font-bold text-gray-800 whitespace-pre-wrap">{employee.remark}</p>
        </div>
      )}
    </div>
  );
}
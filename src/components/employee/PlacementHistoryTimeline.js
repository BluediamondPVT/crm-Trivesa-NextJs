// src/components/employee/PlacementHistoryTimeline.js

export default function PlacementHistoryTimeline({ history }) {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-[#092a49] border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        Placement History / Journey
      </h2>

      {history && history.length > 0 ? (
        <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 mt-4">
          {[...history].reverse().map((item, index) => (
            <div key={index} className="relative pl-6">
              {/* Timeline Dot */}
              <span
                className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                  item.status === "Selected" || item.status === "Joining" ? "bg-green-500" : 
                  item.status === "Rejected" ? "bg-red-500" : "bg-blue-500"
                }`}
              ></span>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h3 className="font-bold text-gray-800 text-base">
                    {item.companyName || "N/A"}{" "}
                    <span className="text-gray-400 font-normal text-sm">
                      | {item.process || "No Process Assigned"}
                    </span>
                  </h3>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-md w-fit
                      ${item.status === "Selected" || item.status === "Joining" ? "bg-green-100 text-green-700" : 
                        item.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Interview Date */}
                {item.interviewDate && (
                  <p className="text-sm text-blue-700 mb-2 font-bold flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    Interview: {new Date(item.interviewDate).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                )}

                {/* Updated Time */}
                <p className="text-xs text-gray-400 mb-2 font-medium flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Updated on: {new Date(item.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Remark */}
                {item.remark && (
                  <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                    <span className="font-semibold text-gray-700">Remark:</span> {item.remark}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="font-medium text-gray-500">No history available yet.</p>
          <p className="text-xs mt-1">Future status or company assignment changes will be recorded here.</p>
        </div>
      )}
    </div>
  );
}
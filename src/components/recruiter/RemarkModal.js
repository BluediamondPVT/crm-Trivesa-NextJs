export default function RemarkModal({ selectedRemark, onClose }) {
  if (!selectedRemark) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl w-full overflow-hidden transform scale-100 transition-all"
        style={{ maxWidth: "500px" }}
      >
        <div className="bg-[#f8fafc] border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-bold text-[#092a49] flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-[#1d4ed8]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
            Candidate Remark
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Candidate:{" "}
            <span className="text-[#092a49] font-extrabold">
              {selectedRemark.name}
            </span>
          </p>
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl min-h-[100px]">
            <p className="text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedRemark.text}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#092a49] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#183e61] transition-colors shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

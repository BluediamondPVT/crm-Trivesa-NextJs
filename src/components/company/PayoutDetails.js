export default function PayoutDetails({ payoutDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        </div>
        <h3 className="text-base font-bold text-[#092a49]">Payout & Commercials</h3>
      </div>
      
      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-gray-400 font-semibold w-36 shrink-0">Commercials:</span>
          <span className="text-emerald-600 font-extrabold">{payoutDetails?.commercials || 'N/A'}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-gray-400 font-semibold w-36 shrink-0">Pay-out Duration:</span>
          <span className="text-gray-800 font-medium">{payoutDetails?.payoutDuration || 'N/A'}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-gray-400 font-semibold w-36 shrink-0">Replacement Time:</span>
          <span className="text-gray-800 font-medium">{payoutDetails?.replacementTime || 'N/A'}</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-gray-400 font-semibold w-36 shrink-0">Payment Terms:</span>
          <span className="text-gray-800 font-medium leading-relaxed">{payoutDetails?.paymentTerms || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
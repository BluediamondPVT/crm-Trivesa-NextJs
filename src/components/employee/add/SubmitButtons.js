import { useRouter } from "next/navigation";

export default function SubmitButtons({ loading }) {
  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-10 border-t border-gray-200 mt-12 pb-10">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-full sm:w-auto px-10 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-200 transition-all duration-200 shadow-sm cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-10 py-3 bg-[#092a49] text-white font-bold rounded-xl shadow-lg hover:bg-[#1d4ed8] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white">Saving...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="text-white">Save Employee</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function TabsFilter({ tabs, activeTab, setActiveTab, counts }) {
  return (
    <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`relative px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === tab
              ? "bg-[#092a49] text-white border-b-4 border-blue-500"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 border-b-4 border-transparent"
          }`}
        > 
          <span>{tab}</span>
          {counts && counts[tab] !== undefined && (
            <span
              className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {counts[tab]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

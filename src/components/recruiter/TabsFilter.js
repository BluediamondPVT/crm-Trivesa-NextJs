export default function TabsFilter({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-5 py-2.5 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${
            activeTab === tab
              ? "bg-[#092a49] text-white border-b-4 border-blue-500"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 border-b-4 border-transparent"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

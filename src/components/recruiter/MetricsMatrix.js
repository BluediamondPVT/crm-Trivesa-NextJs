export default function MetricsMatrix({ counts, activeTab, setActiveTab }) {
  const metricCards = [
    {
      label: "Total All",
      tab: "All",
      count: counts["All"],
      borderColor: "border-gray-800",
      textColor: "text-gray-800",
      bgHover: "hover:bg-gray-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
        />
      ),
    },
    {
      label: "LineUp",
      tab: "LineUp",
      count: counts["LineUp"],
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      bgHover: "hover:bg-blue-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      ),
    },
    {
      label: "Attendees",
      tab: "Attendees",
      count: counts["Attendees"],
      borderColor: "border-orange-500",
      textColor: "text-orange-700",
      bgHover: "hover:bg-orange-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
        />
      ),
    },
    {
      label: "On Hold",
      tab: "On Hold",
      count: counts["On Hold"],
      borderColor: "border-yellow-400",
      textColor: "text-yellow-700",
      bgHover: "hover:bg-yellow-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      label: "Selected",
      tab: "Selected",
      count: counts["Selected"],
      borderColor: "border-green-500",
      textColor: "text-green-700",
      bgHover: "hover:bg-green-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      label: "Joining",
      tab: "Joining",
      count: counts["Joining"],
      borderColor: "border-teal-500",
      textColor: "text-teal-700",
      bgHover: "hover:bg-teal-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.25 14.15v4.25c0 1.094-.896 1.975-1.975 1.975H5.725a1.975 1.975 0 0 1-1.975-1.975V14.15M8.25 9.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5M6 9.75h12A2.25 2.25 0 0 1 20.25 12v.008c0 1.242-1.008 2.242-2.25 2.242H6c-1.242 0-2.242-1.00-2.242-2.242V12c0-1.242 1.00-2.242 2.242-2.242Z"
        />
      ),
    },
    {
      label: "Rejected",
      tab: "Rejected",
      count: counts["Rejected"],
      borderColor: "border-red-500",
      textColor: "text-red-700",
      bgHover: "hover:bg-red-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    {
      label: "Payout",
      tab: "Payout",
      count: counts["Payout"],
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      bgHover: "hover:bg-purple-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V4.245c0-.754-.726-1.294-1.453-1.096a60.07 60.07 0 01-15.797 2.101c-.699.03-.699 1.038 0 1.068zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      ),
    },

    {
      label: "future",
      tab: "future",
      count: counts["future"],
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      bgHover: "hover:bg-blue-50",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    },
    
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
      {metricCards.map((card) => (
        <div
          key={card.tab}
          onClick={() => setActiveTab(card.tab)}
          className={`bg-white rounded-xl shadow-sm border-b-4 ${card.borderColor} p-4 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 ${card.bgHover} ${activeTab === card.tab ? "ring-2 ring-gray-200 shadow-md" : ""}`}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider line-clamp-1">
              {card.label}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className={`w-4 h-4 ${card.textColor} opacity-70`}
            >
              {card.icon}
            </svg>
          </div>
          <h3 className={`text-2xl font-black ${card.textColor}`}>
            {card.count}
          </h3>
        </div>
      ))}
    </div>
  );
}

import Link from "next/link";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#092a49]">
          Recruiters / LineUps
        </h1>
        <p className="text-gray-500 mt-1">
          Manage employee pipelines and Attendees
        </p>
      </div>
      <Link
        href="/dashboard/admin/recruiters/add"
        className="bg-[#183e61] text-white text-sm px-5 py-2.5 rounded-lg font-semibold hover:bg-[#061a2e] shadow-sm transition-colors"
      >
        + Add Employee
      </Link>
    </div>
  );
}

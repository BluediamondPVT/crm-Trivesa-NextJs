"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import SidebarItem from "./sidebar/SidebarItem";
import SidebarDropdown from "./sidebar/SidebarDropdown";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  const [isClientOpen, setIsClientOpen] = useState(false);
  const [isCandidateOpen, setIsCandidateOpen] = useState(false);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, []);

  const handleMobileClose = () => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const dashboardHref =
    userRole === "recruiter" ? "/dashboard/recruiter" : "/dashboard/admin";

  // 1. Client Sub Items
  const clientSubItems = [
    {
      name: "All Clients",
      color: "bg-yellow-700",
      href: "/dashboard/admin/clientpage",
    },
    {
      name: "Active",
      color: "bg-green-700",
      href: "/dashboard/admin/companies/active",
    },
    {
      name: "Non Active",
      color: "bg-red-700",
      href: "/dashboard/admin/companies/non-active",
    },
    {
      name: "Process",
      color: "bg-orange-700",
      href: "/dashboard/admin/companies/process",
    },
    {
      name: "Listed",
      color: "bg-blue-700",
      href: "/dashboard/admin/companies/listed",
    },
  ].map((item) => ({
    ...item,
    isActive: pathname === item.href,
  }));

  // 2. Candidate Sub Items
  const candidateSubItems = [
    {
      name: "All",
      tabName: "All",
      color: "bg-gray-400",
      href: "/dashboard/admin/recruiters?tab=All",
    },
    {
      name: "LineUp",
      tabName: "LineUp",
      color: "bg-blue-500",
      href: "/dashboard/admin/recruiters?tab=LineUp",
    },
    {
      name: "Attendees",
      tabName: "Attendees",
      color: "bg-orange-500",
      href: "/dashboard/admin/recruiters?tab=Attendees",
    },
    {
      name: "On Hold",
      tabName: "On Hold",
      color: "bg-yellow-400",
      href: "/dashboard/admin/recruiters?tab=On Hold",
    },
    {
      name: "Selected",
      tabName: "Selected",
      color: "bg-green-500",
      href: "/dashboard/admin/recruiters?tab=Selected",
    },
    {
      name: "Joining",
      tabName: "Joining",
      color: "bg-teal-500",
      href: "/dashboard/admin/recruiters?tab=Joining",
    },
    {
      name: "Rejected",
      tabName: "Rejected",
      color: "bg-red-500",
      href: "/dashboard/admin/recruiters?tab=Rejected",
    },
    {
      name: "Payout",
      tabName: "Payout",
      color: "bg-purple-500",
      href: "/dashboard/admin/recruiters?tab=Payout",
    },
  ].map((item) => ({
    ...item,
    isActive:
      pathname.includes("/recruiters") &&
      (currentTab === item.tabName ||
        (!currentTab && item.tabName === "LineUp")),
  }));

  // 3. Recruiter Dropdown Items (Dummy Links)
  const recruiterSubItems = [
    { name: "HR701", color: "bg-cyan-500", href: "#hr701" },
    { name: "HR702", color: "bg-cyan-500", href: "#hr702" },
    { name: "HR703", color: "bg-cyan-500", href: "#hr703" },
    { name: "HR704", color: "bg-cyan-500", href: "#hr704" },
    { name: "HR705", color: "bg-cyan-500", href: "#hr705" },
    { name: "HR706", color: "bg-cyan-500", href: "#hr706" },
    { name: "HR707", color: "bg-cyan-500", href: "#hr707" },
    { name: "HR708", color: "bg-cyan-500", href: "#hr708" },
  ].map((item) => ({
    ...item,
    isActive: pathname === item.href,
  }));

  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed inset-y-0 left-0 z-50 w-64 h-screen bg-[#092a49] text-white flex flex-col shadow-2xl md:relative md:transform-none! md:opacity-100!"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: isSidebarOpen ? 0 : "-100%", opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header Section */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link
            href={dashboardHref}
            onClick={handleMobileClose}
            className="flex items-center cursor-pointer group"
          >
            <div className="bg-white text-[#092a49] p-1.5 rounded-lg mr-3 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-wide group-hover:text-gray-200 transition-colors">
              {userRole === "superadmin"
                ? "Super Admin"
                : userRole === "recruiter"
                  ? "Recruiter"
                  : "Admin"}
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Section (NEW SEQUENCE) */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* 1. Dashboard */}
          <SidebarItem
            href={dashboardHref}
            label="Dashboard"
            isActive={pathname === dashboardHref}
            onClick={handleMobileClose}
            icon={
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
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
              </svg>
            }
          />

          {/* 2. Recruiters (Restricted to non-recruiters) */}
          {userRole !== "recruiter" && (
            <SidebarDropdown
              label="Recruiters"
              isOpen={isRecruiterOpen}
              toggleOpen={() => setIsRecruiterOpen(!isRecruiterOpen)}
              isActive={pathname.includes("/dashboard/admin/hr")}
              subItems={recruiterSubItems}
              pathname={pathname}
              onSubItemClick={handleMobileClose}
              icon={
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
                    d="M20.25 14.15v4.25c0 1.094-.896 1.975-1.975 1.975H5.725a1.975 1.975 0 0 1-1.975-1.975V14.15M8.25 9.75v-1.5a2.25 2.25 0 0 1 2.25-2.25h3a2.25 2.25 0 0 1 2.25 2.25v1.5M6 9.75h12A2.25 2.25 0 0 1 20.25 12v.008c0 1.242-1.008 2.242-2.25 2.242H6c-1.242 0-2.242-1.00-2.242-2.242V12c0-1.242 1.00-2.242 2.242-2.242Z"
                  />
                </svg>
              }
            />
          )}

          {/* 3. Candidates */}
          <SidebarDropdown
            label="Candidates"
            isOpen={isCandidateOpen}
            toggleOpen={() => setIsCandidateOpen(!isCandidateOpen)}
            isActive={
              pathname.includes("/recruiters") &&
              !pathname.includes("/recruiter-head")
            }
            subItems={candidateSubItems}
            pathname={pathname}
            onSubItemClick={handleMobileClose}
            icon={
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
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
            }
          />

          {/* 4. Recruiter Head (Restricted to non-recruiters) */}
          {userRole !== "recruiter" && (
            <SidebarItem
              href="/dashboard/admin/recruiter-head"
              label="Recruiter Head"
              isActive={pathname === "/dashboard/admin/recruiter-head"}
              onClick={handleMobileClose}
              icon={
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
                    d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                  />
                </svg>
              }
            />
          )}

          {/* 5. Clients */}
          <SidebarDropdown
            label="Clients"
            isOpen={isClientOpen}
            toggleOpen={() => setIsClientOpen(!isClientOpen)}
            isActive={
              pathname.includes("/companies") ||
              pathname.includes("/clientpage")
            }
            subItems={clientSubItems}
            pathname={pathname}
            onSubItemClick={handleMobileClose}
            icon={
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
            }
          />

          {/* Super Admin Area: Add Recruiter */}
          {userRole === "superadmin" && (
            <SidebarItem
              href="/dashboard/super/create-recruiter"
              label="Add Recruiter"
              isActive={pathname === "/dashboard/super/create-recruiter"}
              onClick={handleMobileClose}
              customBorder="border-purple-500"
              icon={
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
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              }
            />
          )}
        </nav>

        {/* Footer Section */}
        <div className="p-4 mb-4 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 px-4 py-3 rounded-xl transition-all border-l-4 border-transparent focus:outline-none focus:ring-2 focus:ring-red-500/50"
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
                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
              />
            </svg>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

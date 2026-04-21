"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}) {
  const pathname = usePathname();

  // State only for Client dropdown now
  const [isClientOpen, setIsClientOpen] = useState(false);

  const sidebarVariants = {
    hidden: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const navItemVariants = {
    idle: { x: 0 },
    hover: { x: 4, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const subMenuVariants = {
    closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

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
  ];

  const handleMobileClose = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

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
        variants={sidebarVariants}
        initial="hidden"
        animate={isSidebarOpen ? "visible" : "hidden"}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link
            href="/dashboard/admin"
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
              Admin
            </span>
          </Link>

          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
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

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            href="/dashboard/admin"
            onClick={handleMobileClose}
            className="block"
          >
            <motion.div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${pathname === "/dashboard/admin" ? "bg-white/10 text-white border-l-4 border-[#1d4ed8]" : "text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"}`}
              variants={navItemVariants}
              whileHover="hover"
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
                  d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                />
              </svg>
              <span className="font-medium text-sm">Dashboard</span>
            </motion.div>
          </Link>

          <div>
            <motion.button
              onClick={() => setIsClientOpen(!isClientOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border-l-4 border-transparent hover:bg-white/5 text-gray-300 hover:text-white"
              variants={navItemVariants}
              whileHover="hover"
            >
              <div className="flex items-center gap-3">
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
                <span className="font-medium text-sm">Clients</span>
              </div>
              <motion.svg
                animate={{ rotate: isClientOpen ? 180 : 0 }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {isClientOpen && (
                <motion.div
                  variants={subMenuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="overflow-hidden ml-6 mt-1 space-y-1 border-l border-white/10"
                >
                  {clientSubItems.map((sub, idx) => (
                    <Link
                      key={idx}
                      href={sub.href}
                      onClick={handleMobileClose}
                      className="block"
                    >
                      <motion.div
                        className={`flex items-center gap-3 px-6 py-2 text-sm font-medium hover:text-white hover:bg-white/5 rounded-r-lg transition-all ${pathname === sub.href ? "text-white bg-white/5" : "text-gray-400"}`}
                        whileHover={{ x: 5 }}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${sub.color}`}
                        />
                        {sub.name}
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/dashboard/admin/recruiters"
            onClick={handleMobileClose}
            className="block"
          >
            <motion.div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${pathname.includes("/dashboard/admin/recruiters") ? "bg-white/10 text-white border-l-4 border-[#1d4ed8]" : "text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"}`}
              variants={navItemVariants}
              whileHover="hover"
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
                  d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
              </svg>
              <span className="font-medium text-sm">Recruiter</span>
            </motion.div>
          </Link>
        </nav>

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
              aria-hidden="true"
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
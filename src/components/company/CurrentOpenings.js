"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CurrentOpenings({ openings }) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const isOpeningActive = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expiryDate);
    return expDate >= today;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* 🚀 CLICKABLE HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-5 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#092a49]">Current Openings</h2>
          <span className="bg-[#092a49] text-white text-xs font-bold px-3 py-1 rounded-full">
            {openings?.length || 0} Total
          </span>
        </div>

        {/* Animated Arrow */}
        <div className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>

      {/* 🚀 ANIMATED DROPDOWN CONTENT */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-4">
              {openings?.map((job) => {
                const active = isOpeningActive(job.expiryDate);

                return (
                  <div
                    key={job._id}
                    className={`bg-white rounded-2xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
                      active
                        ? "border-l-4 border-l-green-500 border-gray-100"
                        : "border-l-4 border-l-red-400 border-gray-100 opacity-80"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">
                          {job.title}
                        </h3>
                        {active ? (
                          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                            Non Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className={`w-4 h-4 ${active ? "text-orange-500" : "text-red-500"}`}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                        <span
                          className={active ? "text-gray-600" : "text-red-500"}
                        >
                          Valid till:{" "}
                          <span className="text-gray-900 font-bold">
                            {formatDate(job.expiryDate)}
                          </span>
                        </span>
                      </div>
                    </div>

                    {job.description && (
                      <div className="mb-6 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Job Description
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {job.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Vacancies
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {job.vacancies || "N/A"} Openings
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Experience
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {job.experience || "N/A"}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-2">
                        <p className="text-xs text-gray-500 font-semibold mb-1">
                          Salary Range
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {job.salary || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {(!openings || openings.length === 0) && (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium">
                    No current openings found for this company.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

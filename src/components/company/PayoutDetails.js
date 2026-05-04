"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PayoutDetails({ payoutDetails }) {
  const [isOpen, setIsOpen] = useState(false);

  const commercials = payoutDetails?.commercials || [];
  const hasCommercials = Array.isArray(commercials) && commercials.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 🚀 CLICKABLE HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-6 sm:p-8 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 shadow-sm shrink-0">
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
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#092a49]">
              Payout & Commercials
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Payment terms and fee structure
            </p>
          </div>
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
            <div className="p-6 sm:p-8 border-t border-gray-100 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <span className="text-gray-600 font-bold text-xs uppercase tracking-widest mb-4 block">
                    Commercial Structure Slabs
                  </span>
                  {hasCommercials ? (
                    <div className="space-y-4">
                      {commercials.map((rule, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-emerald-300 transition-colors"
                        >
                          {rule.category && (
                            <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <span className="text-[#092a49] font-bold text-sm tracking-wide">
                                {rule.category}
                              </span>
                            </div>
                          )}
                          <div className="p-4 space-y-3">
                            {rule.slabs &&
                              rule.slabs.map((slab, slabIdx) => (
                                <div
                                  key={slabIdx}
                                  className="flex items-start gap-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M4.5 12.75l6 6 9-13.5"
                                    />
                                  </svg>
                                  <span className="text-gray-700 font-medium">
                                    {slab.slabDetails || "N/A"}
                                  </span>
                                </div>
                              ))}
                            {(!rule.slabs || rule.slabs.length === 0) && (
                              <span className="text-gray-600 italic text-sm pl-2">
                                No slabs defined for this category.
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <span className="text-gray-500 font-medium">
                        No commercial structure added yet.
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50/30 rounded-xl p-6 border border-blue-100/50 h-fit">
                  <span className="text-gray-600 font-bold text-xs uppercase tracking-widest mb-5 block">
                    Additional Terms
                  </span>
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">
                        Pay-out Duration
                      </p>
                      <p className="text-gray-900 font-bold text-lg">
                        {payoutDetails?.payoutDuration || "N/A"} Days
                      </p>
                    </div>
                    <div className="w-full h-px bg-blue-100"></div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">
                        Replacement Time
                      </p>
                      <p className="text-gray-900 font-bold text-lg">
                        {payoutDetails?.replacementTime || "N/A"} Days
                      </p>
                    </div>
                    <div className="w-full h-px bg-blue-100"></div>
                    <div>
                      <p className="text-gray-500 text-xs font-semibold mb-1">
                        Payment Terms
                      </p>
                      <p className="text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-gray-100 mt-2">
                        {payoutDetails?.paymentTerms || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

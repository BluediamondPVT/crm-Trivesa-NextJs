"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// -------------------------------------------------------------
// 🚀 COMPONENT 1: Opening Card (Single Job Item)
// -------------------------------------------------------------
function OpeningCard({ job, payoutDetails, userRole }) {
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

  const active = isOpeningActive(job.expiryDate);

  // 🚀 Data Company ke general terms (payoutDetails) se aa raha hai
  const payoutDuration = payoutDetails?.payoutDuration || "N/A";
  const replacementTime = payoutDetails?.replacementTime || "N/A";
  const paymentTerms = payoutDetails?.paymentTerms || "N/A";

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-6 transition-all duration-200 hover:shadow-md ${
        active
          ? "border-l-4 border-l-green-500 border-gray-100"
          : "border-l-4 border-l-red-400 border-gray-100 opacity-80"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className={active ? "text-gray-600" : "text-red-500"}>
            Valid till: <span className="text-gray-900 font-bold">{formatDate(job.expiryDate)}</span>
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100 mb-6">
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-1">Vacancies</p>
          <p className="text-sm font-bold text-gray-800">{job.vacancies || "N/A"} Openings</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-semibold mb-1">Experience</p>
          <p className="text-sm font-bold text-gray-800">{job.experience || "N/A"}</p>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <p className="text-xs text-gray-500 font-semibold mb-1">Salary Range</p>
          <p className="text-sm font-bold text-gray-800">{job.salary || "N/A"}</p>
        </div>
      </div>

      {/* 🚀 SECURITY CHECK: RECRUITER KO YE DO DIBBE (Terms & Payout) NAHI DIKHENGE */}
      {userRole !== "recruiter" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
          
          {/* 1. Additional Terms Box */}
          <div className="lg:col-span-1 bg-gray-50/50 rounded-xl p-4 border border-gray-100/80">
            <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
              Additional Terms
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Pay-out Duration</p>
                <p className="text-sm font-semibold text-gray-800">{payoutDuration} <span className="text-xs font-normal">Days</span></p>
              </div>
              <div className="w-full h-px bg-gray-200/60"></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Replacement Time</p>
                <p className="text-sm font-semibold text-gray-800">{replacementTime} <span className="text-xs font-normal">Days</span></p>
              </div>
              <div className="w-full h-px bg-gray-200/60"></div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Payment Terms</p>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{paymentTerms}</p>
              </div>
            </div>
          </div>

          {/* 2. Premium Payout Structure Box */}
          <div className="lg:col-span-2 bg-gradient-to-r from-emerald-50/40 to-teal-50/40 rounded-xl border border-emerald-100/60 overflow-hidden flex flex-col">
            <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100/80 text-emerald-600 rounded-lg shadow-sm shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 tracking-tight">Commercial Payout</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500 font-medium">Structure Type:</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {job.payoutType || "Flat Amount"}
                    </span>
                  </div>
                </div>
              </div>

              {(job.payoutType === "Flat Amount" || !job.payoutType) && (
                <div className="text-left sm:text-right bg-white px-4 py-2.5 rounded-lg border border-emerald-100 shadow-sm min-w-[180px]">
                  <span className="text-2xl font-black text-emerald-600">₹ {job.flatAmount || "0"}</span>
                  <span className="text-xs text-gray-500 font-bold ml-1">/ candidate</span>
                </div>
              )}

              {job.payoutType === "Percentage" && (
                <div className="text-left sm:text-right bg-white px-4 py-2.5 rounded-lg border border-emerald-100 shadow-sm min-w-[180px]">
                  <span className="text-2xl font-black text-emerald-600">{job.percentageValue || "0"}%</span>
                  <span className="text-xs text-gray-500 font-bold ml-1">of Annual CTC</span>
                </div>
              )}
            </div>

            {/* Slabs Display (Only shown if Slab Wise) */}
            {job.payoutType === "Slab Wise" && (
              <div className="p-4 flex-1">
                <div className="bg-white rounded-lg border border-emerald-100/70 p-4 shadow-sm h-full">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Defined Slabs</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.slabs && job.slabs.length > 0 ? (
                      job.slabs.map((slab, index) => (
                        <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="p-1.5 bg-emerald-100 rounded text-emerald-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                              {job.slabType === "Amount" 
                                ? `₹${slab.minSalary || 0} to ₹${slab.maxSalary || "∞"} Salary` 
                                : `${slab.minJoinees || 0} to ${slab.maxJoinees || "∞"} Candidates`}
                            </span>
                            <span className="text-sm font-black text-emerald-700">
                              ₹ {slab.amount || 0} <span className="text-xs font-medium text-gray-500">/ each</span>
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs italic text-gray-400">No slabs defined.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 🚀 COMPONENT 2: Main Wrapper (Parent)
// -------------------------------------------------------------
export default function CurrentOpenings({ openings, payoutDetails, userRole }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* CLICKABLE HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-5 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#092a49]">
            Current Openings & Payouts
          </h2>
          <span className="bg-[#092a49] text-white text-xs font-bold px-3 py-1 rounded-full">
            {openings?.length || 0} Total
          </span>
        </div>

        <div className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* ANIMATED DROPDOWN CONTENT */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 space-y-6">
              {openings?.map((job) => (
                <OpeningCard 
                  key={job._id} 
                  job={job} 
                  payoutDetails={payoutDetails} // 🚀 Passed general terms down to card
                  userRole={userRole} 
                />
              ))}

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
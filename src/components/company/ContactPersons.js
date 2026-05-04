"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactPersons({ contactPersons }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      {/* 🚀 CLICKABLE HEADER */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-5 bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <h2 className="text-xl font-bold text-gray-800">Contact HR&apos;s</h2>

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
            <div className="overflow-x-auto border-t border-gray-100">
              <table className="w-full text-left border-collapse min-w-150">
                <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Designation</th>
                    <th className="px-6 py-3 font-medium">Phone</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {contactPersons?.map((person) => (
                    <tr
                      key={person._id}
                      className="hover:bg-[#e6f4ff] transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-gray-800">
                        {person.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {person.designation}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {person.phone}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">
                        {person.email?.toLowerCase()}
                      </td>
                    </tr>
                  ))}
                  {(!contactPersons || contactPersons.length === 0) && (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500 italic"
                      >
                        No contact persons added.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

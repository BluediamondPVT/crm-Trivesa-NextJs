"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation"; // NAYA: router import kiya back jaane ke liye

export default function CreateRecruiterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "recruiter",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/users", formData);

      if (res.data.success) {
        toast.success("Recruiter account generated successfully!");
        setFormData({ email: "", password: "", role: "recruiter" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 w-full max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#092a49] tracking-tight">
            Add Team Member
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Generate secure login credentials for a new recruiter.
          </p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2 w-fit shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-sm font-bold text-blue-800 uppercase tracking-wider">
            Super Admin Access
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top Blue Accent Line */}
        <div className="h-2 w-full bg-[#092a49]"></div>

        <div className="p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., recruiter@trivesa.com"
                  className="w-full p-3 bg-[#f4f7fb] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1d4ed8] focus:bg-white focus:border-[#1d4ed8] outline-none transition-all font-medium text-gray-800"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                  Enter Password *
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6} // Pichla fix yahan rakha hai
                  placeholder="Create a strong password"
                  className="w-full p-3 bg-[#f4f7fb] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1d4ed8] focus:bg-white focus:border-[#1d4ed8] outline-none transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            {/* Warning Info Box (Yellow) */}
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-4 flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 text-[#d97706] shrink-0 mt-0.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <p className="text-sm text-[#92400e] font-medium leading-relaxed">
                The recruiter will use these credentials to log in. Their access
                will be restricted strictly to candidate management and pipeline
                operations.
              </p>
            </div>

            {/* Hidden Role */}
            <input type="hidden" name="role" value={formData.role} />

            {/* Submit & Cancel Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row justify-end items-center gap-4">
              {/* NAYA: Cancel Button */}
              <button
                type="button"
                onClick={() => router.push("/dashboard/super")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 bg-[#092a49] text-white font-bold py-3 rounded-xl shadow-md hover:bg-[#1d4ed8] transition-colors disabled:opacity-70 flex justify-center items-center gap-3 cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Create Recruiter Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

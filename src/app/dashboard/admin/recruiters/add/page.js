"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

export default function AddEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Data for dynamic dropdowns
  const [activeCompanies, setActiveCompanies] = useState([]);
  const [availableOpenings, setAvailableOpenings] = useState([]);
  

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    lastSalary: "",
    expectedSalary: "",
    assignedCompanyId: "",
    assignedCompanyName: "",
    assignedProcess: "",
    interviewDate: "", // NAYA FIELD ADD KIYA
    status: "LineUp", // Default status is always LineUp on creation
  });

  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // 1. Fetch only ACTIVE companies on page load
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/companies");
        if (res.data.success) {
          const actives = res.data.data.filter((c) => c.status === "Active");
          setActiveCompanies(actives);
        }
      } catch (error) {
        toast.error("Failed to load companies");
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Magic Logic: Jab company select ho, toh uski details aur uske ACTIVE openings set karo
  const handleCompanyChange = (e) => {
    const compId = e.target.value;
    const selectedCompany = activeCompanies.find((c) => c._id === compId);

    setFormData({
      ...formData,
      assignedCompanyId: compId,
      assignedCompanyName: selectedCompany ? selectedCompany.name : "",
      assignedProcess: "", 
    });

    if (selectedCompany && selectedCompany.openings) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeOnlyOpenings = selectedCompany.openings.filter((op) => {
        if (!op.expiryDate) return true; 
        const expDate = new Date(op.expiryDate);
        return expDate >= today; 
      });

      setAvailableOpenings(activeOnlyOpenings);
    } else {
      setAvailableOpenings([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/employees", formData);
      if (res.data.success) {
        toast.success("Candidate Added to LineUp Successfully!");
        router.push("/dashboard/admin/recruiters");
      }
    } catch (error) {
      toast.error("Network Error. Is Backend Running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-[#092a49]">
          Add Employee / LineUp
        </h1>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-[#1d4ed8] font-medium text-sm transition-colors"
        >
          Cancel & Go Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        {/* Personal Details */}
        <h2 className="text-lg font-bold text-[#092a49] border-b pb-2">
          Personal Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name *
            </label>
            <input
              required
              placeholder="Enter Employ Name"
              type="text"
              name="name"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone *
            </label>
            <input
              required
              type="text"
              name="phone"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Professional Details */}
        <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
          Experience & Salary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Experience
            </label>
            <input
              type="text"
              name="experience"
              placeholder="e.g. 2 Years"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Last Salary
            </label>
            <input
              type="text"
              name="lastSalary"
              placeholder="e.g. 25000"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Expected Salary
            </label>
            <input
              type="text"
              name="expectedSalary"
              placeholder="e.g. 35000"
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Interview Details (Dynamic Dropdowns & Date) */}
        <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
          Interview Details
        </h2>
        {/* NAYA: Grid ko md:grid-cols-2 kar diya taaki 4 items mast 2x2 layout mein baithein */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          
          {/* Company Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Select Company *
            </label>
            <select
              required
              name="assignedCompanyId"
              value={formData.assignedCompanyId}
              onChange={handleCompanyChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">-- Choose Active Client --</option>
              {activeCompanies.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Process Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Process / Opening *
            </label>
            <select
              required
              name="assignedProcess"
              value={formData.assignedProcess}
              onChange={handleChange}
              disabled={!formData.assignedCompanyId}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 outline-none bg-white"
            >
              <option value="">-- Select Opening --</option>
              {availableOpenings.map((op, idx) => (
                <option key={idx} value={op.title}>
                  {op.title}
                </option>
              ))}
            </select>
          </div>

          {/* NAYA: Interview Date Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Interview Date *
            </label>
            <input
              required
              type="date"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
          </div>

          {/* Custom Status Dropdown (LOCKED FOR ADD MODE WITH SVGs) */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Status
            </label>
            
            <div
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-bold text-[#092a49] bg-white outline-none cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {formData.status === "LineUp" && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                )}
                <span>{formData.status}</span>
              </div>
              
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            {isStatusOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                <div
                  onClick={() => {
                    handleChange({ target: { name: 'status', value: 'LineUp' } });
                    setIsStatusOpen(false);
                  }}
                  className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer font-bold text-[#092a49]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  LineUp
                </div>

                {['Attendees', 'On Hold', 'Selected', 'Rejected'].map((statusOption) => (
                  <div 
                    key={statusOption} 
                    className="flex items-center gap-2 p-1 bg-gray-50 opacity-60 cursor-not-allowed text-gray-500 border-t border-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    {statusOption} (Edit later)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit & Cancel Button Section */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-10 border-t border-gray-200 mt-12 pb-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-10 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-200 transition-all duration-200 shadow-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-3 bg-[#092a49] text-white font-bold rounded-xl shadow-lg hover:bg-[#1d4ed8] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white">Saving...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-white">Save Employee</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
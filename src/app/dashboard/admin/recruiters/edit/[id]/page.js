"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [activeCompanies, setActiveCompanies] = useState([]);
  const [availableOpenings, setAvailableOpenings] = useState([]);

  // NAYA: remark field ko initial state mein add kiya
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    experience: "",
    lastSalary: "",
    expectedSalary: "",
    actualSalary: "",
    assignedCompanyId: "",
    assignedCompanyName: "",
    assignedProcess: "",
    interviewDate: "",
    remark: "",
    status: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const compRes = await axios.get("/api/companies");
        let companies = [];
        if (compRes.data.success) {
          companies = compRes.data.data.filter((c) => c.status === "Active");
          setActiveCompanies(companies);
        }

        const empRes = await axios.get(`/api/employees/${id}`);
        if (empRes.data.success) {
          const empData = empRes.data.data;

          if (empData.interviewDate && empData.interviewDate.includes("T")) {
            empData.interviewDate = empData.interviewDate.split("T")[0];
          }

          // Ensure remark doesn't show undefined
          empData.remark = empData.remark || "";
          setFormData(empData);

          const selectedCompany = companies.find(
            (c) => c._id === empData.assignedCompanyId,
          );
          if (selectedCompany && selectedCompany.openings) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const activeOnlyOpenings = selectedCompany.openings.filter((op) => {
              if (!op.expiryDate) return true;
              return new Date(op.expiryDate) >= today;
            });
            setAvailableOpenings(activeOnlyOpenings);
          }
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        return new Date(op.expiryDate) >= today;
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
      const res = await axios.put(`/api/employees/${id}`, formData);
      if (res.data.success) {
        toast.success("Candidate Data Updated!");
        router.push("/dashboard/admin/recruiters");
      }
    } catch (error) {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Selected":
        return {
          color: "text-green-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "Rejected":
        return {
          color: "text-red-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "Attendees":
        return {
          color: "text-orange-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "On Hold":
        return {
          color: "text-yellow-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          ),
        };
      case "Joining":
        return {
          color: "text-teal-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-2.846.813a4.5 4.5 0 00-3.09 3.09z"
            />
          ),
        };
      case "LineUp":
      default:
        return {
          color: "text-blue-500",
          icon: (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
            />
          ),
        };
    }
  };

  if (fetching)
    return (
      <div className="p-10 text-center font-bold text-[#092a49] mt-10">
        Loading Data...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">
            View / Edit Candidate
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update details for {formData.name}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-500 hover:text-[#1d4ed8] font-medium text-sm transition-colors cursor-pointer"
        >
          Cancel
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
              type="text"
              name="name"
              value={formData.name}
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
              value={formData.phone}
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
              value={formData.email}
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
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Professional Details */}
        <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">Experience & Salary</h2>
        <div className={`grid grid-cols-1 gap-4 ${formData.status === 'Joining' ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label><input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Last Salary</label><input type="text" name="lastSalary" value={formData.lastSalary} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Expected Salary</label><input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          
          {/* NAYA: CONDITIONAL ACTUAL SALARY INPUT */}
          {formData.status === 'Joining' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <label className="block text-sm font-extrabold text-teal-700 mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                Actual Salary *
              </label>
              <input 
                required 
                type="text" 
                name="actualSalary" 
                value={formData.actualSalary || ""} 
                onChange={handleChange} 
                placeholder="Final Amount"
                className="w-full p-2 border-2 border-teal-400 rounded-md focus:ring-2 focus:ring-teal-600 outline-none bg-teal-50 text-teal-900 font-bold" 
              />
            </div>
          )}
        </div>

        {/* Placement Details */}
        <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
          Placement Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Interview Date *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </div>
              <input
                required
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white text-[#092a49] font-medium cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          {/* CUSTOM STATUS DROPDOWN */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Status
            </label>
            <div
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-bold text-[#092a49] bg-white outline-none cursor-pointer flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className={`w-5 h-5 ${getStatusStyle(formData.status).color}`}
                >
                  {getStatusStyle(formData.status).icon}
                </svg>
                <span>{formData.status || "Select"}</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isStatusOpen ? "rotate-180" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>

            {isStatusOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                {/* NAYA: Joining Add kiya */}
                {[
                  "LineUp",
                  "Attendees",
                  "Selected",
                  "Joining",
                  "Rejected",
                  "On Hold",
                ].map((statusOption) => (
                  <div
                    key={statusOption}
                    onClick={() => {
                      // NAYA: Ab status change hone pe remark clear NAHI hoga
                      setFormData({ ...formData, status: statusOption });
                      setIsStatusOpen(false);
                    }}
                    className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer font-bold text-[#092a49] border-b border-gray-50 last:border-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className={`w-5 h-5 ${getStatusStyle(statusOption).color}`}
                    >
                      {getStatusStyle(statusOption).icon}
                    </svg>
                    {statusOption}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NAYA: UNIVERSAL REMARK INPUT (Hamesha dikhega, kisi bhi status ke liye) */}
          <div className="md:col-span-2 mt-2 transition-all duration-300 ease-in-out">
            <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
              Remark / Notes
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="2"
              placeholder="Enter details like selection status, hold reason, joining date, etc..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-800 font-medium"
            ></textarea>
          </div>

          {/* NAYA: CONDITIONAL REMARK INPUT (Sirf tab dikhega jab status "On Hold" ho) */}
          {formData.status === "On Hold" && (
            <div className="md:col-span-2 mt-2 transition-all duration-300 ease-in-out">
              <label className="block text-sm font-bold text-yellow-700 mb-1 flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"
                  />
                </svg>
                Reason for Hold (Remark) *
              </label>
              <textarea
                required
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows="2"
                placeholder="Client asked to wait for 2 days..."
                className="w-full p-3 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none bg-yellow-50/50 text-yellow-900 font-medium shadow-inner"
              ></textarea>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-10 border-t border-gray-200 mt-12 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-10 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-200 transition-all shadow-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-3 bg-[#092a49] text-white font-bold rounded-xl shadow-lg hover:bg-[#1d4ed8] transition-all disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white">Updating...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="text-white">Update Candidate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// src/app/dashboard/admin/recruiters/add/page.js
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
    status: "LineUp", // Default status
  });

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

  // 2. Magic Logic: Jab company select ho, toh uski details aur uske openings set karo
  const handleCompanyChange = (e) => {
    const compId = e.target.value;
    const selectedCompany = activeCompanies.find((c) => c._id === compId);

    setFormData({
      ...formData,
      assignedCompanyId: compId,
      assignedCompanyName: selectedCompany ? selectedCompany.name : "",
      assignedProcess: "", // Process clear kardo taaki purani job na reh jaye
    });

    setAvailableOpenings(
      selectedCompany && selectedCompany.openings
        ? selectedCompany.openings
        : [],
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/employees", formData);
      if (res.data.success) {
        toast.success("Employee Added Successfully!");
        router.push("/dashboard/admin/recruiters");
      }
    } catch (error) {
      toast.error("Network Error. Is Backend Running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-[#092a49]">
          Add Employee / LineUp
        </h1>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-blue-600 font-medium text-sm"
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
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Placement Details (Dynamic Dropdowns) */}
        <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
          Placement Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Select Opening --</option>
              {availableOpenings.map((op, idx) => (
                <option key={idx} value={op.title}>
                  {op.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-bold text-[#092a49]"
            >
              <option value="LineUp">LineUp</option>
              <option value="Attendance">Attendance</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? "Saving..." : "Save Employee Details"}
        </button>
      </form>
    </div>
  );
}

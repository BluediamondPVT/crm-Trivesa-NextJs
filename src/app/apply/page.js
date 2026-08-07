"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"; // Assuming you use Sonner for toasts

export default function PublicApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    address: "",
    source: "", // Text input instead of dropdown
    qualification: "", // Text input instead of dropdown
    specialization: "", // This will act as Domain / Industry
    skills: [],
    experience: "",
    lastSalary: "",
    expectedSalary: "",
    remark: "", // This is the 'Note' field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Skills Tag Logic
  const handleSkillKeyDown = (e) => {
    // 🚀 FIX: Added ' ' (Space) to the condition
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !formData.skills.includes(newSkill)) {
        setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.source ||
      !formData.qualification ||
      !formData.specialization
    ) {
      toast.error("Please fill all mandatory (*) fields.");
      return;
    }

    setLoading(true);
    try {
      // POST direct to our new public API
      const response = await axios.post("/api/public/apply", formData);
      if (response.data.success) {
        toast.success("Application submitted successfully!");
        // Reset form after success
        setFormData({
          name: "",
          phone: "",
          email: "",
          age: "",
          address: "",
          source: "",
          qualification: "",
          specialization: "",
          skills: [],
          experience: "",
          lastSalary: "",
          expectedSalary: "",
          remark: "",
        });
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#092a49] py-8 px-8 text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Join Our Network
          </h2>
          <p className="mt-2 text-blue-100 text-sm">
            Fill out the details below to register your profile in our system.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {/* PERSONAL DETAILS */}
          <div>
            <h3 className="text-lg font-bold text-[#092a49] border-b border-gray-200 pb-2 mb-6">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Full Name"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter Address here"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="col-span-1 lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Source *
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g. LinkedIn, Referral, Walk-in"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* PROFESSIONAL DETAILS */}
          <div>
            <h3 className="text-lg font-bold text-[#092a49] border-b border-gray-200 pb-2 mb-6">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech, MBA, B.Com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Domain / Industry *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="e.g. IT, BPO, Sales"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {/* SKILLS MULTI-INPUT */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Skills (Type & Press Enter)
                </label>
                <div className="w-full p-2 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all flex flex-wrap gap-2 items-center bg-white">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 cursor-default"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-600 focus:outline-none"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder={
                      formData.skills.length === 0
                        ? "e.g. React, Node.js, Sales"
                        : ""
                    }
                    className="flex-1 min-w-[150px] outline-none px-2 py-1 text-sm bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 2 Years"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Last Salary (Month)
                </label>
                <input
                  type="text"
                  name="lastSalary"
                  value={formData.lastSalary}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Expected Salary (Month)
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleChange}
                  placeholder="e.g. 35000"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ADDITIONAL NOTES */}
          <div>
            <h3 className="text-lg font-bold text-[#092a49] border-b border-gray-200 pb-2 mb-6">
              Additional Information
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Note (Optional)
              </label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows="3"
                placeholder="Add any special request or extra information here..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-bold text-sm transition-all shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#092a49] hover:bg-blue-900 cursor-pointer"}`}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

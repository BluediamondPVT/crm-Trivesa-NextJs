"use client";

import { useState, useEffect } from "react";

const specializationData = {
  "Business, Management & Strategy": ["Business Management", "Operations Management", "Project Management", "Product Management", "Business Analysis", "Strategy & Consulting", "Entrepreneurship / Startup Management", "Other"],
  "Information Technology (IT)": ["Software Development", "IT Services & Support", "Systems Administration", "Network Engineering", "Cloud & DevOps", "Cybersecurity", "Data Science & Analytics", "Other"],
  "Finance & Accounting": ["Accounting", "Financial Planning & Analysis", "Auditing & Taxation", "Banking & Financial Services", "Investment & Wealth Management", "Risk & Compliance", "Other"],
  "Sales, Marketing & Growth": ["Sales (B2B / B2C)", "Business Development", "Digital Marketing", "Brand Management", "Market Research", "Performance Marketing", "Public Relations (PR)", "Other"],
  "Human Resources (HR)": ["Talent Acquisition / Recruitment", "HR Operations", "Payroll & Compliance", "Learning & Development (L&D)", "Employee Engagement", "Organizational Development", "Other"],
  "Healthcare & Life Sciences": ["Clinical Practice", "Nursing & Patient Care", "Pharmacy", "Medical Administration", "Healthcare Management", "Clinical Research & Trials", "Other"],
  "Engineering & Manufacturing": ["Civil Engineering", "Mechanical Engineering", "Electrical & Electronics", "Industrial Engineering", "Production & Manufacturing", "Quality Control & Assurance", "Other"],
  "Operations, Supply Chain & Logistics": ["Supply Chain Management", "Logistics & Transportation", "Procurement & Sourcing", "Inventory & Warehouse Management", "Operations Execution", "Other"],
  "Customer Service & BPO": ["Customer Support (Voice / Non-Voice)", "Telecalling / Telesales", "Customer Experience (CX)", "Technical Support", "Client Relationship Management", "Other"],
  "Hospitality, Travel & Tourism": ["Hotel Management", "Travel & Tourism", "Event Management", "Food & Beverage Service", "Guest Relations", "Other"],
  "Creative, Media & Design": ["Graphic Design", "Content Creation", "Copywriting", "Video Production & Editing", "Animation & Multimedia", "UI/UX Design", "Other"],
  "Legal & Compliance": ["Legal Advisory", "Corporate Law", "Compliance & Regulatory Affairs", "Contract Management", "Intellectual Property (IP)", "Other"],
  "Education & Training": ["Teaching & Academics", "Training & Development", "Academic Counselling", "Instructional Design", "EdTech", "Other"],
  "Real Estate & Construction": ["Real Estate Sales", "Property Management", "Construction Management", "Site Engineering", "Architecture & Planning", "Other"],
  "Retail & E-commerce": ["Retail Operations", "Store Management", "Merchandising", "E-commerce Operations", "Marketplace Management", "Other"],
  "Skilled Trades & Blue-Collar": ["Technical Services (Electrician, Plumber, etc.)", "Machine Operations", "Maintenance Services", "Driving & Delivery", "Security Services", "Other"],
  "Custom / Unlisted": ["Other"] 
};

export default function ProfessionalDetailsForm({
  formData,
  handleChange,
  handleAddSkill,
  handleRemoveSkill,
}) {
  const [specCategory, setSpecCategory] = useState("");
  const [specSubCategory, setSpecSubCategory] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (formData.specialization && !initialized) {
      let foundCat = "";
      let foundSub = "";

      for (const [cat, subs] of Object.entries(specializationData)) {
        if (subs.includes(formData.specialization) && formData.specialization !== "Other") {
          foundCat = cat;
          foundSub = formData.specialization;
          break;
        }
      }

      if (foundCat) {
        setSpecCategory(foundCat);
        setSpecSubCategory(foundSub);
      } else {
        setSpecCategory("Custom / Unlisted");
        setSpecSubCategory("Other");
      }
      setInitialized(true);
    }
  }, [formData.specialization, initialized]);

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSpecCategory(cat);
    setSpecSubCategory("");
    handleChange({ target: { name: "specialization", value: "" } });
  };

  const handleSubCategoryChange = (e) => {
    const sub = e.target.value;
    setSpecSubCategory(sub);
    if (sub !== "Other") {
      handleChange({ target: { name: "specialization", value: sub } });
    } else {
      handleChange({ target: { name: "specialization", value: "" } });
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold text-[#092a49] border-b pb-2 pt-4">
        Professional Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Qualification */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Qualification *
          </label>
          <select
            name="qualification"
            value={formData.qualification || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select --</option>
            <option value="HSC">HSC</option>
            <option value="Graduate">Graduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>

        {/* Main Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Domain / Industry *
          </label>
          <select
            value={specCategory}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="">-- Select Domain --</option>
            {Object.keys(specializationData).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sub-Category Dropdown */}
        {specCategory && (
          <div className={`${specSubCategory === "Other" ? "" : "md:col-span-2"} transition-all`}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Role / Specialization *
            </label>
            <select
              value={specSubCategory}
              onChange={handleSubCategoryChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">-- Select Specialization --</option>
              {specializationData[specCategory].map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        {/* Custom Input Box */}
        {specSubCategory === "Other" && (
          <div className="md:col-span-1 animate-in fade-in zoom-in duration-200"> 
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Type Custom Specialization *
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization || ""}
              onChange={handleChange}
              placeholder="e.g. GST Expert, React Native..."
              className="w-full p-2 border-2 border-blue-400 rounded-md focus:ring-2 focus:ring-blue-600 outline-none bg-blue-50 shadow-inner"
              required
            />
          </div>
        )}

        {/* Skills */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Skills (Type & Press Enter)
          </label>
          <div className="p-2 border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap gap-2 items-center">
            {formData.skills && formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-[#092a49] px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-500 hover:text-red-500 focus:outline-none transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder={formData.skills?.length === 0 ? "e.g. React, Node.js, Sales" : "Add more..."}
              className="flex-1 outline-none bg-transparent min-w-[120px] text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  handleAddSkill(e.target.value);
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value.trim() !== "") {
                  handleAddSkill(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Experience
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience || ""}
            onChange={handleChange}
            placeholder="e.g. 2 Years"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        {/* Last Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Last Salary (Month)
          </label>
          <input
            type="text"
            name="lastSalary"
            value={formData.lastSalary || ""}
            onChange={handleChange}
            placeholder="e.g. 25000"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        {/* Expected Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Expected Salary (Month)
          </label>
          <input
            type="text"
            name="expectedSalary"
            value={formData.expectedSalary || ""}
            onChange={handleChange}
            placeholder="e.g. 35000"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>

        {/* 🚀 MAGIC FIX: Final / Actual Salary (Visible ONLY if Status is "Joining") */}
        {formData.status === "Joining" && (
          <div className="md:col-span-2 animate-in fade-in zoom-in duration-300">
            <label className="block text-sm font-bold text-teal-700 mb-1">
              Final / Actual Salary (Required) *
            </label>
            <input
              required
              type="text"
              name="actualSalary"
              value={formData.actualSalary || ""}
              onChange={handleChange}
              placeholder="e.g. 40000"
              className="w-full p-3 border-2 border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none bg-teal-50 shadow-inner font-bold text-teal-900"
            />
          </div>
        )}

      </div>
    </>
  );
}
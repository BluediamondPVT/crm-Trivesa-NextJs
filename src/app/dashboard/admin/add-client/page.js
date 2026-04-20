// src/app/dashboard/admin/add-client/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Shadcn sonner library

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // STATE UPDATE
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    companyType: "BPO",
    natureOfBusiness: "",
    description: "",
    status: "Active",

    // NAYA: commercials ko nested array bana diya (Category -> Slabs)
    payoutDetails: {
      commercials: [
        {
          category: "",
          slabs: [{ slabDetails: "" }],
        },
      ],
      payoutDuration: "",
      replacementTime: "",
      paymentTerms: "",
    },

    contactPersons: [{ name: "", designation: "", phone: "", email: "" }],
    openings: [
      {
        title: "",
        experience: "",
        salary: "",
        vacancies: "",
        expiryDate: "",
        description: "",
      },
    ],
  });

  // Basic Form Fields Handle karne ka function
  const handleChange = (e, section, index, field) => {
    if (section === "basic") {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (section === "payout-basic") {
      // For duration, replacement, terms
      setFormData({
        ...formData,
        payoutDetails: {
          ...formData.payoutDetails,
          [e.target.name]: e.target.value,
        },
      });
    } else if (section === "contacts") {
      const updatedContacts = [...formData.contactPersons];
      updatedContacts[index][field] = e.target.value;
      setFormData({ ...formData, contactPersons: updatedContacts });
    } else if (section === "openings") {
      const updatedOpenings = [...formData.openings];
      updatedOpenings[index][field] = e.target.value;
      setFormData({ ...formData, openings: updatedOpenings });
    }
  };

  // --- NAYE COMMERCIALS (NESTED) HANDLERS ---

  // 1. Add/Remove Full Category
  const addCommercialCategory = () => {
    const updated = { ...formData.payoutDetails };
    updated.commercials.push({ category: "", slabs: [{ slabDetails: "" }] });
    setFormData({ ...formData, payoutDetails: updated });
  };

  const removeCommercialCategory = (catIndex) => {
    const updated = { ...formData.payoutDetails };
    updated.commercials = updated.commercials.filter((_, i) => i !== catIndex);
    setFormData({ ...formData, payoutDetails: updated });
  };

  const handleCategoryChange = (e, catIndex) => {
    const updated = { ...formData.payoutDetails };
    updated.commercials[catIndex].category = e.target.value;
    setFormData({ ...formData, payoutDetails: updated });
  };

  // 2. Add/Remove Slabs Inside a Category
  const addSlab = (catIndex) => {
    const updated = { ...formData.payoutDetails };
    updated.commercials[catIndex].slabs.push({ slabDetails: "" });
    setFormData({ ...formData, payoutDetails: updated });
  };

  const removeSlab = (catIndex, slabIndex) => {
    const updated = { ...formData.payoutDetails };
    updated.commercials[catIndex].slabs = updated.commercials[
      catIndex
    ].slabs.filter((_, i) => i !== slabIndex);
    setFormData({ ...formData, payoutDetails: updated });
  };

  const handleSlabChange = (e, catIndex, slabIndex) => {
    const updated = { ...formData.payoutDetails };
    updated.commercials[catIndex].slabs[slabIndex].slabDetails = e.target.value;
    setFormData({ ...formData, payoutDetails: updated });
  };
  // --- END COMMERCIAL HANDLERS ---

  // Naya Contact Person add/remove karne ka logic
  const addContactPerson = () =>
    setFormData({
      ...formData,
      contactPersons: [
        ...formData.contactPersons,
        { name: "", designation: "", phone: "", email: "" },
      ],
    });
  const removeContactPerson = (index) =>
    setFormData({
      ...formData,
      contactPersons: formData.contactPersons.filter((_, i) => i !== index),
    });

  // Nayi Opening add/remove karne ka logic
  const addOpening = () =>
    setFormData({
      ...formData,
      openings: [
        ...formData.openings,
        {
          title: "",
          experience: "",
          salary: "",
          vacancies: "",
          expiryDate: "",
          description: "",
        },
      ],
    });
  const removeOpening = (index) =>
    setFormData({
      ...formData,
      openings: formData.openings.filter((_, i) => i !== index),
    });

  // API ko data submit karne ka function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Client Added Successfully!");
        router.push("/dashboard/admin"); // Wapas dashboard pe le jao
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Network Error. Is Backend Running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">Add New Client</h1>
          <p className="text-gray-500 mt-1">
            Register a new company, their payouts, HRs, and initial openings.
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-[#1d4ed8] font-medium text-sm transition-colors"
        >
          Cancel & Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Company Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#092a49] mb-4 border-b pb-2">
            1. Client Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Tata Consultancy Services"
              />
            </div>

            {/* Company Type Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Company Type
              </label>
              <select
                name="companyType"
                value={formData.companyType}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="BPO">BPO</option>
                <option value="Non BPO">Non BPO</option>
                <option value="KPO">KPO</option>
                <option value="IT">IT</option>
              </select>
            </div>

            {/* Conditional Dropdown for Nature of Business */}
            {formData.companyType === "Non BPO" && (
              <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nature of Business
                </label>
                <select
                  name="natureOfBusiness"
                  value={formData.natureOfBusiness}
                  onChange={(e) => handleChange(e, "basic")}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">-- Select Nature of Business --</option>
                  <option value="Pharmaceutical">Pharmaceutical</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Logistic">Logistic</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Construction">Construction</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="careers@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="+91 9999999999"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="www.company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option>Active</option>
                <option>Non Active</option>
                <option>Listed</option>
                <option>Process</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => handleChange(e, "basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Full Address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e, "basic")}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Brief about the company..."
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Payout & Commercials (UPDATED FOR NESTED SLABS) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-[#092a49]">
              2. Payout Structure (Slabs)
            </h2>
            <button
              type="button"
              onClick={addCommercialCategory}
              className="text-sm bg-[#092a49] text-white px-3 py-1 rounded-md font-bold hover:bg-[#183e61] transition-colors"
            >
              + Add Category
            </button>
          </div>

          <div className="space-y-6 mb-8">
            {formData.payoutDetails.commercials.map((categoryItem, catIdx) => (
              <div
                key={catIdx}
                className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 relative"
              >
                {/* Remove Category Button */}
                {formData.payoutDetails.commercials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCommercialCategory(catIdx)}
                    // Dynamic label se screen reader user ko pata chalega ki wo kaunsi category delete kar raha hai
                    aria-label={`Remove category ${catIdx + 1}`}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1.5 bg-white rounded-md shadow-sm border border-red-100 focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true" // Icon ko accessibility tree se hide karein
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                )}

                {/* Category Name Input (Left Side Data) */}
                <div className="mb-4 pr-10">
                  <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                    Process / Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryItem.category}
                    onChange={(e) => handleCategoryChange(e, catIdx)}
                    className="w-full sm:w-2/3 p-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-[#092a49]"
                    placeholder="e.g. For CSR level the payout will be:"
                  />
                </div>

                {/* Slabs Section (Right Side Data) */}
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2 border-b pb-2 border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Slabs & Rates
                    </label>
                    <button
                      type="button"
                      onClick={() => addSlab(catIdx)}
                      className="text-xs text-[#1d4ed8] hover:text-[#1e40af] font-bold flex items-center gap-1"
                    >
                      + Add Slab
                    </button>
                  </div>

                  <div className="space-y-2">
                    {categoryItem.slabs.map((slab, slabIdx) => (
                      <div key={slabIdx} className="flex gap-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <input
                          type="text"
                          value={slab.slabDetails}
                          onChange={(e) => handleSlabChange(e, catIdx, slabIdx)}
                          className="flex-1 p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                          placeholder="e.g. Rs. 2000/- (0-03 per candidate)"
                        />

                        {categoryItem.slabs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlab(catIdx, slabIdx)}
                            // Dynamic label: "Remove Slab 1", "Remove Slab 2", etc.
                            aria-label={`Remove slab ${slabIdx + 1}`}
                            className="text-gray-600 hover:text-red-500 p-1.5 shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                              aria-hidden="true" 
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Pay-out Duration
              </label>
              <input
                type="text"
                name="payoutDuration"
                value={formData.payoutDetails.payoutDuration}
                onChange={(e) => handleChange(e, "payout-basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 30 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Replacement Time
              </label>
              <input
                type="text"
                name="replacementTime"
                value={formData.payoutDetails.replacementTime}
                onChange={(e) => handleChange(e, "payout-basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 60 Days"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                name="paymentTerms"
                value={formData.payoutDetails.paymentTerms}
                onChange={(e) => handleChange(e, "payout-basic")}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Post joining & invoice submission"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Contact Persons (DYNAMIC) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-[#092a49]">
              3. Contact Persons (HRs)
            </h2>
            <button
              type="button"
              onClick={addContactPerson}
              className="text-sm bg-orange-50 text-orange-600 px-3 py-1 rounded-md font-bold hover:bg-orange-100"
            >
              + Add Person
            </button>
          </div>
          {formData.contactPersons.map((person, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start mb-4 bg-gray-50 p-4 rounded-lg relative"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => handleChange(e, "contacts", index, "name")}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="HR Name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={person.designation}
                  onChange={(e) =>
                    handleChange(e, "contacts", index, "designation")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g. TA Head"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={person.phone}
                  onChange={(e) => handleChange(e, "contacts", index, "phone")}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Phone"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={person.email}
                  onChange={(e) => handleChange(e, "contacts", index, "email")}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Email"
                />
              </div>

              {/* Delete Button */}
              {formData.contactPersons.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeContactPerson(index)}
                  className="md:mt-6 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-2 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* SECTION 4: Current Openings (DYNAMIC) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-[#092a49]">
              4. Initial Openings
            </h2>
            <button
              type="button"
              onClick={addOpening}
              className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md font-bold hover:bg-green-100"
            >
              + Add Opening
            </button>
          </div>
          {formData.openings.map((job, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start mb-4 bg-gray-50 p-4 rounded-lg relative"
            >
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={job.title}
                  onChange={(e) => handleChange(e, "openings", index, "title")}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="e.g. React Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={job.experience}
                  onChange={(e) =>
                    handleChange(e, "openings", index, "experience")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="2-4 Years"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={job.salary}
                  onChange={(e) => handleChange(e, "openings", index, "salary")}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="8LPA - 12LPA"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Vacancies
                </label>
                <input
                  type="number"
                  value={job.vacancies}
                  onChange={(e) =>
                    handleChange(e, "openings", index, "vacancies")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Count"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={job.expiryDate}
                  onChange={(e) =>
                    handleChange(e, "openings", index, "expiryDate")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Job Description
                </label>
                <input
                  type="text"
                  value={job.description}
                  onChange={(e) =>
                    handleChange(e, "openings", index, "description")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Short JD..."
                />
              </div>

              {formData.openings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOpening(index)}
                  className="md:mt-6 text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-3 py-2 rounded-md"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            aria-hidden="true"
            disabled={loading}
            className="bg-[#1d4ed8] hover:bg-[#1e40af] text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Saving Client..." : "Save Complete Client Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

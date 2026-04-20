"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import BasicDetailsForm from "@/components/add-client/BasicDetailsForm";
import PayoutCommercialsForm from "@/components/add-client/PayoutCommercialsForm";
import ContactPersonsForm from "@/components/add-client/ContactPersonsForm";
import OpeningsForm from "@/components/add-client/OpeningsForm";

export default function AddClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    payoutDetails: {
      commercials: [{ category: "", slabs: [{ slabDetails: "" }] }],
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

  const handleChange = (e, section, index, field) => {
    if (section === "basic") {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else if (section === "payout-basic") {
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
        router.push("/dashboard/admin");
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
        <BasicDetailsForm formData={formData} handleChange={handleChange} />

        <PayoutCommercialsForm
          formData={formData}
          handleChange={handleChange}
          addCommercialCategory={addCommercialCategory}
          removeCommercialCategory={removeCommercialCategory}
          handleCategoryChange={handleCategoryChange}
          addSlab={addSlab}
          removeSlab={removeSlab}
          handleSlabChange={handleSlabChange}
        />

        <ContactPersonsForm
          formData={formData}
          handleChange={handleChange}
          addContactPerson={addContactPerson}
          removeContactPerson={removeContactPerson}
        />

        <OpeningsForm
          formData={formData}
          handleChange={handleChange}
          addOpening={addOpening}
          removeOpening={removeOpening}
        />

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

// src/app/dashboard/admin/edit-client/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// Reuse the exact same components from Add Client!
import BasicDetailsForm from "@/components/add-client/BasicDetailsForm";
import PayoutCommercialsForm from "@/components/add-client/PayoutCommercialsForm";
import ContactPersonsForm from "@/components/add-client/ContactPersonsForm";
import OpeningsForm from "@/components/add-client/OpeningsForm";

export default function EditClientPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Initial empty state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    companyType: "BPO",
    natureOfBusiness: "",
    description: "",
    internalRemark: "",
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

  // Fetch existing data on page load
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/companies/${id}`);
        if (response.data.success) {
          const data = response.data.data;

          // Safety Check: Format dates properly for input type="date"
          if (data.openings && data.openings.length > 0) {
            data.openings = data.openings.map((job) => ({
              ...job,
              expiryDate: job.expiryDate
                ? new Date(job.expiryDate).toISOString().split("T")[0]
                : "",
            }));
          }

          // Safety Check: If arrays are completely empty, provide at least one empty row so form doesn't break
          if (
            !data.payoutDetails.commercials ||
            data.payoutDetails.commercials.length === 0
          ) {
            data.payoutDetails.commercials = [
              { category: "", slabs: [{ slabDetails: "" }] },
            ];
          }
          if (!data.contactPersons || data.contactPersons.length === 0) {
            data.contactPersons = [
              { name: "", designation: "", phone: "", email: "" },
            ];
          }
          if (!data.openings || data.openings.length === 0) {
            data.openings = [
              {
                title: "",
                experience: "",
                salary: "",
                vacancies: "",
                expiryDate: "",
                description: "",
              },
            ];
          }

          setFormData(data);
        }
      } catch (error) {
        toast.error("Failed to load company data.");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchCompanyData();
  }, [id]);

  // ALL HANDLERS (Same as Add Client)
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

  // NAYA: PUT request for update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`/api/companies/${id}`, formData);
      if (res.data.success) {
        toast.success("Client Updated Successfully!");
        // Redirect back to company details page
        router.push(`/dashboard/admin/company/${id}`);
      }
    } catch (error) {
      toast.error("Failed to update client.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-10 text-center font-bold text-[#092a49] mt-20">
        Loading Client Data...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#092a49]">
            Edit Client Profile
          </h1>
          <p className="text-gray-500 mt-1">
            Update details for {formData.name}
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
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Updating..." : "Update Client Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}

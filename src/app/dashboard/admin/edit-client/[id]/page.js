// src/app/dashboard/admin/edit-client/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// 🚀 FIX: Removed the outdated PayoutCommercialsForm
import BasicDetailsForm from "@/components/add-client/BasicDetailsForm";
import ContactPersonsForm from "@/components/add-client/ContactPersonsForm";
import OpeningsForm from "@/components/add-client/OpeningsForm";

export default function EditClientPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Initial clean state (Updated for new Payout structure)
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
        payoutType: "Flat Amount",
        flatAmount: "",
        percentageValue: "",
        slabs: [],
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

          // Safety Check: General Terms fallback
          if (!data.payoutDetails) {
            data.payoutDetails = {
              payoutDuration: "",
              replacementTime: "",
              paymentTerms: "",
            };
          }

          // Safety Check: Contacts fallback
          if (!data.contactPersons || data.contactPersons.length === 0) {
            data.contactPersons = [
              { name: "", designation: "", phone: "", email: "" },
            ];
          }

          // Safety Check: Openings fallback (with new payout fields)
          if (!data.openings || data.openings.length === 0) {
            data.openings = [
              {
                title: "",
                experience: "",
                salary: "",
                vacancies: "",
                expiryDate: "",
                description: "",
                payoutType: "Flat Amount",
                flatAmount: "",
                percentageValue: "",
                slabs: [],
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

  // Main input handler
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

  // Updated addOpening with new payout fields
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
          payoutType: "Flat Amount",
          flatAmount: "",
          percentageValue: "",
          slabs: [],
        },
      ],
    });

  const removeOpening = (index) =>
    setFormData({
      ...formData,
      openings: formData.openings.filter((_, i) => i !== index),
    });

  // PUT request for update
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
          type="button"
          onClick={() => router.back()}
          className="text-gray-500 hover:text-[#1d4ed8] font-medium text-sm transition-colors"
        >
          Cancel & Go Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <BasicDetailsForm formData={formData} handleChange={handleChange} />

        {/* Contact Persons */}
        <ContactPersonsForm
          formData={formData}
          handleChange={handleChange}
          addContactPerson={addContactPerson}
          removeContactPerson={removeContactPerson}
        />

        {/* 🚀 Openings Form (Now includes Slab and Payout logic internally) */}
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

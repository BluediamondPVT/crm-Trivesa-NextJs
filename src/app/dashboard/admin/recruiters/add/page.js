"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// Components Import
import PersonalDetailsForm from "@/components/employee/add/PersonalDetailsForm";
import ProfessionalDetailsForm from "@/components/employee/add/ProfessionalDetailsForm";
import InterviewDetailsForm from "@/components/employee/add/InterviewDetailsForm";
import SubmitButtons from "@/components/employee/add/SubmitButtons";

export default function AddEmployeePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [activeCompanies, setActiveCompanies] = useState([]);
  const [availableOpenings, setAvailableOpenings] = useState([]);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    qualification: "",
    specialization: "",
    expertise: "", // NAYE FIELDS
    experience: "",
    lastSalary: "",
    expectedSalary: "",
    assignedCompanyId: "",
    assignedCompanyName: "",
    assignedProcess: "",
    interviewDate: "",
    status: "LineUp",
  });

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
          className="text-gray-500 hover:text-[#1d4ed8] font-medium text-sm transition-colors cursor-pointer"
        >
          Cancel & Go Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <PersonalDetailsForm formData={formData} handleChange={handleChange} />
        <ProfessionalDetailsForm
          formData={formData}
          handleChange={handleChange}
        />

        <InterviewDetailsForm
          formData={formData}
          handleChange={handleChange}
          activeCompanies={activeCompanies}
          handleCompanyChange={handleCompanyChange}
          availableOpenings={availableOpenings}
          isStatusOpen={isStatusOpen}
          setIsStatusOpen={setIsStatusOpen}
        />

        <SubmitButtons loading={loading} />
      </form>
    </div>
  );
}

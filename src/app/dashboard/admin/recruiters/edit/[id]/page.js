"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// Reusable Components Import
import PersonalDetailsForm from "@/components/employee/add/PersonalDetailsForm";
import ProfessionalDetailsForm from "@/components/employee/add/ProfessionalDetailsForm";
import EditInterviewDetailsForm from "@/components/employee/add/EditInterviewDetailsForm";
import SubmitButtons from "@/components/employee/add/SubmitButtons";

export default function EditEmployeePage() {
  const router = useRouter();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const [activeCompanies, setActiveCompanies] = useState([]);
  const [availableOpenings, setAvailableOpenings] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    age: "",
    qualification: "",
    specialization: "",
    expertise: "", 
    experience: "",
    lastSalary: "",
    expectedSalary: "",
    source: "",
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
        {/* Reusing Components from Add Page! */}
        <PersonalDetailsForm formData={formData} handleChange={handleChange} />
        <ProfessionalDetailsForm
          formData={formData}
          handleChange={handleChange}
        />

        {/* Using Special Edit Component */}
        <EditInterviewDetailsForm
          formData={formData}
          handleChange={handleChange}
          activeCompanies={activeCompanies}
          handleCompanyChange={handleCompanyChange}
          availableOpenings={availableOpenings}
          isStatusOpen={isStatusOpen}
          setIsStatusOpen={setIsStatusOpen}
        />

        {/* Reusing Submit Button */}
        <SubmitButtons loading={loading} />
      </form>
    </div>
  );
}

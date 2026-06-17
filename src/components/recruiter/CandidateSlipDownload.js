"use client";

import { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import axios from "axios"; // 🚀 NAYA: Axios import kiya API call ke liye

export default function CandidateSlipDownload({ candidate }) {
  const slipRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [companyAddress, setCompanyAddress] = useState("Fetching address..."); // 🚀 NAYA STATE

  // 🚀 NAYA LOGIC: Candidate jis company mein assigned hai, uska address fetch karo
  useEffect(() => {
    const fetchCompanyAddress = async () => {
      if (!candidate?.assignedCompanyId) {
        setCompanyAddress("No Company Assigned");
        return;
      }
      try {
        const res = await axios.get("/api/companies");
        if (res.data?.success) {
          const matchedCompany = res.data.data.find(
            (c) => String(c._id) === String(candidate.assignedCompanyId)
          );
          setCompanyAddress(matchedCompany?.address || "Address not added in CRM");
        } else {
          setCompanyAddress("N/A");
        }
      } catch (error) {
        console.error("Error fetching company address:", error);
        setCompanyAddress("N/A");
      }
    };

    fetchCompanyAddress();
  }, [candidate]);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const element = slipRef.current;
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const link = document.createElement("a");
      const fileName = `${candidate?.name?.replace(/\s+/g, "_") || "Candidate"}_Recruitment_Record.png`;
      
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Slip Generation Failed:", error);
      alert("Failed to generate the image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedDate = candidate?.createdAt 
    ? new Date(candidate.createdAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      })
    : "N/A";

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="bg-[#092a49] hover:bg-blue-900 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {isGenerating ? "Generating Slip..." : "Download Candidate Details"}
      </button>

      {/* HIDDEN SLIP TEMPLATE */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        <div
          ref={slipRef}
          style={{ width: "750px" }}
          className="bg-white p-12 flex flex-col font-sans border border-gray-100"
        >
          {/* Logo Header */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <h1 className="text-4xl font-black tracking-tight text-[#0066cc] m-0">
              Trivesa<span className="text-xs font-normal align-super text-gray-400">TM</span>
            </h1>
            <p className="text-[9px] font-extrabold tracking-[0.25em] text-gray-500 uppercase m-0 mt-0.5">
              HR Inspired Partnerships
            </p>
            <p className="text-[10px] font-black tracking-wider text-[#092a49] uppercase m-0 mt-1">
              Trivesa HR Consultant Pvt. Ltd.
            </p>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#0066cc] tracking-wide">
              Recruitment Record
            </h2>
          </div>

          {/* Table */}
          <div className="flex flex-col border border-gray-100 rounded-lg overflow-hidden text-sm mb-8">
            <div className="flex items-center px-6 py-4">
              <div className="w-1/3 font-bold text-[#0066cc]">Hiring Partner</div>
              <div className="w-2/3 text-gray-800">{candidate?.source || "-"}</div>
            </div>

            <div className="flex items-center px-6 py-4 bg-[#f0f7ff]">
              <div className="w-1/3 font-bold text-[#0066cc]">Candidate Name</div>
              <div className="w-2/3 text-gray-800 font-medium">{candidate?.name || "-"}</div>
            </div>

            <div className="flex items-center px-6 py-4">
              <div className="w-1/3 font-bold text-[#0066cc]">Phone</div>
              <div className="w-2/3 text-gray-800">{candidate?.phone || "-"}</div>
            </div>

            <div className="flex items-center px-6 py-4 bg-[#f0f7ff]">
              <div className="w-1/3 font-bold text-[#0066cc]">Email</div>
              <div className="w-2/3 text-gray-800">{candidate?.email || "-"}</div>
            </div>

            <div className="flex items-center px-6 py-4">
              <div className="w-1/3 font-bold text-[#0066cc]">Company</div>
              <div className="w-2/3 text-gray-800">{candidate?.assignedCompanyName || "-"}</div>
            </div>

            {/* 🚀 YAHAN COMPANY KA ADDRESS RENDER HOGA */}
            <div className="flex items-center px-6 py-4 bg-[#f0f7ff]">
              <div className="w-1/3 font-bold text-[#0066cc]">Address</div>
              <div className="w-2/3 text-gray-800">{companyAddress}</div>
            </div>

            <div className="flex items-center px-6 py-4">
              <div className="w-1/3 font-bold text-[#0066cc]">Date & Time</div>
              <div className="w-2/3 text-gray-800">{formattedDate}</div>
            </div>

            <div className="flex items-center px-6 py-4 bg-[#f0f7ff]">
              <div className="w-1/3 font-bold text-[#0066cc]">Trivesa Recruiter</div>
              <div className="w-2/3 text-gray-800">
                {candidate?.addedBy?.email ? candidate.addedBy.email.split("@")[0] : "System"}
              </div>
            </div>

            <div className="flex items-center px-6 py-4">
              <div className="w-1/3 font-bold text-[#0066cc]">Meet HR</div>
              <div className="w-2/3 text-gray-800">
                {candidate?.addedBy?.name || "HR Team"}
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 my-4"></div>

          <div className="text-[11px] leading-relaxed text-gray-600 text-justify px-2">
            <span className="font-bold text-gray-800">Note:</span> We act solely as a recruitment facilitator between candidates and clients. While we work with reputed clients, we are not responsible for any acts, omissions, representations, or consequences arising from interactions between candidates and clients before, during, or after the interview process.
          </div>
        </div>
      </div>
    </div>
  );
}
// src/components/recruiter/PayoutBadge.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PayoutBadge({ emp }) {
  const [payout, setPayout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculatePayout = async () => {
      if (!emp.assignedCompanyId || !emp.assignedProcess) {
        setLoading(false);
        return;
      }

      try {
        const compRes = await axios.get(
          `/api/companies/${emp.assignedCompanyId}`,
        );

        if (compRes.data.success) {
          const company = compRes.data.data;

          const candidateProcess = String(emp.assignedProcess)
            .toLowerCase()
            .trim();
          const opening = company.openings?.find(
            (o) => String(o.title).toLowerCase().trim() === candidateProcess,
          );

          if (opening) {
            let amount = 0;
            let type = opening.payoutType || "Flat Amount";

            // 🟢 LOGIC 1: FLAT AMOUNT
            if (type === "Flat Amount") {
              amount = opening.flatAmount || 0;
            }
            // 🟢 LOGIC 2: PERCENTAGE (ANNUAL CTC LOGIC)
            else if (type === "Percentage") {
              const rawStr = String(emp.actualSalary || "0")
                .toLowerCase()
                .trim();
              let actual = parseFloat(rawStr.replace(/[^0-9.]/g, "")) || 0;
              let isAnnual = false;

              if (
                rawStr.includes("l") ||
                rawStr.includes("lac") ||
                rawStr.includes("lpa") ||
                rawStr.includes("pa")
              ) {
                actual = actual * 100000;
                isAnnual = true;
              } else if (rawStr.includes("k")) {
                actual = actual * 1000;
                isAnnual = false;
              } else if (actual > 0 && actual < 100) {
                actual = actual * 100000;
                isAnnual = true;
              } else if (actual > 150000) {
                isAnnual = true;
              }

              const annualCTC = isAnnual ? actual : actual * 12;
              const percent = Number(opening.percentageValue) || 0;

              amount = Math.round((annualCTC * percent) / 100);
            }
            // 🟢 LOGIC 3: SLAB WISE (RETROACTIVE)
            else if (type === "Slab Wise") {
              const empRes = await axios.get("/api/employees");
              if (empRes.data.success) {
                const allEmps = empRes.data.data;

                const joinedEmps = allEmps.filter(
                  (e) =>
                    e.assignedCompanyId === emp.assignedCompanyId &&
                    String(e.assignedProcess).toLowerCase().trim() ===
                      candidateProcess &&
                    (e.status === "Joining" || e.status === "Payout"),
                );

                let totalJoinedCount = joinedEmps.length;
                if (totalJoinedCount === 0) totalJoinedCount = 1;

                let matchedSlab = opening.slabs?.find(
                  (s) =>
                    totalJoinedCount >= s.minJoinees &&
                    totalJoinedCount <= s.maxJoinees,
                );

                if (!matchedSlab && opening.slabs?.length > 0) {
                  matchedSlab = opening.slabs.reduce((prev, current) =>
                    prev.maxJoinees > current.maxJoinees ? prev : current,
                  );
                }

                if (matchedSlab) {
                  amount = matchedSlab.amount;
                }
              }
            }

            setPayout({ amount, type });
          }
        }
      } catch (error) {
        console.error("Error calculating payout:", error);
      } finally {
        setLoading(false);
      }
    };

    calculatePayout();
  }, [emp]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-[10px] text-gray-400 font-medium">Calc...</span>
      </div>
    );
  }

  if (!payout || payout.amount === 0) {
    return <span className="text-xs text-gray-400 italic">No Payout</span>;
  }

  // 🚀 PREMIUM DESIGN FOR SEPARATE COLUMN
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-100 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4 text-purple-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <span className="text-sm font-black text-purple-700 tracking-tight">
          ₹{payout.amount}
        </span>
      </div>
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider pl-1">
        {payout.type}
      </span>
    </div>
  );
}

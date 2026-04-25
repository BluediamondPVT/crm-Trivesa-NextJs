"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. LocalStorage se role nikal
    const userRole = localStorage.getItem("role");

    // 2. Agar login hi nahi hai, toh login pe bhej do
    if (!userRole) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    // 3. Agar user ka role allowed list mein NAHI hai
    if (!allowedRoles.includes(userRole)) {
      toast.error("Access Denied! You don't have permission for this page.");

      // User ko uske apni aukaat (dashboard) pe bhej do 😂
      if (userRole === "recruiter") {
        router.push("/dashboard/recruiter");
      } else {
        router.push("/dashboard/admin");
      }
    } else {
      // 4. Sab sahi hai, toh page dikhao
      setIsAuthorized(true);
    }
  }, [router, allowedRoles]);

  // Jab tak check ho raha hai, tab tak kuch mat dikhao (Blank screen ya loader)
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Agar authorized hai, toh actual page dikha do
  return <>{children}</>;
}

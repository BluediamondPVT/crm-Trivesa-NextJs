// src/app/page.js
import { redirect } from "next/navigation";

export default function Home() {
  // Koi direct main website pe aaye toh usko login pe dhakel do
  redirect("/login");
}
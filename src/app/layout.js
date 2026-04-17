import { Outfit } from "next/font/google";
import "./globals.css";

// 1. Import and configure Outfit
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans", // Maps Outfit to your Tailwind/Shadcn sans font
});

export const metadata = {
  title: "Trivesa CRM",
  description: "Manage your HR consultancy with powerful tools designed for growth.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
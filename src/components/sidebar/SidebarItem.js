// src/components/sidebar/SidebarItem.js
import Link from "next/link";
import { motion } from "framer-motion";

export default function SidebarItem({
  href,
  isActive,
  onClick,
  icon,
  label,
  customBorder = "border-[#1d4ed8]",
}) {
  const navItemVariants = {
    idle: { x: 0 },
    hover: { x: 4, transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <Link href={href} onClick={onClick} className="block">
      <motion.div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer ${
          isActive
            ? `bg-white/10 text-white border-l-4 ${customBorder}`
            : "text-gray-300 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
        }`}
        variants={navItemVariants}
        whileHover="hover"
      >
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </motion.div>
    </Link>
  );
}

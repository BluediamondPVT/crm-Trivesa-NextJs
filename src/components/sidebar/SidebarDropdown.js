import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function SidebarDropdown({
  label,
  icon,
  isOpen,
  toggleOpen,
  isActive,
  subItems,
  onSubItemClick,
}) {
  const navItemVariants = {
    idle: { x: 0 },
    hover: { x: 4, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const subMenuVariants = {
    closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
    open: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div>
      <motion.button
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border-l-4 ${
          isOpen || isActive
            ? "border-[#1d4ed8] bg-white/5 text-white"
            : "border-transparent hover:bg-white/5 text-gray-300 hover:text-white"
        }`}
        variants={navItemVariants}
        whileHover="hover"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={subMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden ml-6 mt-1 space-y-1 border-l border-white/10"
          >
            {subItems.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.href}
                onClick={onSubItemClick}
                className="block"
              >
                {/* NAYA FIX: Yahan ab hum 'sub.isActive' check kar rahe hain */}
                <motion.div
                  className={`flex items-center gap-3 px-6 py-2 text-sm font-medium hover:text-white hover:bg-white/5 rounded-r-lg transition-all ${sub.isActive ? "text-white bg-white/5" : "text-gray-400"}`}
                  whileHover={{ x: 5 }}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sub.color}`} />
                  {sub.name}
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

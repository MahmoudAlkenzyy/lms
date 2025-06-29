"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaHome, FaUser, FaCog, FaBell, FaEnvelope, FaChartBar, FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const menuItems = [
    { icon: <FaHome size={20} />, label: "الرئيسية" },
    { icon: <FaUser size={20} />, label: "الملف الشخصي" },
    { icon: <FaEnvelope size={20} />, label: "الرسائل" },
    { icon: <FaBell size={20} />, label: "الإشعارات" },
    { icon: <FaChartBar size={20} />, label: "التقارير" },
    { icon: <FaCog size={20} />, label: "الإعدادات" },
  ];

  return (
    <motion.div
      className="h-screen "
      initial={{ width: 80 }}
      animate={{ width: collapsed ? 80 : 250 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <motion.div className="h-full bg-black rounded-rb-lg flex flex-col">
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Image src="/images/logo.png" alt="Logo" width={60} height={60} />
              </motion.div>
            )}
          </AnimatePresence>

          <Image src={"/images/logo.png"} alt="logo" width={100} height={40} />
        </div>

        {/* Menu items */}
        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map(({ icon, label }, i) => (
            <motion.button
              key={i}
              className={`flex items-center w-full p-4 duration-75 text-white hover:bg-gray-800  transition-colors ${
                collapsed ? "justify-center" : "px-6"
              }`}
              whileHover={{ backgroundColor: "#222" }}
            >
              <span>{icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    className="mr-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;

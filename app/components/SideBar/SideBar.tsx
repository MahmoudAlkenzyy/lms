// components/Sidebar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiSettings,
  FiPieChart,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: <FiHome className="w-5 h-5" />, label: "Home", path: "/" },
    { icon: <FiUser className="w-5 h-5" />, label: "Profile", path: "/profile" },
    { icon: <FiPieChart className="w-5 h-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <FiSettings className="w-5 h-5" />, label: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    const activePath = menuItems.find((item) => pathname?.startsWith(item.path))?.path || "";
    setActiveItem(activePath);
  }, [pathname]);

  const [activeItem, setActiveItem] = useState("");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleNavigation = (path: string) => {
    setActiveItem(path);
    router.push(path);
  };

  return (
    <motion.div
      className={`h-screen relative  left-0 top-0 z-40 bg-black text-white ${collapsed ? "w-20" : "w-64"}`}
      initial={{ width: 80 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {/* <div className="flex items-center justify-between p-4 border-b border-gray-800"> */}
        <motion.div
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
        >
          <Image src="/images/logo.png" alt="logo" width={40} height={40} className="rounded-md" />
        </motion.div>
      </div>

      <div className="p-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center p-3 rounded-lg cursor-pointer mb-1 ${
              activeItem === item.path ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
            onClick={() => handleNavigation(item.path)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="ml-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-4">
        <motion.div
          className={`flex items-center p-3 rounded-lg cursor-pointer ${
            activeItem === "/logout" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
          onClick={() => handleNavigation("/logout")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiLogOut className="w-5 h-5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="ml-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;

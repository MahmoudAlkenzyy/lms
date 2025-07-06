"use client";
import { AnimatePresence } from "motion/react";
import Image from "next/image";
import React, { useState } from "react";
import { FaRegBell, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  console.log({ pathname });

  return (
    <div
      className={`flex justify-between ${
        pathname == "/Courses" ? "bg-[#faf7ff] text-black" : "bg-black text-white sticky top-0 h-[70] z-30"
      }  py-3`}
    >
      <div className="">
        {/* <div className="relative w-full max-w-md ">
          <FaSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="search..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div> */}
      </div>
      <div className="flex gap-4 items-center pe-4">
        <p className="p-2 bg-[#C1BBE9] text-[#7337FFA1] w-8 h-8 rounded flex justify-center items-center">
          <FaRegBell />
        </p>
        <Image
          src={"/images/profile.jpg"}
          className="w-10 h-10 rounded-xl"
          alt="profile-picture"
          height={70}
          width={70}
        />
        <div className="">
          <p className="">Name</p>
          <p className={`${pathname == "/Courses" ? "text-[#0000008a]" : "text-white"} font-light  text-sm`}>Role</p>
        </div>
      </div>
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Profile</button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Settings</button>
              <hr className="my-1" />
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">Sign out</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavBar;

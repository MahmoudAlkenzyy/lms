"use client";
import { motion } from "framer-motion";

const Textarea = ({ placeholder, id, className = "", ...props }: any) => {
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      whileFocus={{ scale: 1.01 }}
      className={`flex flex-col bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden ${className}`}
    >
      <textarea
        id={id}
        placeholder={placeholder}
        rows={4}
        {...props}
        className="w-full px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
      />
      <div className="h-px bg-gray-200 w-full"></div>
    </motion.div>
  );
};

export default Textarea;

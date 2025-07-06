"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  courseName?: string; //   new prop
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Course",
  message = "Are you sure you want to delete this course? This action cannot be undone.",
  courseName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="bg-[#7337FF26] text-[#7337FF] flex justify-center rounded-lg items-center p-4 mb-4">
              <h2 className="text-lg font-semibold">{title}</h2>
            </div>

            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete <span className="font-semibold text-black">"{courseName}" </span>? <br />{" "}
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                type="button"
                className="px-6 py-1 text-sm text-white bg-black border border-white rounded transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;

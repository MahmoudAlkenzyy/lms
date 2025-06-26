"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface SectionFormInputs {
  sectionName: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  refetch: () => void;
}

const AddSectionModal: React.FC<Props> = ({ isOpen, setIsOpen, id, refetch }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionFormInputs>();

  const onSubmit = async (data: SectionFormInputs) => {
    const formData = new FormData();
    formData.append("CourseId", id);
    formData.append("Name", data.sectionName);
    formData.append("Description", data.description);
    formData.append("Order", "0");

    try {
      const response = await fetch("https://localhost:7022/api/Chapters/CreateChapter", {
        method: "POST",
        headers: {
          Authorization: "Bearer your_token_here", // Replace with real token
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Something went wrong");

      toast.success("✅ Section added successfully!");
      reset();
      setIsOpen(false);
      refetch(); // ⬅️ Refetch chapters after adding
    } catch (err) {
      toast.error("❌ Error adding section");
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#0005] bg-opacity-40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-md w-full max-w-md"
            initial={{ scale: 0.8, opacity: 0, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-[#7337FF26] text-[#7337FF] flex justify-center rounded-lg items-center p-4  mb-4">
              <h2 className="text-lg font-semibold  ">Add New Section</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input
                  type="text"
                  {...register("sectionName", { required: "Section name is required" })}
                  placeholder="Enter section name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                {errors.sectionName && <p className="text-red-500 text-sm mt-1">{errors.sectionName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  {...register("description", { required: "Description is required" })}
                  placeholder="Write description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700">
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSectionModal;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Backend_Url, Fake_Token } from "../../../constants";
import { FiLoader } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  refetch: () => void;
  mode?: "add" | "update";
  sectionId?: string;
  initialData?: {
    name: string;
    description: string;
  };
}

const AddSectionModal: React.FC<Props> = ({ isOpen, setIsOpen, id, refetch, mode = "add", sectionId, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormContext();

  const wasOpen = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      if (mode === "update" && initialData) {
        reset({
          sectionName: initialData.name,
          description: initialData.description,
        });
      } else if (mode === "add") {
        reset({
          sectionName: "",
          description: "",
        });
      }
    }
    wasOpen.current = isOpen;
  }, [isOpen, mode, initialData, reset]);

  const onValid = async (data: any) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("Name", data.sectionName);
    formData.append("Description", data.description);
    formData.append("Order", "0");

    const isUpdate = mode === "update";
    const endpoint = isUpdate ? `${Backend_Url}/Chapters/UpdateChapter` : `${Backend_Url}/Chapters/CreateChapter`;

    if (isUpdate && sectionId) {
      formData.append("Id", sectionId);
    }
    formData.append("CourseId", id);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: Fake_Token,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Something went wrong");

      toast.success(isUpdate ? "Section updated successfully!" : "Section added successfully!");
      setIsOpen(false);
      refetch();
    } catch (err) {
      toast.error(isUpdate ? "Error updating section" : "Error adding section");
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-[#7337FF26] text-[#7337FF] flex justify-center rounded-lg items-center p-4 mb-4">
              <h2 className="text-lg font-semibold">{mode === "update" ? "Update Section" : "Add New Section"}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                <input
                  type="text"
                  {...register("sectionName", { required: "Section name is required" })}
                  placeholder="Enter section name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                {errors.sectionName && (
                  <p className="text-red-500 text-sm mt-1">{errors.sectionName.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  {...register("description", { required: "Description is required" })}
                  placeholder="Write description..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-1 text-sm text-white bg-black rounded"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onValid)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 disabled:bg-violet-400 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" size={16} />
                      {mode === "update" ? "Updating..." : "Submitting..."}
                    </>
                  ) : (
                    <>{mode === "update" ? "Update" : "Submit"}</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSectionModal;

"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Backend_Url, Fake_Token } from "@/constants";
import { toast } from "react-toastify";
import { FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  type: "Attachment" | "Video";
  duration: number;
};

const AddLessonModal = ({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: () => void;
}) => {
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterid");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      type: "Attachment",
      duration: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const convertMinutesToHHMMSS = (minutes: number): string => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    const secs = 0;

    const pad = (num: number) => String(num).padStart(2, "0");

    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };
  const onSubmit = async (data: FormData) => {
    if (!chapterId) {
      toast.error("Chapter ID not found in URL.");
      return;
    }

    const formattedDuration = convertMinutesToHHMMSS(data.duration);

    try {
      const res = await fetch(`${Backend_Url}/Lessons/CreateLesson`, {
        method: "POST",
        headers: {
          Authorization: Fake_Token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ChapterId: chapterId,
          Name: data.title,
          order: "1",
          Type: data.type,
          Duration: formattedDuration,
        }),
      });

      if (!res.ok) throw new Error("Something went wrong");

      toast.success("Lesson created successfully!");
      setIsOpen(false);
      refetch?.();
      reset();
    } catch (err) {
      toast.error("Failed to create lesson");
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#0005] flex items-center justify-center p-4 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-md"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h2 className="text-xl font-semibold mb-4 bg-[#7337FF26] p-3 text-center text-[#7337FF]">Add new lesson</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#7337FF]">Lesson title</label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter lesson title"
                  className={`w-full px-3 py-2 border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#7337FF] focus:border-[#7337FF]`}
                />
                {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1 text-[#7337FF]">Lesson type</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {watch("type") === "Video" ? <FaRegPlayCircle /> : <FaRegFileAlt />}
                  </div>
                  <select
                    {...register("type", { required: "Type is required" })}
                    className={`w-full appearance-none pl-10 pr-4 py-2 border ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7337FF] focus:border-[#7337FF] text-sm`}
                  >
                    <option value="Attachment">Attachment</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-[#7337FF]">Duration (minutes)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    {...register("duration", {
                      required: "Duration is required",
                      min: { value: 1, message: "Must be at least 1 minute" },
                    })}
                    className={`w-full px-3 py-2 pr-12 border ${
                      errors.duration ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#7337FF] focus:border-[#7337FF]`}
                    placeholder="Enter duration"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">min</span>
                </div>
                {errors.duration && <p className="text-xs text-red-600 mt-1">{errors.duration.message}</p>}
              </div>

              {/* Buttons */}
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
                  type="submit"
                  className="px-4 py-2 bg-[#7337FF] text-white rounded hover:bg-[#5c2de0]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddLessonModal;

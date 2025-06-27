"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Backend_Url, Fake_Token } from "@/constants";
import { toast } from "react-toastify";
import { FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";

const AddLessonModal = ({
  isOpen,
  setIsOpen,
  refetch,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: () => void;
}) => {
  const [lessonTitle, setLessonTitle] = useState("");
  //   const [lessonDuration, setLessonDuration] = useState("");
  //   const [lessonIntro, setLessonIntro] = useState("");
  const [lessonType, setLessonType] = useState("Attachment");

  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterid");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chapterId) {
      toast.error("❌ Chapter ID not found in URL.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("ChapterId", chapterId);
    formData.append("Name", lessonTitle);
    // formData.append("Intro", lessonIntro || "No intro");
    formData.append("Order", "1");
    formData.append("Type", lessonType);
    // formData.append("Duration", lessonDuration);

    try {
      const res = await fetch(`${Backend_Url}/Lessons/CreateLesson`, {
        method: "POST",
        headers: {
          Authorization: Fake_Token,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Something went wrong");

      toast.success("Lesson created successfully!");
      setIsOpen(false);
      refetch?.();
      setLessonTitle("");
      setLessonType("Attachment");
      //   setLessonIntro("");
      //   setLessonDuration("");
    } catch (err) {
      toast.error("❌ Failed to create lesson");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#0005] bg-opacity-50 flex items-center justify-center p-4 z-[100]"
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
            <h2 className="text-xl font-semibold mb-4 text-[#7337FF]">Add New Lesson</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lesson Title</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Enter lesson title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7337FF] focus:border-[#7337FF] transition duration-200 text-sm"
                />
              </div>
              <div className="relative w-full">
                {/* Icon Positioned Inside */}
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {lessonType === "Attachment" && <FaRegFileAlt />}
                  {lessonType === "Video" && <FaRegPlayCircle />}
                </div>

                {/* Select Field */}
                <select
                  value={lessonType}
                  onChange={(e) => setLessonType(e.target.value)}
                  className="w-full appearance-none pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7337FF] focus:border-[#7337FF] text-sm bg-white"
                >
                  <option value="Attachment">Attachment</option>
                  <option value="Video">Video</option>
                </select>
              </div>
              {/* <div>
                <label className="block text-sm font-medium mb-1">Intro</label>
                <textarea
                  rows={3}
                  placeholder="Intro text..."
                  value={lessonIntro}
                  onChange={(e) => setLessonIntro(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7337FF] focus:border-[#7337FF] transition duration-200 resize-none text-sm"
                />
              </div> */}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-1 text-sm text-white bg-black border border-white rounded  transition-colors duration-200 cursor-pointer"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7337FF] text-white rounded hover:bg-[#5c2de0]"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Submit"}
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

"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Backend_Url, Fake_Token } from "@/constants";
import { FaRegPlayCircle, FaRegFileAlt } from "react-icons/fa"; // أيقونات الفيديو والملفات

interface Lesson {
  id: string;
  name: string;
  lessonType: string;
  duration?: number;
}

interface Chapter {
  id: string;
  name: string;
  description: string;
  lessons: Lesson[];
}

const CurriculumBar = ({
  courseId,
  onLessonClick,
}: {
  courseId: string;
  onLessonClick: (lessonId: string) => void;
}) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`${Backend_Url}/Chapters/GetChapters`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({ courseId }),
        });

        const data = await response.json();
        if (data.isSuccess) {
          setChapters(data.chapters.items);
        } else {
          console.error("❌ Error loading chapters:", data.errors);
        }
      } catch (error) {
        console.error("❌ Fetch failed:", error);
      }
    };

    fetchChapters();
  }, [courseId]);

  const toggleChapter = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-4 p-5 bg-white border shadow-lg rounded-xl border-[#E5E7EB] min-h-screen">
      <h2 className="font-bold text-xl text-gray-800 mb-2"> Curriculum</h2>
      <div className="w-full border-b border-gray-200 mb-2" />

      {chapters.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">🚫 No chapters found.</div>
      ) : (
        chapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="border border-gray-200 rounded-md overflow-hidden shadow-sm"
          >
            <div
              onClick={() => toggleChapter(chapter.id)}
              className="cursor-pointer px-4 py-3  flex justify-between items-center hover:bg-gray-200 transition-colors"
            >
              <h3 className="font-medium text-gray-700">{chapter.name}</h3>
              {expandedChapterId === chapter.id ? (
                <FaChevronUp className="text-gray-600" />
              ) : (
                <FaChevronDown className="text-gray-600" />
              )}
            </div>

            <AnimatePresence initial={false}>
              {expandedChapterId === chapter.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-3 p-4 bg-white">
                    {chapter.lessons.map((lesson) => {
                      return (
                        <motion.div
                          key={lesson.id}
                          onClick={() => onLessonClick(lesson.id)}
                          //   whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-between gap-4 p-3  hover:bg-violet-50 cursor-pointer rounded-lg transition-all"
                        >
                          {/* Left side: icon + name */}
                          <div className="flex items-center gap-2 text-gray-800">
                            <FaRegFileAlt className="text-blue-500 text-lg" />

                            <span className="font-medium text-sm">{lesson.name}</span>
                          </div>

                          {/* Right side: duration */}
                          <span className="text-xs text-gray-500">{lesson.duration ?? "N/A"} min</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default CurriculumBar;

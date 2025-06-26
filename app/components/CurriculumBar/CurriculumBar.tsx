"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Backend_Url } from "@/constants";

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

const CurriculumBar = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);

  const courseId = "3af7cd08-04fd-491b-9503-c7cc47ef1a9c"; // replace with dynamic courseId if needed

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`${Backend_Url}/Chapters/GetChapters`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer Fake_Token", // Replace with actual token
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
  }, []);

  const toggleChapter = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border shadow rounded-xl border-[#00000029] min-h-screen">
      <h2 className="font-semibold text-lg my-3">Curriculum</h2>
      <div className="w-full border-b border-[#00000029]"></div>

      {chapters.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">You don’t have any chapters yet.</div>
      ) : (
        chapters.map((chapter) => (
          <div key={chapter.id} className="border border-[#00000029] rounded-md overflow-hidden">
            {/* Chapter Header */}
            <div
              onClick={() => toggleChapter(chapter.id)}
              className="cursor-pointer px-4 py-3 bg-[#F9F9F9] flex justify-between items-center"
            >
              <h3 className="font-medium">{chapter.name}</h3>
              {expandedChapterId === chapter.id ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {/* Chapter Body */}
            <AnimatePresence initial={false}>
              {expandedChapterId === chapter.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 p-4 bg-white">
                    {chapter.lessons.length === 0 ? (
                      <p className="text-sm text-gray-500">No lessons in this chapter yet.</p>
                    ) : (
                      chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson.id)}
                          className={`p-2 rounded cursor-pointer border ${
                            currentLesson === lesson.id
                              ? "bg-[#7337FF1A] border-[#7337FF]"
                              : "bg-[#F8F8F8] border-[#ddd]"
                          }`}
                        >
                          <div className="font-semibold">{lesson.name}</div>
                          <div className="text-sm text-gray-600 flex justify-between">
                            <span>Type: {lesson.lessonType}</span>
                            <span>Duration: {lesson.duration ?? "N/A"} min</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}
    </div>
  );
};

export default CurriculumBar;

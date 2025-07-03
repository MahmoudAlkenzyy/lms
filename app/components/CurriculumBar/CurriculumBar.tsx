"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Backend_Url, Fake_Token } from "@/constants";
import { ChevronDownIcon, ChevronUpIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import * as Tooltip from "@radix-ui/react-tooltip";
import { FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";
import { parse } from "date-fns";

interface Lesson {
  id: string;
  name: string;
  duration?: number;
  lessonType: "Video" | "Attachment";
}

interface Chapter {
  id: string;
  name: string;
  lessons: Lesson[];
}

export default function CurriculumBar({
  courseId,
  onLessonClick,
  refetchTrigger,
  activeLessonId,
}: {
  courseId: string;
  currentLessonId: string;
  onLessonClick: (lessonId: string) => void;
  refetchTrigger: number;
  activeLessonId: string | null;
}) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${Backend_Url}/Chapters/GetChapters`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) {
          throw new Error(response.statusText || "Failed to fetch chapters");
        }

        const data = await response.json();
        if (data.isSuccess) {
          setChapters(data.chapters.items);
          if (data.chapters.items.length > 0 && !expandedChapterId) {
            setExpandedChapterId(data.chapters.items[0].id);
          }
        } else {
          throw new Error(data.errors?.join(", ") || "Unknown error occurred");
        }
      } catch (error) {
        console.error("Fetch failed:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, [courseId, refetchTrigger]);

  const toggleChapter = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  function durationToMinutes(duration: string): string {
    if (!duration || duration === "00:00:00") return "N/A";

    const parsed = parse(duration, "HH:mm:ss", new Date());
    const hours = parsed.getHours();
    const minutes = parsed.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    return `${totalMinutes} min`;
  }
  return (
    <div className="flex flex-col gap-4 p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl text-gray-800">Curriculum</h2>

        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md cursor-default">
                {chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)} lessons
              </span>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="top"
              className="z-50 rounded bg-gray-800 px-2 py-1 text-xs text-white shadow"
              sideOffset={5}
            >
              Total lessons in course
              <Tooltip.Arrow className="fill-gray-800" />
            </Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>

      <div className="w-full border-b border-gray-200 mb-2" />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="border border-gray-200 rounded-md overflow-hidden"
            >
              <div className="h-12 bg-gray-100 animate-pulse"></div>
            </motion.div>
          ))}
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md"
        >
          <p className="font-medium">Error loading curriculum</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            type="button"
            className="mt-2 px-3 py-1 text-sm border border-red-200 rounded-md hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </motion.div>
      ) : chapters.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-6 text-gray-500">
          No chapters found for this course
        </motion.div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-xs"
            >
              <button
                onClick={() => toggleChapter(chapter.id)}
                type="button"
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedChapterId === chapter.id ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                  <h3 className="text-left font-medium text-gray-800">{chapter.name}</h3>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{chapter.lessons.length} lessons</span>
              </button>

              <AnimatePresence initial={false}>
                {expandedChapterId === chapter.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-2 p-3 bg-gray-50">
                      {chapter.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        return (
                          <motion.button
                            key={lesson.id}
                            onClick={() => onLessonClick(lesson.id)}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            type="button"
                            className={`flex items-center justify-between gap-3 p-3 rounded-md transition-all text-left `}
                          >
                            <div className="flex items-center gap-3">
                              {lesson.lessonType == "Attachment" ? (
                                <div className="h-5 w-5">
                                  <FaRegFileAlt className={` ${isActive ? "text-[#00B087]" : "text-gray-500"}`} />
                                </div>
                              ) : (
                                <div className="h-5 w-5">
                                  <FaRegPlayCircle className={` ${isActive ? "text-[#00B087]" : "text-gray-500"}`} />
                                </div>
                              )}

                              <span className={`text-sm ${isActive ? "font-medium text-[#00B087]" : "text-gray-700"}`}>
                                {lesson.name}
                              </span>
                            </div>
                            <Tooltip.Provider>
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <span
                                    className={`text-xs px-2 py-1 rounded text-nowrap ${
                                      isActive ? "bg-indigo-200 text-indigo-800" : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {durationToMinutes(lesson.duration?.toString() || "")}
                                  </span>
                                </Tooltip.Trigger>
                                <Tooltip.Content
                                  side="top"
                                  className="z-50 rounded bg-gray-800 px-2 py-1 text-xs text-white shadow"
                                  sideOffset={5}
                                >
                                  Lesson duration
                                  <Tooltip.Arrow className="fill-gray-800" />
                                </Tooltip.Content>
                              </Tooltip.Root>
                            </Tooltip.Provider>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

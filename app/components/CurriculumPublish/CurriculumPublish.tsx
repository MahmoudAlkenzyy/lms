"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Backend_Url, Fake_Token } from "@/constants";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import { parse } from "date-fns";

interface Lesson {
  id: string;
  name: string;
  duration?: string;
  lessonType: "Video" | "Attachment";
}

interface Chapter {
  id: string;
  name: string;
  lessons: Lesson[];
}
interface props {
  setVideoDuration: Dispatch<SetStateAction<string>>;
  setAttachmentCount: Dispatch<SetStateAction<number>>;
}
export default function CurriculumBarPreview({ setAttachmentCount, setVideoDuration }: props) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState<string>("00h 00m");
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");
  const router = useRouter();

  useEffect(() => {
    const fetchChapters = async () => {
      const res = await fetch(`${Backend_Url}/Chapters/GetChapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Fake_Token,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (data.isSuccess) {
        const chapterItems = data.chapters.items;
        setChapters(chapterItems);
        if (chapterItems.length > 0) {
          setExpandedChapterId(chapterItems[0].id);
        }

        const total = calculateTotalDuration(chapterItems);
        setTotalDuration(formatDuration(total));

        const attachments = countAttachments(chapterItems);
        setAttachmentCount(attachments);

        const videoOnlyMinutes = calculateVideoDuration(chapterItems);
        setVideoDuration(formatDuration(videoOnlyMinutes));
      }
    };

    if (courseId) fetchChapters();
  }, [courseId]);

  const toggleChapter = (id: string) => {
    setExpandedChapterId((prev) => (prev === id ? null : id));
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/CoursePreview?courseid=${courseId}&lessonid=${lessonId}`);
  };

  function durationToMinutes(duration: string): string {
    if (!duration || duration === "00:00:00") return "N/A";
    const parsed = parse(duration, "HH:mm:ss", new Date());
    const hours = parsed.getHours();
    const minutes = parsed.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes} min`;
  }

  function calculateTotalDuration(chapters: Chapter[]): number {
    let totalSeconds = 0;
    chapters.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        if (lesson.duration) {
          const [hh, mm, ss] = lesson.duration.split(":").map(Number);
          totalSeconds += hh * 3600 + mm * 60 + ss;
        }
      });
    });
    return Math.floor(totalSeconds / 60);
  }

  function calculateVideoDuration(chapters: Chapter[]): number {
    let totalSeconds = 0;
    chapters.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        if (lesson.lessonType === "Video" && lesson.duration) {
          const [hh, mm, ss] = lesson.duration.split(":").map(Number);
          totalSeconds += hh * 3600 + mm * 60 + ss;
        }
      });
    });
    return Math.floor(totalSeconds / 60);
  }

  function countAttachments(chapters: Chapter[]): number {
    let count = 0;
    chapters.forEach((chapter) => {
      chapter.lessons?.forEach((lesson) => {
        if (lesson.lessonType === "Attachment") count++;
      });
    });
    return count;
  }

  function formatDuration(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 space-y-4">
      <h2 className="font-bold text-xl text-gray-800">Curriculum</h2>

      <div className="text-sm text-gray-600 flex gap-4 flex-wrap">
        <span className="flex gap-1 items-center">
          <HiOutlineBookOpen size={19} /> <strong>{chapters.length}</strong>{" "}
          {chapters.length === 1 ? "Section" : "Sections"}
        </span>
        <span className="flex gap-1 items-center">
          <FaRegFileAlt size={16} /> <strong>{chapters.reduce((acc, c) => acc + c.lessons.length, 0)}</strong> Lessons
        </span>

        <span className="flex gap-1 items-center">
          <IoMdTime size={19} /> <strong>{totalDuration}</strong> Total Duration
        </span>
      </div>

      {chapters.map((chapter) => (
        <motion.div
          key={chapter.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            type="button"
            onClick={() => toggleChapter(chapter.id)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {expandedChapterId === chapter.id ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
              <h3 className="font-medium text-gray-800">{chapter.name}</h3>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{chapter.lessons.length} lessons</span>
          </button>

          <AnimatePresence initial={false}>
            {expandedChapterId === chapter.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 p-3 bg-gray-50">
                  {chapter.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => handleLessonClick(lesson.id)}
                      className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-white border border-transparent hover:border-gray-300 transition"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.lessonType === "Attachment" ? (
                          <FaRegFileAlt className="text-gray-500" />
                        ) : (
                          <FaRegPlayCircle className="text-gray-500" />
                        )}
                        <span className="text-sm text-gray-800">{lesson.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {lesson.duration ? durationToMinutes(lesson.duration) : "N/A"}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CurriculumBar from "@/app/components/CurriculumBar/CurriculumBar";
import { Backend_Url, Fake_Token, Files_Url } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";

export function LessonsPreviewPageClient() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");
  const lessonId = searchParams.get("lessonid");

  const [lessonData, setLessonData] = useState<any>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchLessonData = async (id: string) => {
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${id}`, {
        headers: { Authorization: Fake_Token },
      });
      const data = await res.json();
      if (data.lesson) {
        setLessonData(data.lesson);
        setActiveLessonId(id);
      }
    } catch (err) {
      console.error("Failed to fetch lesson data:", err);
    }
  };

  useEffect(() => {
    if (lessonId) fetchLessonData(lessonId);
  }, [lessonId]);

  return (
    <div className="flex gap-7 mt-6 px-6 py-6">
      <div className="w-2/3">
        <AnimatePresence mode="wait">
          {lessonData ? (
            <motion.div
              key={lessonData.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              {/* <h2 className="text-2xl font-semibold text-[#111827]">{lessonData.name}</h2> */}

              {lessonData.intro && (
                <p className="text-gray-700 whitespace-pre-line  bg-white p-6 rounded-xl shadow-md">
                  {lessonData.intro}
                </p>
              )}

              <div className=" bg-white p-6 rounded-xl shadow-md">
                {lessonData.video && (
                  <motion.video
                    key="video"
                    src={`${Files_Url}${lessonData.video}`}
                    poster={lessonData.videoPlaceholder ? `${Files_Url}${lessonData.videoPlaceholder}` : undefined}
                    controls
                    className="w-full rounded-lg shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                )}

                <p className="text-gray-800 whitespace-pre-line mt-3">{lessonData.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonData.itemImages?.map((img: any, idx: number) => (
                  <motion.div
                    key={idx}
                    className="flex flex-col gap-2  bg-white p-6 rounded-xl shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <img
                      src={`${Files_Url}${img.url}`}
                      alt={`Lesson Image ${idx + 1}`}
                      className="rounded-lg shadow w-full object-cover"
                    />
                    <p className="text-sm text-gray-600">{img.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-sm bg-white p-6 rounded-xl shadow"
            >
              Select a lesson to preview.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-1/3">
        {courseId ? (
          <CurriculumBar
            courseId={courseId}
            currentLessonId={lessonId ?? ""}
            onLessonClick={(id) => fetchLessonData(id)}
            refetchTrigger={refetchTrigger}
            activeLessonId={activeLessonId}
          />
        ) : (
          <div className="text-sm text-red-500">Course ID not found in URL.</div>
        )}
      </div>
    </div>
  );
}

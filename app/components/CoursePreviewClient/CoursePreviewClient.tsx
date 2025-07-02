"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import CurriculumBar from "@/app/components/CurriculumBar/CurriculumBar";
import { Backend_Url, Fake_Token, Files_Url } from "@/constants";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

import * as Tooltip from "@radix-ui/react-tooltip";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export function LessonsPreviewPageClient() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");
  const lessonId = searchParams.get("lessonid");

  const [lessonData, setLessonData] = useState<any>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // const fetchCourse
  const fetchLessonData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${id}`, {
        headers: { Authorization: Fake_Token },
      });

      if (!res.ok) {
        throw new Error(res.statusText || "Failed to fetch lesson data");
      }

      const data = await res.json();
      if (data.lesson) {
        setLessonData(data.lesson);
        setActiveLessonId(id);
        setVideoProgress(0);
        setIsVideoPlaying(false);
      } else {
        throw new Error("Lesson data not found");
      }
    } catch (err) {
      console.error("Failed to fetch lesson data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoProgress = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(isNaN(progress) ? 0 : progress);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const navigateToAdjacentLesson = (direction: "prev" | "next") => {
    console.log(`Navigate to ${direction} lesson`);
  };

  useEffect(() => {
    if (lessonId) fetchLessonData(lessonId);
  }, [lessonId]);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-64 w-full bg-gray-200 rounded-xl animate-pulse"
      />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="w-full lg:w-2/3 space-y-6">
        <nav className="text-sm text-gray-600">
          <ol className="flex items-center space-x-2">
            <li>Courses</li>
            <li>
              <ChevronRightIcon className="h-4 w-4 inline" />
            </li>
            <li className="font-medium text-gray-900">Lesson Preview</li>
          </ol>
        </nav>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl"
            >
              <h3 className="font-medium">Error loading lesson</h3>
              <p>{error}</p>
              <button
                onClick={() => lessonId && fetchLessonData(lessonId)}
                className="mt-2 px-4 py-2 border border-red-200 rounded-md text-red-700 hover:bg-red-100 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : lessonData ? (
            <motion.div
              key={lessonData.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
                {lessonData.video && (
                  <div className="space-y-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
                      <video
                        src={`${Files_Url}${lessonData.video}`}
                        poster={lessonData.videoPlaceholder ? `${Files_Url}${lessonData.videoPlaceholder}` : undefined}
                        controls
                        className="w-full rounded-lg shadow-sm aspect-video bg-black"
                        onTimeUpdate={handleVideoProgress}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                      />
                      <div className="absolute bottom-0 left-0 right-0">
                        <div className="h-1 w-full bg-gray-200">
                          <div
                            className="h-full bg-gray-800 transition-all duration-300"
                            style={{ width: `${videoProgress}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>
                        {isVideoPlaying ? "Now playing" : "Paused"} • {Math.round(videoProgress)}% completed
                      </span>
                      <Tooltip.Provider>
                        <Tooltip.Root></Tooltip.Root>
                      </Tooltip.Provider>
                    </div>
                  </div>
                )}

                <h1 className="text-2xl font-bold mt-4 text-gray-900">{lessonData.name || "Untitled Lesson"}</h1>

                {lessonData.description && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <p className="text-gray-700 mt-3 whitespace-pre-line leading-relaxed">{lessonData.description}</p>
                  </motion.div>
                )}

                {lessonData.intro && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-4   border-t border-gray-200"
                  >
                    <h3 className="font-medium  mb-2">Introduction</h3>
                    <p className="text-blue-700 whitespace-pre-line">{lessonData.intro}</p>
                  </motion.div>
                )}
              </div>

              {lessonData.itemImages?.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-lg font-semibold mb-3 text-gray-800"> Use cases</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lessonData.itemImages.map((img: any, idx: number) => (
                      <motion.div
                        key={idx}
                        className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="relative group">
                          <img
                            src={`${Files_Url}${img.url}`}
                            alt={`Lesson Image ${idx + 1}`}
                            className="rounded-lg w-full h-48 object-cover"
                          />
                          <a
                            href={`${Files_Url}${img.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
                          >
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-700" />
                          </a>
                        </div>
                        {img.description && <p className="text-sm text-gray-600 mt-2">{img.description}</p>}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="no-data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Lesson Selected</h3>
                <p className="text-gray-600 mb-4">Choose a lesson from the curriculum to start learning.</p>
                <div className="lg:hidden">
                  <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700">
                    Browse Curriculum
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full lg:w-1/3">
        {courseId ? (
          <div className="sticky top-4 space-y-4">
            <CurriculumBar
              courseId={courseId}
              currentLessonId={lessonId ?? ""}
              onLessonClick={(id) => fetchLessonData(id)}
              refetchTrigger={refetchTrigger}
              activeLessonId={activeLessonId}
            />

            {/* Additional sidebar content */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-medium mb-2">Lesson Progress</h3>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gray-800 rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{Math.round(videoProgress)}% completed</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">Course ID not found in URL.</div>
        )}
      </div>
    </div>
  );
}

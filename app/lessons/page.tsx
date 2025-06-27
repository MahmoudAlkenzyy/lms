"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FileUploader from "../components/FileUploader/FileUploader";
import Textarea from "../components/Textarea/Textarea";
import CurriculumBar from "../components/CurriculumBar/CurriculumBar";
import { Backend_Url, Fake_Token } from "@/constants";

export default function Page() {
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseid");
  const chapterId = searchParams.get("chapterid");
  const lessonId = searchParams.get("lessonid");

  const [lessonData, setLessonData] = useState<any>(null);

  // Fetch lesson data automatically if lessonId exists in URL
  useEffect(() => {
    if (lessonId) {
      fetchLessonData(lessonId);
    }
  }, [lessonId]);

  const fetchLessonData = async (lessonId: string) => {
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${lessonId}`, {
        method: "GET",
        headers: {
          Authorization: Fake_Token,
          Accept: "text/plain",
        },
      });

      const data = await res.json();
      console.log("📘 Lesson data:", data);
      setLessonData(data.lesson);
    } catch (err) {
      console.error("❌ Failed to fetch lesson data", err);
    }
  };

  const handleLessonClick = (lessonId: string) => {
    // Optional: Update the URL using router.push to reflect the selected lesson
    // For now just fetch
    fetchLessonData(lessonId);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="py-2 px-4 sticky mt-3 -top-[16px] z-90 bg-black text-white flex flex-wrap items-center rounded-lg justify-between">
        <div>
          <h2 className="text-xl">Add Courses</h2>
          <p className="text-xs text-[#FFFFFFB0]">let's check your update today.</p>
        </div>
        <button type="button" className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc]">
          Save
        </button>
      </div>

      <div className="flex mt-4 gap-7">
        <div className="w-2/3 flex flex-col gap-7">
          {lessonData ? (
            <>
              <Textarea id="intro" placeholder="Lesson intro" />
              <div className="flex flex-col p-3 bg-white border shadow rounded-xl border-[#00000029]">
                <FileUploader id="video" bg="/images/uploadImageBg.png" type="video" />
                <Textarea id="description" placeholder="Lesson description" />
              </div>
              <div className="flex  gap-3">
                <div className=" flex flex-col w-full">
                  <FileUploader
                    id="itemImages1-image"
                    bg="/images/upoadFileBg3.png"
                    type="image"
                    className="flex-grow"
                  />
                  <Textarea id="itemImages1-description" placeholder="Enter content" />
                </div>
                <div className=" flex flex-col w-full">
                  <FileUploader
                    id="itemImages2-image"
                    bg="/images/upoladFileBg2.png"
                    type="image"
                    className="flex-grow"
                  />
                  <Textarea id="itemImages1-description" placeholder="Enter content" />
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">Select a lesson to view/edit its data</div>
          )}
        </div>

        <div className="w-1/3">
          {courseId ? (
            <CurriculumBar courseId={courseId} onLessonClick={handleLessonClick} />
          ) : (
            <p className="text-sm text-red-500">Course ID not found in URL.</p>
          )}
        </div>
      </div>
    </div>
  );
}

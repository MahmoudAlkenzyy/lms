"use client";

import React, { useEffect, useState } from "react";
import LessonRow from "../LessonRow/LessonRow";
import AddLessonModal from "../AddLessonModal/AddLessonModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Backend_Url, Fake_Token } from "@/constants";
import { toast } from "react-toastify";
import UpdateLessonModal from "../UpdateLessonModal/UpdateLessonModal";

interface Lesson {
  id: string;
  name: string;
  lessonType: "Video" | "Attachment";
  duration: string;
}

const LessonsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [chapterName, setChapterName] = useState();
  const [selectedLessonToUpdate, setSelectedLessonToUpdate] = useState<Lesson | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterid");
  const CourseId = searchParams.get("courseid");
  const router = useRouter();

  const fetchLessons = async () => {
    if (!chapterId) return;

    setLoading(true);
    try {
      const res = await fetch(`${Backend_Url}/Chapters/GetChapter?ChapterId=${chapterId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          Authorization: Fake_Token,
        },
      });

      const data = await res.json();
      setChapterName(data.chapter.name);
      console.log(data.chapter.lessons);
      if (data.isSuccess && Array.isArray(data.chapter.lessons)) {
        const mappedLessons = data.chapter.lessons.map((lesson: any) => {
          let normalizedType: "Video" | "Attachment" = "Video";

          if (typeof lesson.lessonType === "string") {
            normalizedType = lesson.lessonType.toLowerCase() === "attachment" ? "Attachment" : "Video";
          } else if (typeof lesson.lessonType === "number") {
            normalizedType = lesson.lessonType === 1 ? "Attachment" : "Video";
          }

          return {
            id: lesson.id,
            name: lesson.name,
            lessonType: normalizedType,
            duration: lesson.duration || "00:00:00",
          };
        });

        setLessons(mappedLessons);
      } else {
        console.warn("Unexpected data format or no lessons returned.");
      }
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;

    try {
      const res = await fetch(`${Backend_Url}/Lessons/DeleteLesson?Id=${lessonToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: Fake_Token,
          Accept: "text/plain",
        },
      });

      if (!res.ok) throw new Error("Failed to delete lesson");

      toast.success(" Lesson deleted successfully");
      setLessonToDelete(null);
      fetchLessons();
    } catch (error) {
      console.error("  Error deleting lesson", error);
      toast.error("  Failed to delete lesson");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [chapterId]);
  console.log({ selectedLessonToUpdate });

  return (
    <div className="">
      <div className="py-2 px-4 sticky pb-3  top-[70px] z-50 bg-black text-white flex flex-wrap items-center rounded-b-lg justify-start gap-3">
        {/* <CiTextAlignLeft /> */}
        <div className="">
          <h2 className="text-3xl pb-3">{chapterName || "Add Courses"}</h2>
          <p className="text-xs text-[#FFFFFFB0]">Add and customize lessons.</p>
        </div>

        <div className="flex gap-4 items-center ms-auto  justify-end ">
          <button
            type="button"
            onClick={() => router.push(`/CoursePreviewPublish?courseid=${CourseId}`)}
            className={`${
              lessons.length == 0 && "!opacity-50 !cursor-not-allowed"
            } px-6 py-1 text-sm text-gray-600 bg-white border border-gray-400 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer`}
            disabled={lessons.length == 0}
          >
            Preview
          </button>

          {/* <button className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc] transition-colors duration-200 cursor-pointer">
            Save to draft
          </button> */}
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-5 mx-3 mb-3">
        {loading ? (
          <p>Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-gray-500">No lessons found for this section.</p>
        ) : (
          lessons.map((lesson) => (
            <>
              <LessonRow
                key={lesson.id}
                type={lesson.lessonType}
                title={lesson.name}
                duration={lesson.duration}
                onClick={() =>
                  router.push(`/lessons?courseid=${CourseId}&chapterid=${chapterId}&lessonid=${lesson.id}`)
                }
                onPreview={() => router.push(`CoursePreview?courseid=${CourseId}&chapterid=${chapterId}&lessonid=${lesson.id}`)}
                onEdit={() => {
                  console.log({ lesson });
                  setSelectedLessonToUpdate(lesson);

                  setIsUpdateModalOpen(true);
                }}
                onDelete={() => setLessonToDelete(lesson)}
              />
            </>
          ))
        )}

        <AddLessonModal isOpen={isOpen} setIsOpen={setIsOpen} refetch={fetchLessons} />
        <UpdateLessonModal
          isOpen={isUpdateModalOpen}
          setIsOpen={setIsUpdateModalOpen}
          lessonData={
            selectedLessonToUpdate
              ? {
                  id: selectedLessonToUpdate.id,
                  name: selectedLessonToUpdate.name,
                  type: selectedLessonToUpdate.lessonType,
                  duration: selectedLessonToUpdate.duration,
                }
              : null
          }
          refetch={fetchLessons}
        />

        <button
          onClick={() => setIsOpen(true)}
          className="w-full border-[#7337FF] text-[#7337FF] border p-3 rounded cursor-pointer"
        >
          + Add New Lesson
        </button>

        <ConfirmDeleteModal
          isOpen={!!lessonToDelete}
          onClose={() => setLessonToDelete(null)}
          onConfirm={handleDeleteLesson}
          title="Delete Lesson"
          courseName={lessonToDelete?.name || ""}
          message={`Are you sure you want to delete lesson "${lessonToDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default LessonsTable;

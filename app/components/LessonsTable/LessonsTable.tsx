"use client";

import React, { useEffect, useState } from "react";
import LessonRow from "../LessonRow/LessonRow";
import AddLessonModal from "../AddLessonModal/AddLessonModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { useRouter, useSearchParams } from "next/navigation";
import { Backend_Url, Fake_Token } from "@/constants";
import { toast } from "react-toastify";

interface Lesson {
  id: string;
  name: string;
  type: "Video" | "Attachment";
  duration: string;
}

const LessonsTable = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const searchParams = useSearchParams();
  const chapterId = searchParams.get("chapterid");
  const CourseId = searchParams.get("courseid");
  const router = useRouter();

  const fetchLessons = async () => {
    if (!chapterId) return;

    setLoading(true);
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Fake_Token,
          Accept: "text/plain",
        },
        body: JSON.stringify({ chapterId }),
      });

      const data = await res.json();
      if (data.isSuccess && Array.isArray(data.lessons)) {
        const mappedLessons = data.lessons.map((lesson: any) => {
          const rawType = lesson.type;
          let normalizedType: "Video" | "Attachment";

          if (typeof rawType === "string") {
            const typeLower = rawType.toLowerCase();
            normalizedType = typeLower === "attachment" ? "Attachment" : "Video";
          } else if (typeof rawType === "number") {
            normalizedType = rawType === 1 ? "Attachment" : "Video";
          } else {
            normalizedType = "Video";
          }

          return {
            id: lesson.id,
            name: lesson.name,
            type: normalizedType,
            duration: lesson.duration || "N/A",
          };
        });

        setLessons(mappedLessons);
      } else {
        console.warn("  No lessons found or unexpected format");
      }
    } catch (err) {
      console.error("  Failed to fetch lessons", err);
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

  return (
    <div className="flex flex-col gap-3 mt-5">
      {loading ? (
        <p>Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="text-sm text-gray-500">No lessons found for this section.</p>
      ) : (
        lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            type={lesson.type}
            title={lesson.name}
            duration={lesson.duration}
            onEdit={() => router.push(`/lessons?courseid=${CourseId}&chapterid=${chapterId}&lessonid=${lesson.id}`)}
            onDelete={() => setLessonToDelete(lesson)}
          />
        ))
      )}

      <AddLessonModal isOpen={isOpen} setIsOpen={setIsOpen} refetch={fetchLessons} />

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
  );
};

export default LessonsTable;

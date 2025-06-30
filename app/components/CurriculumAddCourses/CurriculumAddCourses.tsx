"use client";

import React, { useEffect, useState, useCallback } from "react";
import AddSectionModal from "../AddSectionModal/AddSectionModal";
import Accordion from "../Accordion/Accordion";
import { useRouter } from "next/navigation";
import { Backend_Url, Fake_Token } from "../../../constants";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { toast } from "react-toastify";

interface Lesson {
  id: string;
  name: string;
  lessonType: string;
}

interface Chapter {
  id: string;
  name: string;
  lessons: Lesson[];
}

interface Props {
  id: string;
  disabled: boolean;
}

const CurriculumAddCourses: React.FC<Props> = ({ id, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [chapterToDelete, setChapterToDelete] = useState<{ id: string; name: string } | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;
    toast.loading("Deleting lesson...");
    try {
      const res = await fetch(`${Backend_Url}/Lessons/DeleteLesson?Id=${lessonToDelete.id}`, {
        method: "DELETE",
        headers: {
          Accept: "text/plain",
          Authorization: Fake_Token,
        },
      });

      if (!res.ok) throw new Error("Failed");

      toast.dismiss();
      toast.success("Lesson deleted successfully");
      setLessonToDelete(null);
      fetchChapters();
    } catch (err) {
      toast.dismiss();
      toast.error("❌ Failed to delete lesson");
    }
  };
  const router = useRouter();

  const fetchChapters = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`${Backend_Url}/Chapters/GetChapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Fake_Token,
        },
        body: JSON.stringify({ courseId: id }),
      });

      const data = await res.json();
      if (data.isSuccess && data.chapters?.items) {
        setChapters(data.chapters.items);
      } else {
        console.warn("  No chapters found or unexpected response:", data);
      }
    } catch (err) {
      console.error("  Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const handleDeleteChapter = async () => {
    if (!chapterToDelete) return;
    toast.loading("Deleting section...");
    try {
      const res = await fetch(`${Backend_Url}/Chapters/DeleteChapter?Id=${chapterToDelete.id}`, {
        method: "DELETE",
        headers: {
          Accept: "text/plain",
          Authorization: Fake_Token,
        },
      });

      if (!res.ok) throw new Error("Failed");

      toast.dismiss();
      toast.success("Section deleted successfully");
      setChapterToDelete(null);
      fetchChapters();
    } catch (err) {
      toast.dismiss();
      toast.error("  Failed to delete section");
    }
  };

  return (
    <div className="bg-white rounded shadow p-5 pt-2 ps-2">
      <div className="flex justify-between items-center my-2">
        <p className="text-base font-medium text-gray-800">Curriculum</p>
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          disabled={disabled}
          className={`text-sm focus:outline-none transition ${
            disabled ? "text-gray-400 cursor-not-allowed" : "text-[#7337FF] cursor-pointer"
          }`}
        >
          + Add New Section
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {loading && <p>Loading chapters...</p>}
        {!loading && chapters.length === 0 && <p className="text-sm text-gray-500">You don't have any chapters yet.</p>}

        {chapters.map((chapter) => (
          <Accordion
            key={chapter.id}
            chapter={chapter}
            disabled={disabled}
            onEdit={() => router.push(`/Sections?courseid=${id}&chapterid=${chapter.id}`)}
            onDelete={() => setChapterToDelete({ id: chapter.id, name: chapter.name })}
            onEditLesson={(lessonid) =>
              router.push(`/lessons?courseid=${id}&chapterid=${chapter.id}&lessonid=${lessonid}`)
            }
            onDeleteLesson={(lessonId, lessonName) => setLessonToDelete({ id: lessonId, name: lessonName })}
          />
        ))}

        <AddSectionModal id={id} isOpen={isOpen} setIsOpen={setIsOpen} refetch={fetchChapters} />
      </div>

      <ConfirmDeleteModal
        isOpen={!!chapterToDelete}
        onClose={() => setChapterToDelete(null)}
        onConfirm={handleDeleteChapter}
        title="Delete Section"
        courseName={chapterToDelete?.name || ""}
        message={`Are you sure you want to delete section "${chapterToDelete?.name}"? This action cannot be undone.`}
      />
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

export default CurriculumAddCourses;

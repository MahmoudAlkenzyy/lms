"use client";

import React, { useEffect, useState, useCallback } from "react";
import AddSectionModal from "../AddSectionModal/AddSectionModal";
import Accordion from "../Accordion/Accordion";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const fetchChapters = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch("https://localhost:7022/api/Chapters/GetChapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer your_token_here",
        },
        body: JSON.stringify({ courseId: id }),
      });

      const data = await res.json();
      if (data.isSuccess) {
        setChapters(data.chapters.items);
      }
    } catch (err) {
      console.error("❌ Error fetching chapters:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

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
            onEdit={() => router.push(`/lessons?courseid=${id}`)}
            onDelete={() => {
              if (confirm("Are you sure you want to delete this chapter?")) {
                // delete API logic here
              }
            }}
          />
        ))}

        <AddSectionModal id={id} isOpen={isOpen} setIsOpen={setIsOpen} refetch={fetchChapters} />
      </div>
    </div>
  );
};

export default CurriculumAddCourses;

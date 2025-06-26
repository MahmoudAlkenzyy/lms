"use client";
import React, { useState } from "react";
import LessonRow from "../LessonRow/LessonRow";
import AddLessonModal from "../AddLessonModal/AddLessonModal";

const SectionsTable = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 mt-5">
      <LessonRow
        type="document"
        title="Read before your start"
        duration="4 min"
        onEdit={() => console.log("Edit doc")}
        onDelete={() => console.log("Delete doc")}
      />

      <LessonRow
        type="video"
        title="Introduction to figma essentials training courses."
        duration="40 min"
        onEdit={() => console.log("Edit video")}
        onDelete={() => console.log("Delete video")}
      />
      <AddLessonModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <button onClick={() => setIsOpen(true)} className="w-full border-[#7337FF] text-[#7337FF] border p-3 rounded">
        {" "}
        + Add New Lesson
      </button>
    </div>
  );
};

export default SectionsTable;

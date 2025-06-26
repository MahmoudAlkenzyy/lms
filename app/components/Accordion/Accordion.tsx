"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronUp, FaTrashAlt, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
  chapter: Chapter;
  disabled?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const Accordion: React.FC<Props> = ({ chapter, disabled, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#eee] rounded-md">
      <div
        className={`flex items-center justify-between px-4 py-2 bg-[#f9f9f9] cursor-pointer ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <div className="font-medium text-sm">{chapter.name}</div>
        <div className="flex items-center gap-3">
          <button
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <FaEdit size={14} className="text-blue-500" />
          </button>
          <button
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <FaTrashAlt size={14} className="text-red-500" />
          </button>
          {open ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden px-4 py-2"
          >
            {chapter.lessons.length === 0 ? (
              <p className="text-sm text-gray-400">You don’t have any lessons yet.</p>
            ) : (
              chapter.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex justify-between items-center py-1 border-b border-gray-200 last:border-none"
                >
                  <div className="text-sm">
                    {lesson.name} <span className="text-gray-500 text-xs">({lesson.lessonType})</span>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={disabled} onClick={() => alert("Edit lesson")}>
                      <FaEdit size={13} className="text-blue-400" />
                    </button>
                    <button disabled={disabled} onClick={() => confirm("Delete this lesson?") && alert("Deleted")}>
                      <FaTrashAlt size={13} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;

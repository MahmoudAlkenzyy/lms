"use client";
import { FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import React from "react";

interface LessonRowProps {
  type: "video" | "document";
  title: string;
  duration: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LessonRow: React.FC<LessonRowProps> = ({ type, title, duration, onEdit, onDelete }) => {
  const icon = type === "video" ? <FaRegPlayCircle className="text-xl" /> : <FaRegFileAlt className="text-xl" />;

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md mb-2">
      <div className="flex items-center gap-3">
        <span className="text-gray-700">{icon}</span>
        <p className="text-sm text-gray-800">{title}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{duration}</span>
        <div className="flex gap-2 bg-[#ECE3FF] px-2 py-1 rounded">
          <button onClick={onEdit} className="text-violet-600">
            <FaRegEdit />
          </button>
          <button onClick={onDelete} className="text-red-500">
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonRow;

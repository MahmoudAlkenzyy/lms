import { FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

import React from "react";

interface LessonRowProps {
  type: string; // 👈 خليها string بدل "Video" | "Attachment"
  title: string;
  duration: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const LessonRow: React.FC<LessonRowProps> = ({ type, title, duration, onEdit, onDelete }) => {
  const icon =
    type === "Video" ? (
      <FaRegPlayCircle className="text-xl  text-gray-500" />
    ) : (
      <FaRegFileAlt className="text-xl text-gray-500" />
    );

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-md mb-2">
      <div className="flex items-center gap-3">
        <span>{icon}</span>
        <p className="text-sm text-gray-800">{title}</p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{duration}</span>
        <div className="flex gap-2 bg-[#ECE3FF] px-2 py-1 rounded">
          <button onClick={onEdit} className="text-violet-600 cursor-pointer">
            <FaRegEdit />
          </button>
          <button onClick={onDelete} className="text-red-500 cursor-pointer">
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonRow;

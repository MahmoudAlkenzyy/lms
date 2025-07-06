import { FaEye, FaRegFileAlt, FaRegPlayCircle } from "react-icons/fa";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

import React from "react";
import { addMinutes, format, parse } from "date-fns";

interface LessonRowProps {
  type: string; // 👈 خليها string بدل "Video" | "Attachment"
  title: string;
  duration: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  onClick?: () => void;
}

const LessonRow: React.FC<LessonRowProps> = ({ type, title, duration, onEdit, onDelete, onPreview, onClick }) => {
  const icon =
    type === "Video" ? (
      <FaRegPlayCircle className="text-xl  text-gray-500" />
    ) : (
      <FaRegFileAlt className="text-xl text-gray-500" />
    );

  console.log(duration);
  function durationToMinutes(duration: string): string {
    if (!duration || duration === "00:00:00") return "N/A";

    const parsed = parse(duration, "HH:mm:ss", new Date());
    const hours = parsed.getHours();
    const minutes = parsed.getMinutes();

    const totalMinutes = hours * 60 + minutes;

    return `${totalMinutes} min`;
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-md mb-2">
      <div onClick={onClick} className="flex items-center gap-3 grow  p-3">
        <span>{icon}</span>
        <p className="text-sm text-gray-800">{title}</p>
      </div>

      <div className="flex items-center gap-4 bgre  p-3">
        <span className="text-sm text-gray-600">{durationToMinutes(duration)}</span>

        <div className="flex gap-2 bg-[#ECE3FF] px-2 py-1 rounded">
          <button onClick={onPreview} className="text-[#7337FF] cursor-pointer">
            <FaEye />
          </button>
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

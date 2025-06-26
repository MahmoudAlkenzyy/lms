import React from "react";
import { CiTextAlignLeft } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";

interface Props {
  onSave: () => void;
}

export default function HeaderBar({ onSave }: Props) {
  return (
    <div className="py-2 px-4 sticky mt-3 -top-[16px] z-90 bg-black text-white flex flex-wrap items-center rounded-lg justify-start gap-6">
      <CiTextAlignLeft />
      <div>
        <h2 className="text-xl">Add Courses</h2>
        <p className="text-xs text-[#FFFFFFB0]">let's check your update today.</p>
      </div>
      <div className="flex text-sm items-center gap-2 bg-[#FFFFFF14] rounded p-[2px]">
        <IoCheckmark size={18} />
        <p>Changes saved 2 min ago</p>
      </div>
      <div className="flex gap-4 items-center w-full justify-end">
        <button
          type="button"
          onClick={onSave}
          className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc] transition-colors duration-200"
        >
          Save to draft
        </button>
      </div>
    </div>
  );
}

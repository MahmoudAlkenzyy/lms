"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { Files_Url } from "../../../constants";
import { AnimatePresence, motion } from "framer-motion";

interface FileUploaderProps {
  id: string;
  type: "image" | "video";
  bg: string;
  className?: string;
  initialPreviewUrl?: string;
  file?: File | null;
  onFileChange?: (file: File | null) => void;
}

export default function FileUploader({
  id,
  type,
  bg,
  file,
  onFileChange,
  className,
  initialPreviewUrl,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(initialPreviewUrl || null);
    }
  }, [file, initialPreviewUrl]);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      onFileChange?.(f);
    }
  };

  const handleDelete = () => {
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  };

  return (
    <div className={`flex flex-col p-3 bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <input id={id} type="file" ref={inputRef} onChange={handleChange} accept={type + "/*"} className="hidden" />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-64 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {!previewUrl ? (
          <>
            <img src={bg} alt="background" className="absolute w-full h-full object-cover" />
            <Image fill src="/images/uploadLayer.svg" alt="overlay" className="z-10 bg-[#ffffffbc]" />
          </>
        ) : type === "image" ? (
          <>
            <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
          </>
        ) : (
          <>
            <video controls src={previewUrl} className="object-contain w-full h-full rounded-lg" />
          </>
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">{type === "image" ? "JPG, PNG (Max 5MB)" : "MP4 (Max 50MB)"}</div>

        {previewUrl && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="rounded transition-colors cursor-pointer text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1"
            >
              <FaRegEdit size={14} />
              Change
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

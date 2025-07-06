"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { toast } from "react-toastify";

interface FileUploaderProps {
  id: string;
  type: "image" | "video" | "pdf";
  bg: string;
  className?: string;
  initialPreviewUrl?: string;
  file?: File | null;
  bgLayer?: string;

  isPreview?: boolean;
  onFileChange?: (file: File | null) => void;
}

export default function FileUploader({
  id,
  type,
  bg,
  file,
  isPreview = false,
  onFileChange,
  className,
  initialPreviewUrl,
  bgLayer,
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
      const mimeType = f.type;

      const isValid =
        (type === "image" && mimeType.startsWith("image/")) ||
        (type === "video" && mimeType.startsWith("video/")) ||
        (type === "pdf" && mimeType === "application/pdf");

      if (!isValid) {
        toast.error(`Invalid file type. Please upload a valid ${type.toLowerCase()} file.`);
        inputRef.current!.value = ""; // Clear the input
        return;
      }

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
      <input
        id={id}
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={type === "pdf" ? "application/pdf" : `${type}/*`}
        className="hidden"
      />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-64 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={() => (previewUrl ? undefined : handleClick())}
      >
        {!previewUrl ? (
          <>
            <img src={bg} alt="background" className="absolute w-full h-full object-cover" />
            <Image
              fill
              src={bgLayer || "/images/uploadLayer.svg"}
              alt="overlay"
              className="z-10 object-cover opacity-70"
            />
          </>
        ) : type === "image" ? (
          <img src={previewUrl} alt="preview" className="object-cover w-full h-full" />
        ) : type === "video" ? (
          <video controls src={previewUrl} className="object-contain w-full h-full rounded-lg" />
        ) : (
          <embed src={previewUrl} type="application/pdf" className="w-full h-full rounded-lg" />
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        {/* <div className="text-xs text-gray-500">
          {type === "image" ? "JPG, PNG (Max 5MB)" : type === "video" ? "MP4 (Max 50MB)" : "PDF (Max 10MB)"}
        </div> */}

        {!isPreview && previewUrl && (
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

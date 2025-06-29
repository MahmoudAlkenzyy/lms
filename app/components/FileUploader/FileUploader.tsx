"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";
import { Files_Url } from "../../../constants";

interface FileUploaderProps {
  id: string;
  type: "image" | "video";
  bg: string;
  className?: string;
  initialPreviewUrl?: string; // ⬅️ renamed
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

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      console.log("Created URL for file:", url);

      return () => URL.revokeObjectURL(url);
    } else if (initialPreviewUrl && initialPreviewUrl.trim() !== "") {
      setPreviewUrl(initialPreviewUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file, initialPreviewUrl]);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    onFileChange?.(f);
  };

  const handleDelete = () => {
    if (inputRef.current) inputRef.current.value = "";
    onFileChange?.(null);
  };

  return (
    <div className={`flex flex-col p-3 pb-0 bg-white rounded-xl overflow-hidden ${className}`}>
      <input id={id} type="file" ref={inputRef} onChange={handleChange} accept={type + "/*"} className="hidden" />
      <div
        onClick={!previewUrl ? handleClick : undefined}
        className="relative w-full h-64 rounded overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {!previewUrl ? (
          <>
            <img src={bg} alt="background" className="absolute w-full h-full object-cover" />
            <Image fill src="/images/uploadLayer.svg" alt="overlay" className="z-10 bg-[#ffffffbc]" />
          </>
        ) : type === "image" ? (
          <img src={previewUrl} alt="preview" className="object-contain w-full h-full" />
        ) : (
          <video controls src={previewUrl} className="object-contain w-full h-full" />
        )}
      </div>

      <div className="h-[1px] bg-[#00000029] w-full mt-2"></div>
      <div className="self-end bg-[#7337FF36] flex border border-[#00000029] w-fit rounded-lg py-1 px-3 m-2">
        <button type="button" onClick={handleClick}>
          <FaRegEdit size={20} className="text-[#7337FF4e]" />
        </button>
        <RxDividerVertical className="text-[#00000029]" />
        <button type="button" onClick={handleDelete}>
          <RiDeleteBinLine size={20} className="text-[#EF3826]" />
        </button>
      </div>
    </div>
  );
}

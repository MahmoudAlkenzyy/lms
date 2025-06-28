"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

interface FileUploaderProps {
  id: string;
  type: "image" | "video";
  bg: string;
  className?: string;
  value?: string;
  onChange?: (base64: string) => void;
}

export default function FileUploader({ id, type, bg, className, value, onChange }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    onChange?.(base64);
  };

  const handleDelete = () => {
    if (inputRef.current) inputRef.current.value = "";
    onChange?.("");
  };

  const acceptType = type === "image" ? "image/*" : "video/*";

  return (
    <div className={`flex flex-col p-3 pb-0 bg-white rounded-xl overflow-hidden ${className}`}>
      <input id={id} type="file" ref={inputRef} onChange={handleFileChange} accept={acceptType} className="hidden" />

      <div
        onClick={!value ? handleClick : undefined}
        className="relative w-full h-64 rounded overflow-hidden flex items-center justify-center cursor-pointer"
      >
        {!value ? (
          <>
            <img src={bg} alt="background" className="absolute w-full h-full object-cover" />
            <Image fill src="/images/uploadLayer.svg" alt="overlay" className="z-10 bg-[#ffffffbc]" />
          </>
        ) : type === "image" ? (
          <img src={value} alt="preview" className="object-contain w-full h-full" />
        ) : (
          <video controls src={value} className="object-contain w-full h-full" />
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

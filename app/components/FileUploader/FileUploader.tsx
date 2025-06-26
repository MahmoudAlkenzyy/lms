"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

interface FileUploaderProps {
  type: "image" | "video";
  className?: string;
  bg: string;
}

export default function FileUploader({ type, className, bg }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image") || selectedFile.type.startsWith("video")) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewURL(url);
      } else {
        setPreviewURL(null);
      }
    }
  };

  const handleDelete = () => {
    setFile(null);
    setPreviewURL(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const acceptType = type === "image" ? "image/*" : "video/*";

  return (
    <div className={`flex flex-col p-3 pb-0 bg-white rounded-xl overflow-hidden ${className}`}>
      <input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" accept={acceptType} />

      <div
        onClick={!file ? handleClick : undefined}
        className="relative w-full h-64 rounded overflow-hidden bg-[#fff8] flex items-center justify-center cursor-pointer hover:bg-[#fff8]"
      >
        {!file ? (
          <>
            <img src={bg} alt="background" className="absolute w-full h-full object-cover" />
            <Image fill objectFit="cover" src="/images/uploadLayer.svg" alt="overlay" className="z-10 bg-[#ffffffbc]" />
          </>
        ) : previewURL ? (
          type === "image" ? (
            <img src={previewURL} alt="preview" className="object-contain w-full h-full" />
          ) : (
            <video controls src={previewURL} className="object-contain w-full h-full" />
          )
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-600">{type.toUpperCase()} uploaded</p>
          </div>
        )}
      </div>

      <div className="h-[1px] bg-[#00000029] w-full mt-2"></div>

      <div className="self-end bg-[#7337FF36] flex border border-[#00000029] w-fit rounded-lg py-1 px-3 m-2">
        <button onClick={handleClick}>
          <FaRegEdit size={20} className="text-[#7337FF4e]" />
        </button>
        <RxDividerVertical className="text-[#00000029]" />
        <button onClick={handleDelete}>
          <RiDeleteBinLine size={20} className=" text-[#EF3826]" />
        </button>
      </div>
    </div>
  );
}

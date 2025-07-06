"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RichEditor } from "../RichEditor/RichEditor";
import { Backend_Url, Fake_Token, Files_Url } from "../../../constants";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  setStep: (step: string) => void;
  setCourseId: (id: string) => void;
  disabled: boolean;
}

const BasicInfoAddCourses: React.FC<Props> = ({ disabled, setCourseId, setStep }) => {
  const [image, setImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const courseIdFromURL = searchParams.get("id");

  const {
    register,
    setValue,
    reset,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setValue("CoverImage", file, { shouldValidate: true });
    }
  };
  useEffect(() => {
    register("Description", {
      required: "Description is required",
    });
  }, [register]);
  useEffect(() => {
    const fetchCourseById = async () => {
      if (!courseIdFromURL) return;

      try {
        const response = await fetch(`${Backend_Url}/Courses/GetCourseBasicInfo?Id=${courseIdFromURL}`, {
          method: "GET",
          headers: {
            Accept: "text/plain",
            Authorization: Fake_Token,
          },
        });

        const data = await response.json();

        if (data.isSuccess && data.course) {
          const course = data.course;

          setCourseId(course.id);
          setStep(course.status || "new");

          reset({
            Name: course.name ?? "",
            Description: course.description ?? "",
            Prerequisites: course.prerequisites ?? "",
            Outcome: course.outcome ?? "",
            CoverImage: null,
          });

          if (course.coverImage) {
            setImage(`${Files_Url}${course.coverImage}`);
          }
        } else {
          console.warn("Course not found, starting fresh.");
          setStep("new");
        }
      } catch (error) {
        console.error("Error loading course:", error);
        setStep("new");
      }
    };

    fetchCourseById();
  }, [courseIdFromURL]);

  return (
    <div className="bg-white rounded shadow p-5 pt-2 ps-2">
      <p className="font-semibold">Basic Info</p>

      <div className="my-2 min-h-[190px] relative">
        <div className="flex justify-between">
          <p className="text-sm">Cover image</p>
          <motion.button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className={`rounded transition-colors  ${
              disabled ? "text-[#7337FF]/80" : "text-[#7337FF] cursor-pointer"
            } text-sm `}
            whileHover={{ scale: !disabled ? 1.05 : 1 }}
            whileTap={{ scale: !disabled ? 0.95 : 1 }}
          >
            Click to Change
          </motion.button>
        </div>
        <div className="flex flex-col items-center gap-4 grow">
          <input type="file" accept="image/*" onChange={handleImageChange} ref={inputRef} className="hidden" />
          {image ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-48"
            >
              <motion.img
                src={image}
                alt="Uploaded Preview"
                className="w-full h-full object-cover rounded-lg shadow-md border"
                whileHover={{ scale: 1.01 }}
                layoutId="course-cover-image"
              />
              {/* <motion.div className="absolute inset-0  rounded-lg" /> */}
            </motion.div>
          ) : (
            <motion.div
              className="relative w-full h-48 overflow-hidden rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src="/images/uploadImageBg.png"
                alt="background"
                className="absolute w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.02 }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-0 z-10  flex items-center justify-center"
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
                transition={{ duration: 0.2 }}
                onClick={() => !disabled && inputRef.current?.click()}
              >
                <div className="text-center ">
                  <Image
                    src="/images/uploadImage.svg"
                    alt="overlay"
                    width={1200}
                    height={400}
                    className="mx-auto opacity-60 "
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <label htmlFor="Name" className="text-sm font-medium text-gray-700 mb-2 block">
          Course Name
        </label>
        <input
          id="Name"
          type="text"
          disabled={disabled}
          {...register("Name", { required: "Course name is required", onChange: () => clearErrors("Name") })}
          placeholder="Enter your course name"
          className={`px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 ${
            disabled ? "bg-gray-100" : "bg-white"
          }`}
        />
        {errors.Name && <span className="text-red-500 text-sm">{errors.Name.message as string}</span>}
      </div>

      <RichEditor
        disabled={disabled}
        label="Description"
        id="description"
        name="Description"
        placeholder="Enter description"
        rows={4}
      />
      {errors.Description && <span className="text-red-500 text-sm">{errors.Description.message as string}</span>}

      <RichEditor
        disabled={disabled}
        label="Prerequisites"
        id="prereq"
        name="Prerequisites"
        placeholder="Enter prerequisites"
        rows={4}
      />
      <RichEditor
        disabled={disabled}
        label="Outcomes"
        id="outcome"
        name="Outcome"
        placeholder="Enter outcomes"
        rows={4}
      />
    </div>
  );
};

export default BasicInfoAddCourses;

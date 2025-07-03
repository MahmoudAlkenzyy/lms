"use client";

import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RichEditor } from "../RichEditor/RichEditor";
import { Backend_Url, Fake_Token, Files_Url } from "../../../constants";
import { useSearchParams } from "next/navigation";

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

      <div className="my-2 min-h-[190px]">
        <div className="flex justify-between">
          <p className="text-sm">Cover image</p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="rounded transition-colors cursor-pointer text-[#7337FF] text-sm"
          >
            Click to Change
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <input type="file" accept="image/*" onChange={handleImageChange} ref={inputRef} className="hidden" />
          {image && (
            <img src={image} alt="Uploaded Preview" className="w-full h-48 object-cover rounded-lg shadow-md border" />
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
          {...register("Name", { required: "Course name is required" })}
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

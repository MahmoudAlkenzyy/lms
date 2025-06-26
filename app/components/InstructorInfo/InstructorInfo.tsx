"use client";

import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "@/constants";

interface Person {
  id: string;
  name: string;
}

const InstructorInfo = ({ disabled }: { disabled: boolean }) => {
  const { register, setValue, watch } = useFormContext();

  const [instructors, setInstructors] = useState<Person[]>([]);
  const [assistants, setAssistants] = useState<Person[]>([]);

  const isRatingEnabled = watch("allowRatingOnInstructor") || false;

  useEffect(() => {
    register("instructorIds");
    register("assistantIds");
    register("allowRatingOnInstructor");
    // register("instructorImage");

    const fetchPeople = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: Fake_Token,
        };

        const [instructorRes, assistantRes] = await Promise.all([
          fetch(`${Backend_Url}/Instructors/GetInstructors`, {
            method: "POST",
            headers,
            body: JSON.stringify({}),
          }),
          fetch(`${Backend_Url}/Assistants/GetAssistants`, {
            method: "POST",
            headers,
            body: JSON.stringify({}),
          }),
        ]);

        const instructorData = await instructorRes.json();
        const assistantData = await assistantRes.json();

        if (instructorData?.instructors?.items) {
          setInstructors(instructorData.instructors.items);
        }

        if (assistantData?.assistants?.items) {
          setAssistants(assistantData.assistants.items);
        }
      } catch (error) {
        console.error("❌ Error fetching staff:", error);
      }
    };

    fetchPeople();
  }, [register]);

  return (
    <div className="space-y-6 w-full bg-white rounded p-5 pt-3 ps-3">
      <p className="text-[#000000D9] font-semibold">Instructor</p>

      <div className="flex gap-5 items-center justify-start">
        {/* Instructor Dropdown */}
        <div className="flex flex-col gap-2 border border-[#0000001A] rounded p-2 w-full">
          <label htmlFor="instructorSelect">Select Instructor</label>
          <select
            id="instructorSelect"
            disabled={disabled}
            className={
              "px-4 py-2 border border-gray-300 rounded shadow-sm" + (disabled ? " opacity-50 cursor-not-allowed" : "")
            }
            onChange={(e) => setValue("instructorIds", [e.target.value], { shouldValidate: true })}
          >
            <option value="">Choose instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Assistant Dropdown */}
        <div className="flex flex-col gap-2 border border-[#0000001A] rounded p-2 w-full">
          <label htmlFor="assistantSelect">Select Assistant (optional)</label>
          <select
            id="assistantSelect"
            disabled={disabled}
            className={
              "px-4 py-2 border border-gray-300 rounded shadow-sm" + (disabled ? " opacity-50 cursor-not-allowed" : "")
            }
            onChange={(e) => setValue("assistantIds", [e.target.value], { shouldValidate: true })}
          >
            <option value="">Choose assistant</option>
            {assistants.map((assistant) => (
              <option key={assistant.id} value={assistant.id}>
                {assistant.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-2 w-[48%]">
        <label className="text-sm font-medium text-gray-700 block">Rating Instructor</label>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Allow Rating on instructor’s performance</p>
          <button
            type="button"
            disabled={false}
            onClick={() => setValue("allowRatingOnInstructor", !isRatingEnabled)}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
              isRatingEnabled ? "bg-violet-600" : "bg-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                isRatingEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorInfo;

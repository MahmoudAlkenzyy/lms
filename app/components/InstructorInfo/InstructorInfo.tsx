"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "@/constants";
import { useSearchParams } from "next/navigation";

interface Person {
  id: string;
  name: string;
}

const InstructorInfo = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [instructors, setInstructors] = useState<Person[]>([]);
  const [assistants, setAssistants] = useState<Person[]>([]);

  const [instructorQuery, setInstructorQuery] = useState("");
  const [assistantQuery, setAssistantQuery] = useState("");

  const [showInstructorList, setShowInstructorList] = useState(false);
  const [showAssistantList, setShowAssistantList] = useState(false);

  const params = useSearchParams();
  const courseId = params.get("id");

  const instructorRef = useRef<HTMLDivElement>(null);
  const assistantRef = useRef<HTMLDivElement>(null);

  const isRatingEnabled = watch("allowRatingOnInstructor") || false;

  useEffect(() => {
    register("instructorIds", { required: "Instructor is required" });
    register("assistantIds");
    register("allowRatingOnInstructor");

    const fetchPeople = async () => {
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

      setInstructors(instructorData?.instructors?.items || []);
      setAssistants(assistantData?.assistants?.items || []);
    };

    fetchPeople();
  }, [register]);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseStaff = async () => {
      try {
        const res = await fetch(`${Backend_Url}/Courses/GetCourseStaff?Id=${courseId}`, {
          headers: {
            Authorization: Fake_Token,
            Accept: "text/plain",
          },
        });

        const data = await res.json();

        if (data?.course?.instructors?.length > 0) {
          const instructor = data.course.instructors[0];
          setValue("instructorIds", [instructor.id], { shouldValidate: true });
          setInstructorQuery(instructor.name);
        }

        if (data?.course?.assistants?.length > 0) {
          const assistant = data.course.assistants[0];
          setValue("assistantIds", [assistant.id]);
          setAssistantQuery(assistant.name);
        }

        if (typeof data.course.allowRatingOnInstructor === "boolean") {
          setValue("allowRatingOnInstructor", data.course.allowRatingOnInstructor);
        }
      } catch (err) {
        console.error("Failed to fetch course staff", err);
      }
    };

    fetchCourseStaff();
  }, [courseId, setValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (instructorRef.current && !instructorRef.current.contains(event.target as Node)) {
        setShowInstructorList(false);
      }
      if (assistantRef.current && !assistantRef.current.contains(event.target as Node)) {
        setShowAssistantList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredInstructors = instructors.filter((p) => p.name.toLowerCase().includes(instructorQuery.toLowerCase()));
  const filteredAssistants = assistants.filter((p) => p.name.toLowerCase().includes(assistantQuery.toLowerCase()));

  return (
    <div className="space-y-6 w-full bg-white rounded-lg p-6 shadow">
      <h2 className="text-lg font-semibold text-gray-800">Instructor Info</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Instructor Field */}
        <div className="w-full relative" ref={instructorRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instructor </label>
          <input
            type="text"
            disabled={disabled}
            value={instructorQuery}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length < instructorQuery.length) {
                setInstructorQuery("");
                setValue("instructorIds", [], { shouldValidate: true });
              } else {
                setInstructorQuery(value);
                setShowInstructorList(true);
              }
            }}
            placeholder="Type to search instructor"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {instructorQuery && (
            <button
              type="button"
              onClick={() => {
                setInstructorQuery("");
                setValue("instructorIds", [], { shouldValidate: true });
              }}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          )}

          {showInstructorList && instructorQuery && (
            <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
              {filteredInstructors.length === 0 ? (
                <li className="px-4 py-2 text-sm text-red-500">No results found</li>
              ) : (
                filteredInstructors.map((i) => (
                  <li
                    key={i.id}
                    onClick={() => {
                      setInstructorQuery(i.name);
                      setValue("instructorIds", [i.id], { shouldValidate: true });
                      setShowInstructorList(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-violet-100 cursor-pointer"
                  >
                    {i.name}
                  </li>
                ))
              )}
            </ul>
          )}
          {errors.instructorIds && (
            <p className="text-sm text-red-500 mt-1">{errors.instructorIds.message as string}</p>
          )}
        </div>

        {/* Assistant Field */}
        <div className="w-full relative" ref={assistantRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assistant (optional)</label>
          <input
            type="text"
            disabled={disabled}
            value={assistantQuery}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length < assistantQuery.length) {
                setAssistantQuery("");
                setValue("assistantIds", [], { shouldValidate: true });
              } else {
                setAssistantQuery(value);
                setShowAssistantList(true);
              }
            }}
            placeholder="Type to search assistant"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {assistantQuery && (
            <button
              type="button"
              onClick={() => {
                setAssistantQuery("");
                setValue("assistantIds", [], { shouldValidate: true });
              }}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              ✖
            </button>
          )}
          {showAssistantList && assistantQuery && (
            <ul className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-md max-h-48 overflow-y-auto">
              {filteredAssistants.length === 0 ? (
                <li className="px-4 py-2 text-sm text-red-500">No results found</li>
              ) : (
                filteredAssistants.map((a) => (
                  <li
                    key={a.id}
                    onClick={() => {
                      setAssistantQuery(a.name);
                      setValue("assistantIds", [a.id]);
                      setShowAssistantList(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-violet-100 cursor-pointer"
                  >
                    {a.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Toggle */}
      <div className="mt-6 space-y-2">
        <label className="text-sm font-medium text-gray-700">Rating Instructor</label>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Allow rating on performance</span>
          <button
            type="button"
            disabled={disabled}
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

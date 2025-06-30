"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "../../../constants";

interface Level {
  id: string;
  name: string;
}

const CourseLevelAddCourse = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    formState: { errors },
    clearErrors,
    setValue,
    watch,
  } = useFormContext();

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectedLevelId = watch("levelId");

  // Auto-clear error when valid level is selected
  useEffect(() => {
    if (selectedLevelId) {
      clearErrors("levelId");
    }
  }, [selectedLevelId, clearErrors]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`${Backend_Url}/Courses/GetCourseLevel`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
        });
        const json = await res.json();
        if (json.isSuccess && json.levels?.items) {
          setLevels(json.levels.items);
        } else {
          setError("Failed to load levels");
        }
      } catch (e) {
        setError("Error fetching levels");
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    register("levelId", {
      required: "Course level is required",
    });
  }, [register]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded shadow p-5 pt-2 ps-2 space-y-3"
    >
      <p className="text-xl font-medium">Course Level</p>

      {loading && <p>Loading levels...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <select
            id="levelId"
            disabled={disabled}
            {...register("levelId", { required: "Course level is required" })}
            className={
              "w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" +
              (disabled ? " opacity-50 cursor-not-allowed" : "")
            }
          >
            <option value="" disabled>
              Select course level
            </option>
            {levels.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.name}
              </option>
            ))}
          </select>

          {errors.levelId && <span className="text-red-500 text-sm">{errors.levelId.message as string}</span>}
        </>
      )}
    </motion.div>
  );
};

export default CourseLevelAddCourse;

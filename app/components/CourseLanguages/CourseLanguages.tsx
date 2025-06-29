"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "@/constants";

interface Language {
  id: string;
  name: string;
}

const CourseLanguages = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedLanguageIds: string[] = watch("coursesLanguages") || [];
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch(`${Backend_Url}/Languages/GetLanguages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({ query: "" }),
        });

        const json = await response.json();

        if (json.isSuccess && json.languages?.items) {
          setAvailableLanguages(json.languages.items);
        } else {
          setError("Failed to load languages");
        }
      } catch (err) {
        console.error("  Error fetching languages:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    register("coursesLanguages", {
      required: "Course language is required",
    });
  }, [register]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId) {
      setValue("coursesLanguages", [selectedId], { shouldValidate: true });
    } else {
      setValue("coursesLanguages", [], { shouldValidate: true });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-5 pt-2 ps-2 space-y-3"
    >
      <p className="text-xl">Course Language</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <select
          value={selectedLanguageIds[0] || ""}
          onChange={handleSelect}
          disabled={disabled}
          className={
            "w-full p-2 border mt-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" +
            (disabled ? " opacity-50 cursor-not-allowed" : "")
          }
        >
          <option value="">Select a language</option>
          {availableLanguages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      )}

      {errors.coursesLanguages && (
        <span className="text-red-500 text-sm">{errors.coursesLanguages.message as string}</span>
      )}
    </motion.div>
  );
};

export default CourseLanguages;

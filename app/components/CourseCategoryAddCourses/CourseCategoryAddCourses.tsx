"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "@/constants";

interface Category {
  id: string;
  name: string;
}

const CourseCategoryAddCourses = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedId: string = (watch("categoryIds")?.[0] as string) || "";
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${Backend_Url}/Categories/GetCategories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({}),
        });

        const json = await response.json();

        if (json.isSuccess && json.categories?.items) {
          setCategories(json.categories.items);
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    register("categoryIds", {
      required: "Course category is required",
    });
  }, [register]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setValue("categoryIds", [selectedId], { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-5 pt-2 ps-2 space-y-3"
    >
      <p className="text-xl font-medium">Course Category</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <select
          id="categoryIds"
          value={selectedId}
          disabled={disabled}
          onChange={handleChange}
          className={
            "w-full p-2 border mt-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" +
            (disabled ? " opacity-50 cursor-not-allowed" : "")
          }
        >
          <option value="" disabled>
            Select course category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}

      {errors.categoryIds && <span className="text-red-500 text-sm">{errors.categoryIds.message as string}</span>}
    </motion.div>
  );
};

export default CourseCategoryAddCourses;

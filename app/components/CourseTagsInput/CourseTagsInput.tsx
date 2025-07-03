"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "@/constants";

interface Tag {
  id: string;
  name: string;
}

const CourseTagsInput = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedTagIds: string[] = watch("courseTags") || [];
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${Backend_Url}/Tags/GetTags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({ query: "" }),
        });

        const json = await response.json();
        // console.log({ tags: json });

        if (json.isSuccess && json.tags?.items) {
          setAvailableTags(json.tags.items);
        } else {
          setError("Failed to load tags");
        }
      } catch (err) {
        console.error("  Error fetching tags:", err);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const addTag = (tag: Tag) => {
    if (selectedTagIds.length >= 10) {
      setError("You can select up to 10 tags only");
      return;
    }

    if (!selectedTagIds.includes(tag.id)) {
      const updated = [...selectedTagIds, tag.id];
      setValue("courseTags", updated, { shouldValidate: true });
      setError(""); // clear error if user is back under limit
    }
  };

  const removeTag = (id: string) => {
    const updated = selectedTagIds.filter((tagId) => tagId !== id);
    setValue("courseTags", updated, { shouldValidate: true });
  };

  useEffect(() => {
    register("courseTags", { required: "At least one tag is required" });
  }, [register]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-5 pt-2 ps-2 space-y-3"
    >
      <p className="text-xl">Course Tags</p>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <>
          <input
            type="text"
            list="tags-list"
            disabled={disabled}
            placeholder="Search and select a tag"
            onChange={(e) => {
              const selectedName = e.target.value;
              const tag = availableTags.find((t) => t.name.toLowerCase() === selectedName.toLowerCase());
              if (tag) {
                addTag(tag);
                e.target.value = "";
              }
            }}
            className={`w-full p-2 border mt-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500
    ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}
  `}
          />
          {selectedTagIds.length >= 10 && <p className="text-yellow-600 text-sm">Maximum of 10 tags allowed</p>}

          <datalist id="tags-list">
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.name} />
            ))}
          </datalist>
        </>
      )}

      {errors.courseTags && <span className="text-red-500 text-sm">{errors.courseTags.message as string}</span>}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTagIds.map((id) => {
          const tag = availableTags.find((t) => t.id === id);
          if (!tag) return null;

          return (
            <div key={id} className="flex items-center gap-1 px-3 py-1 text-sm bg-black text-white rounded">
              <span>{tag.name}</span>
              <button disabled={disabled} onClick={() => removeTag(id)} className="text-violet-600 hover:text-red-500">
                <IoClose className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CourseTagsInput;

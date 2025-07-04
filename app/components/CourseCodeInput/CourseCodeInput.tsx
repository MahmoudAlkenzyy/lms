"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const CourseCodeInput = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const code = watch("code");

  useEffect(() => {
    if (code?.trim()) {
      clearErrors("code");
    }
  }, [code, clearErrors]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-6 pt-3 ps-3 space-y-3"
    >
      <label htmlFor="code" className="text-xl text-black block">
        Course Code
      </label>

      <input
        type="text"
        id="code"
        disabled={disabled}
        {...register("code", {
          required: "Course code is required",
        })}
        placeholder="Enter your course code"
        className={`w-full px-4 py-2 border rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 ${
          disabled ? " !bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
        }`}
      />

      {errors.code && <span className="text-red-500 text-sm">{errors.code.message as string}</span>}
    </motion.div>
  );
};

export default CourseCodeInput;

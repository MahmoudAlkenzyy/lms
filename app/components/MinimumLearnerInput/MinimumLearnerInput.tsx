"use client";
import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const MinimumStudentInput = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-6 pt-3 ps-3 space-y-3"
    >
      <label htmlFor="minEnrollment" className="text-xl text-black block">
        Minimum Student in This Course (optional)
      </label>

      <input
        type="number"
        id="minEnrollment"
        placeholder="Enter your Minimum Student number"
        disabled={disabled}
        {...register("minEnrollment", {
          min: {
            value: 1,
            message: "Minimum student number must be at least 1",
          },
        })}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
      />

      {errors.minEnrollment && <span className="text-red-500 text-sm">{errors.minEnrollment.message as string}</span>}
    </motion.div>
  );
};

export default MinimumStudentInput;

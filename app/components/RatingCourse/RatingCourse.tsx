"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion"; // مكنتش محتاج "motion/react"
import { useFormContext } from "react-hook-form";

const RatingCourse = ({ disabled }: { disabled: boolean }) => {
  const { register, setValue, watch } = useFormContext();

  const isRatingEnabled = watch("allowRatingOnContent") ?? false;

  const toggleRating = () => {
    setValue("allowRatingOnContent", !isRatingEnabled, { shouldValidate: true });
  };

  useEffect(() => {
    register("allowRatingOnContent");
  }, [register]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-6 pt-3 ps-3 space-y-3"
    >
      <label className="text-xl text-black block">Rating course</label>

      <div className="flex justify-between">
        <p className="text-sm text-gray-600">Allow Rating on course performance</p>

        <button
          type="button"
          disabled={disabled}
          onClick={toggleRating}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
            isRatingEnabled && !disabled ? "opacity-50 cursor-not-allowed" : ""
          }"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
              isRatingEnabled ? "translate-x-6" : "translate-x-0"
            } `}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default RatingCourse;

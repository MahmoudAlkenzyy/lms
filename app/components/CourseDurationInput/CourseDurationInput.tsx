"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFormContext, useWatch } from "react-hook-form";

const CourseDurationInput = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    setValue,
    clearErrors,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchedAllowDynamic = useWatch({ control, name: "allowDynamicDuration" });
  const watchedDuration = watch("duration");

  const [isAutoDuration, setIsAutoDuration] = useState(false);

  useEffect(() => {
    if (watchedAllowDynamic !== undefined) {
      setIsAutoDuration(Boolean(watchedAllowDynamic));
    }
  }, [watchedAllowDynamic]);

  useEffect(() => {
    setValue("allowDynamicDuration", isAutoDuration, { shouldValidate: true });
    if (isAutoDuration) {
      setValue("duration", undefined);
      clearErrors("duration");
    }
  }, [isAutoDuration, setValue, clearErrors]);

  useEffect(() => {
    if (watchedDuration && watchedDuration >= 0) {
      clearErrors("duration");
    }
  }, [watchedDuration, clearErrors]);

  const handleToggle = () => {
    setIsAutoDuration((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-6 pt-3 ps-3 space-y-4"
    >
      <label htmlFor="duration" className="text-xl text-black block">
        Course Duration
      </label>

      <input type="hidden" {...register("allowDynamicDuration")} />

      <div className="relative">
        <input
          type="number"
          id="duration"
          min={0}
          step="1"
          placeholder="Enter duration"
          disabled={isAutoDuration || disabled}
          {...register("duration", {
            required: !isAutoDuration ? "Course duration is required" : false,
            min: {
              value: 0,
              message: "Duration must be positive",
            },
            valueAsNumber: true,
          })}
          className={`w-full pr-14 px-4 py-2 border border-gray-300 rounded-md shadow-sm transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 
            ${isAutoDuration ? "bg-gray-100 cursor-not-allowed" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            hide-spinner
          `}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">min</span>
      </div>

      {errors.duration && <span className="text-red-500 text-sm">{errors.duration.message as string}</span>}

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-gray-600">Allow automatic duration</p>
        <button
          type="button"
          disabled={disabled}
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
            isAutoDuration ? "bg-violet-600" : "bg-gray-300"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
              isAutoDuration ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default CourseDurationInput;

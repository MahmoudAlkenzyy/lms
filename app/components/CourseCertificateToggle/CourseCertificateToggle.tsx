"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";

const CourseCertificateToggle = ({ disabled }: { disabled: boolean }) => {
  const { watch, setValue, register } = useFormContext();

  const isPreviewEnabled = watch("hasCertificate") ?? false;
  useEffect(() => {
    setValue("hasCertificate", false); // 👈 أول مرة بس
  }, [setValue]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-6 pt-3 ps-3 space-y-3"
    >
      <label className="text-xl text-black block">Course Certificate</label>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Allow preview certificate</p>

        <button
          type="button"
          onClick={() => setValue("hasCertificate", !isPreviewEnabled)}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
            isPreviewEnabled ? "bg-violet-600" : "bg-gray-300"
          } ${disabled ? " opacity-50 cursor-not-allowed" : ""}`}
          disabled={disabled}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
              isPreviewEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* تأكد إنك تسجل الحقل في الفورم */}
      <input type="hidden" {...register("hasCertificate")} />
    </motion.div>
  );
};

export default CourseCertificateToggle;

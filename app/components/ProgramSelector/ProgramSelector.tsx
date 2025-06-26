"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Backend_Url, Fake_Token } from "@/constants";

interface Program {
  id: string;
  name: string;
}

const ProgramSelector = ({ disabled }: { disabled: boolean }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selectedProgramId: string = watch("programId") || "";
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${Backend_Url}/Programs/GetPrograms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({ query: "" }),
        });

        const data = await response.json();
        if (data.isSuccess && data.programs?.items) {
          setPrograms(data.programs.items);
        } else {
          setError("Failed to load programs");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    register("programId", {
      required: "Program is required",
    });
  }, [register]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue("programId", e.target.value, { shouldValidate: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded shadow p-6 pt-3 ps-3 space-y-3"
    >
      <label htmlFor="programId" className="text-sm font-medium text-gray-700 block">
        Program
      </label>

      {loading ? (
        <p className="text-sm text-gray-500">Loading programs...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          id="programId"
          value={selectedProgramId}
          onChange={handleChange}
          disabled={disabled}
          className={
            "w-full p-2 border mt-1 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" +
            (disabled ? " opacity-50 cursor-not-allowed" : "")
          }
        >
          <option value="" disabled>
            Select a program
          </option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>
      )}

      {errors.programId && <span className="text-sm text-red-500">{errors.programId.message as string}</span>}

      {/* <button
        type="button"
        onClick={() => console.log("Add new program clicked")}
        className={
          "text-sm w-full text-violet-600 hover:underline transition" +
          (disabled ? " opacity-50 cursor-not-allowed" : "")
        }
      >
        + Add new program
      </button> */}
    </motion.div>
  );
};

export default ProgramSelector;

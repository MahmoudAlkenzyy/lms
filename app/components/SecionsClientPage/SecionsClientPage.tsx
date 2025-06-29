"use client";
import React from "react";
import { CiTextAlignLeft } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";
import LessonsTable from "../LessonsTable/LessonsTable";
import { useRouter } from "next/navigation";

const SecionsClientPage = () => {
  return (
    <div className="">
      <LessonsTable />
    </div>
  );
};

export default SecionsClientPage;

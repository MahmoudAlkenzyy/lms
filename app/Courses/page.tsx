"use client";
import { FaPlus } from "react-icons/fa";
import CoursesTable from "../components/CourseTable/CourseTable";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="mx-3">
      <div className="px-4">
        <h2 className="text-2xl mt-3 font-medium">Courses</h2>
        <div className="flex items-center justify-between gap-7  ">
          <p className="text-[#00000087] text-sm">Let’s check your update today.</p>
          <button
            onClick={() => router.push("/Course")}
            className="bg-violet-600 flex items-center gap-1 text-white text-sm px-4 py-2 rounded-md hover:bg-violet-700 transition"
          >
            <FaPlus />
            <p>Add Course</p>
          </button>
        </div>
      </div>
      <CoursesTable />
    </div>
  );
}

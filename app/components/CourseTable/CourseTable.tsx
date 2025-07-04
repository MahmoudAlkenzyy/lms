"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEye, FaEdit, FaTrashAlt, FaCalendarAlt } from "react-icons/fa";
import { Backend_Url, Fake_Token, Files_Url } from "@/constants";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { parseISO, isAfter, isBefore, format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import * as Tooltip from "@radix-ui/react-tooltip";
import Link from "next/link";
const ITEMS_PER_PAGE = 6;

const CoursesTable = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const router = useRouter();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${Backend_Url}/Courses/GetCourses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          Authorization: Fake_Token,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      if (data.isSuccess) {
        const sortedCourses = [...data.courses.items].sort((a, b) => {
          const dateA = new Date(a.createdDate).getTime();
          const dateB = new Date(b.createdDate).getTime();
          return dateB - dateA; // Newest to oldest
        });
        setCourses(sortedCourses);
      } else {
        console.error("API Error:", data.errors);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openDeleteModal = (id: string, name: string) => {
    setSelectedCourseId(id);
    setSelectedCourseName(name);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCourseId) return;

    const toastId = toast.loading("Deleting course...");
    try {
      const res = await fetch(`${Backend_Url}/Courses/DeleteCourse?Id=${selectedCourseId}`, {
        method: "DELETE",
        headers: {
          Accept: "text/plain",
          Authorization: Fake_Token,
        },
      });

      if (!res.ok) throw new Error("Failed to delete course");

      toast.update(toastId, {
        render: "✅ Course deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      fetchCourses();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Delete failed", err);
      toast.update(toastId, {
        render: "Failed to delete course",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const createdAt = course.createdAt ? parseISO(course.createdAt) : null;
    const matchesDateRange =
      (!startDate || (createdAt && isAfter(createdAt, startDate))) &&
      (!endDate || (createdAt && isBefore(createdAt, endDate)));

    return matchesSearch && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-4 px-0 bg-white mt-3 rounded-lg shadow-sm overflow-hidden pe-8">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4 px-4">
        <input
          type="text"
          placeholder="Search by Course Name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <div className="hidden">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => {
              setDateRange(update);
              setCurrentPage(1);
            }}
            isClearable
            calendarClassName="shadow-lg"
            customInput={<CustomDateButton startDate={startDate} endDate={endDate} />}
          />
        </div>
      </div>

      <div className="overflow-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading courses...</div>
        ) : paginatedCourses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No courses found.</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs capitalize text-center text-gray-500">
              <tr>
                <th className="px-4 py-2 text-center ps-4 " colSpan={2}>
                  Course Name
                </th>
                <th className="px-4 py-2">Course Code</th>
                <th className="px-4 py-2">Instructor</th>
                <th className="px-4 py-2">Lessons</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.map((course) => (
                <tr key={course.id} className="border-b text-center border-[#00000021] hover:bg-gray-50 transition">
                  <td
                    className="px-4  py-2 bg "
                    onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)}
                  >
                    {course.coverImage ? (
                      <img
                        src={`${Files_Url}${course.coverImage}`}
                        className="w-10 h-10 rounded-lg overflow-hidden me-auto shadow "
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td
                    onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)}
                    className="px-4 ps-0 py-2 text-start max-w-32"
                  >
                    {" "}
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <span className="cursor-default line-clamp-1">{truncateWords(course.name)}</span>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="top"
                            className="z-50 rounded bg-gray-800 px-3 py-1 text-sm text-white shadow"
                            sideOffset={5}
                          >
                            {course.name}
                            <Tooltip.Arrow className="fill-gray-800" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </td>
                  <td onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)} className="px-4 py-2">
                    {course.code || "—"}
                  </td>
                  <td onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)} className="px-4 py-2">
                    {course.instructors?.join(", ") || "—"}
                  </td>
                  <td onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)} className="px-4 py-2">
                    {course.lessonsCount || 0}
                  </td>
                  <td onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)} className="px-4 py-2">
                    {course.duration || "—"}
                  </td>
                  <td onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)} className="px-4 py-2">
                    {course.level || "—"}
                  </td>
                  <td onClick={() => router.push(`/CoursePreviewPublish?courseid=${course.id}`)} className="px-4 py-2">
                    <span className="bg-[#00E0962B] text-[#00E096] text-nowrap px-3 py-1 rounded-full text-xs font-semibold">
                      {course.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex items-center justify-center gap-3 text-lg text-gray-500">
                    <div className="bg-[#7337FF1A] rounded flex gap-2 p-2">
                      {/* <button
                        onClick={() => router.push(`/CoursePreview?courseid=${course.id}`)}
                        className="text-violet-600 cursor-pointer"
                      >
                        <FaRegEye />
                      </button> */}
                      <button
                        className="text-green-600 cursor-pointer"
                        onClick={() => router.push(`/Course?id=${course.id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer"
                        onClick={() => openDeleteModal(course.id, course.name)}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4 me-5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded-md text-sm border border-gray-300 hover:bg-violet-100 transition ${
                currentPage === idx + 1 ? "bg-violet-500 text-white border-violet-500" : "text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        courseName={selectedCourseName || ""}
      />
    </div>
  );
};

export default CoursesTable;
const CustomDateButton = React.forwardRef(
  (
    {
      value,
      onClick,
      startDate,
      endDate,
    }: {
      value?: string;
      onClick?: () => void;
      startDate?: Date | null;
      endDate?: Date | null;
    },
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-red-500 text-sm hover:bg-gray-100 focus:outline-none"
    >
      <FaCalendarAlt className="text-violet-600" />
      {startDate && endDate
        ? `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
        : "Select Date Range"}
    </button>
  )
);
CustomDateButton.displayName = "CustomDateButton";
function truncateWords(text: string, wordLimit = 4): string {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + " ...";
}

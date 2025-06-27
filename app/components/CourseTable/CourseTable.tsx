"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Backend_Url, Fake_Token } from "@/constants";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 6;

const CoursesTable = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setCourses(data.courses.items);
      } else {
        console.error("❌ API Error:", data.errors);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
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
      console.error("❌ Delete failed", err);
      toast.update(toastId, {
        render: "❌ Failed to delete course",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const filteredCourses = courses.filter((course) => course.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const paginatedCourses = filteredCourses.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-4 my-5 px-0 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4 px-4">
        <input
          type="text"
          placeholder="Search by Course Name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="overflow-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading courses...</div>
        ) : paginatedCourses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No courses found.</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase text-center text-gray-500">
              <tr>
                <th className="px-4 py-2">Course Name</th>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Instructor</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.map((course) => (
                <tr key={course.id} className="border-b text-center border-[#00000021] hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{course.name}</td>
                  <td className="px-4 py-2">{course.id}</td>
                  <td className="px-4 py-2">{course.instructors?.length > 0 ? course.instructors.join(", ") : "—"}</td>
                  <td className="px-4 py-2">{course.duration || "—"}</td>
                  <td className="px-4 py-2">{course.level || "—"}</td>
                  <td className="px-4 py-2">
                    <span className="bg-[#00E0962B] text-[#00E096] px-3 py-1 rounded-full text-xs font-semibold">
                      {course.status || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex items-center justify-center gap-3 text-lg text-gray-500">
                    <div className="bg-[#7337FF1A] rounded flex gap-2 p-2">
                      <button className="text-violet-600 cursor-pointer">
                        <FaRegEye />
                      </button>
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

      {/* Pagination */}
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

      {/* Delete Confirmation Modal */}
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

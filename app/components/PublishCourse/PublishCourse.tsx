"use client";

import React, { useEffect, useState } from "react";
import { Backend_Url, Fake_Token, Files_Url } from "@/constants";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { GrLanguage } from "react-icons/gr";
import { MdOutlineCloudDownload } from "react-icons/md";
import { PiWarningOctagonLight } from "react-icons/pi";
import CurriculumBarPreview from "../CurriculumPublish/CurriculumPublish";
import { IoVideocamOutline } from "react-icons/io5";
import { CiMobile2 } from "react-icons/ci";
import { FaEdit, FaGraduationCap } from "react-icons/fa";
import { toast } from "react-toastify";
interface StaffMember {
  id: string;
  name: string;
}

interface CourseBasicInfo {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  outcome: string;
  prerequisites: string;
  status: string;
}

interface CourseStaff {
  instructors: StaffMember[];
  assistants: StaffMember[];
  allowRatingOnInstructor: boolean;
  allowRatingOnAssistant: boolean;
}

interface CourseData {
  code: string;
  duration: number;
  hasCertificate: boolean;
  allowRatingOnContent: boolean;
  allowDynamicDuration: boolean;
  level: { id: string; name: string };
  categories: { id: string; name: string }[];
  program: { id: string; name: string };
  coursesTags: { id: string; name: string }[];
  coursesLanguages: { id: string; name: string }[];
}

const PublishCourse = () => {
  const [basicInfo, setBasicInfo] = useState<CourseBasicInfo | null>(null);
  const [staff, setStaff] = useState<CourseStaff | null>(null);
  const [metaData, setMetaData] = useState<CourseData | null>(null);
  const [attachmentCount, setAttachmentCount] = useState(0);
  const [videoDuration, setVideoDuration] = useState("00h 00m");
  const params = useSearchParams();
  const router = useRouter();
  const courseId = params.get("courseid");
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [basicRes, staffRes, dataRes] = await Promise.all([
          fetch(`${Backend_Url}/Courses/GetCourseBasicInfo?Id=${courseId}`, {
            headers: {
              Accept: "text/plain",
              Authorization: Fake_Token,
            },
          }),
          fetch(`${Backend_Url}/Courses/GetCourseStaff?Id=${courseId}`, {
            headers: {
              Accept: "text/plain",
              Authorization: Fake_Token,
            },
          }),
          fetch(`${Backend_Url}/Courses/GetCourseData?Id=${courseId}`, {
            headers: {
              Accept: "text/plain",
              Authorization: Fake_Token,
            },
          }),
        ]);

        const basicData = await basicRes.json();
        const staffData = await staffRes.json();
        const courseData = await dataRes.json();

        if (basicData?.isSuccess) setBasicInfo(basicData.course);
        if (staffData?.isSuccess) setStaff(staffData.course);
        if (courseData?.isSuccess) setMetaData(courseData.course);
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
    };

    fetchAll();
  }, []);
  const handlePublish = async () => {
    if (!courseId) return toast.error("Missing course ID");

    const toastId = toast.loading("Publishing course...");

    try {
      const res = await fetch(`${Backend_Url}/Courses/PublishCourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
          Authorization: Fake_Token,
        },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) throw new Error("Failed to publish course");

      toast.update(toastId, {
        render: " Course published successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      router.push("/Courses");
    } catch (err) {
      console.error("Publish error:", err);
      toast.update(toastId, {
        render: " Failed to publish course",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="min-h-screen bg-[#faf7ff] ">
      <div className="py-2 px-4 sticky  top-[70px] z-50 bg-black pb-5 text-white rounded-b-lg justify-start gap-3">
        <div className="flex gap-4 items-center   justify-between ">
          <div className="">
            <h2 className="text-2xl">View Course</h2>
            <p className="text-[#FFFFFFB0]">Let’s check your update today.</p>
          </div>
          <div className=" flex gap-5">
            <button
              type="button"
              onClick={() => router.push(`/Course?id=${courseId}`)}
              className="px-6 py-1 text-sm text-black flex gap-2 items-center bg-white rounded transition-colors duration-200 cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded transition-colors duration-200 cursor-pointer"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
      <div className=" p-6 px-4">
        <h2 className="text-xl pb-4">
          <span className="text-[#0006]">Courses </span>/ {basicInfo?.name}
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2  flex flex-col gap-7">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm space-y-4">
              {basicInfo?.coverImage && (
                <div className="w-full aspect-video relative rounded-xl overflow-hidden h-56 object-cover">
                  <Image src={`${Files_Url}${basicInfo.coverImage}`} alt="Course Cover" fill className="object-cover" />
                </div>
              )}

              <h2 className="text-4xl font-medium ">{basicInfo?.name}</h2>

              {basicInfo?.description && (
                <div
                  className="text-gray-700 font-medium"
                  dangerouslySetInnerHTML={{ __html: basicInfo.description }}
                />
              )}

              <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                  {staff?.instructors.map((instr) => (
                    <div key={instr.id} className="flex items-center gap-2 b px-3 py-2 rounded-md">
                      <div className="w-10 h-10 flex items-center justify-center font-semibold">
                        <img className="w-10 h-10 rounded-lg" src={"/images/avatar.png"} />
                      </div>
                      <span className="text-sm text-gray-800">{instr.name}</span>
                    </div>
                  ))}
                  {/* {staff?.assistants.map((asst) => (
                    <div key={asst.id} className="flex items-center gap-2 bg-[#faf7ff] px-3 py-2 rounded-md">
                      <div className="w-8 h-8   flex items-center justify-center font-semibold">
                        <img className="w-8 h-8 rounded-lg" src={"/images/avatar.png"} />
                      </div>
                      <span className="text-sm text-gray-800">{asst.name}</span>
                    </div>
                  ))} */}
                </div>
              </div>
              <div className="text-[#000000A6] flex  items-center gap-7">
                <div className="flex gap-2 items-center">
                  <PiWarningOctagonLight size={21} className="text-[#7337FF]" />
                  <p>Last updated 2/2025</p>
                </div>
                {Array.isArray(metaData?.coursesLanguages) && metaData.coursesLanguages.length > 0 && (
                  <div className=" flex  items-center">
                    <h3 className="text-md font-semibold text-gray-800 ">
                      <GrLanguage size={18} className="text-[#7337FF]" />
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {metaData.coursesLanguages.map((lang) => (
                        <span key={lang.id} className=" text-xs px-3 py-1 rounded-full">
                          {lang.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm space-y-4">
              <h2 className="text-2xl font-semibold">What you’ll learn</h2>
              {basicInfo?.outcome && (
                <div>
                  <div className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: basicInfo.outcome }} />
                </div>
              )}
            </div>
            <CurriculumBarPreview setAttachmentCount={setAttachmentCount} setVideoDuration={setVideoDuration} />
          </div>
          <div className="">
            <div className="bg-white flex flex-col items-center  justify-center p-4 md:p-5 rounded-xl shadow-sm space-y-4">
              <Image
                height={300}
                width={300}
                className=" rounded-xl w-full   "
                alt="placeholder"
                src={"/images/VideoPlay.png"}
              />
              <div className="w-full bg-[#7337FF] text-white p-3 rounded-lg hover:bg-[#7337FF99] text-center">
                Enroll now
              </div>
              <div className="w-full text-[#000000CC] flex flex-col gap-4 ">
                <h3 className="text-lg font-semibold text-black">This course includes:</h3>
                <p className="flex gap-2 items-center">
                  <IoVideocamOutline size={24} />
                  {videoDuration} hours on demand video
                </p>
                <p className="flex gap-2 items-center">
                  <MdOutlineCloudDownload size={24} />
                  {attachmentCount} Downloadable resources
                </p>
                <p className="flex gap-2 items-center">
                  <CiMobile2 size={24} /> Access on mobile and TV
                </p>
                {metaData?.hasCertificate && (
                  <p className="flex gap-2 items-center">
                    <FaGraduationCap size={24} /> Certificate of completion
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishCourse;

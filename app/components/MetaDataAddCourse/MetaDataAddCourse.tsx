"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import CourseLevelAddCourse from "@/app/components/CourseLevelAddCourse/CourseLevelAddCourse";
import CourseCategoryAddCourses from "@/app/components/CourseCategoryAddCourses/CourseCategoryAddCourses";
import CourseTagsInput from "@/app/components/CourseTagsInput/CourseTagsInput";
import RatingCourse from "@/app/components/RatingCourse/RatingCourse";
import CourseDurationInput from "@/app/components/CourseDurationInput/CourseDurationInput";
import CourseCertificateToggle from "@/app/components/CourseCertificateToggle/CourseCertificateToggle";
import ProgramSelector from "@/app/components/ProgramSelector/ProgramSelector";
import CourseCodeInput from "@/app/components/CourseCodeInput/CourseCodeInput";
import CourseLanguages from "@/app/components/CourseLanguages/CourseLanguages";
import { Fake_Token } from "../../../constants";

const MetaDataAddCourse = ({ step, courseId, disabled }: { step: string; courseId: string; disabled: boolean }) => {
  const { reset } = useFormContext();

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      try {
        const response = await fetch(`https://qulms.runasp.net/api/Courses/GetCourseData?Id=${courseId}`, {
          headers: {
            Accept: "text/plain",
            Authorization: Fake_Token,
          },
        });

        const data = await response.json();
        console.log({ meta: data });
        if (data.isSuccess && data.course) {
          const course = data.course;
          console.log(course.coursesTags);

          reset({
            categoryIds: course.categories?.map((c: any) => c.id) || [],
            levelId: course.level?.id || "",
            allowDynamicDuration: course.allowDynamicDuration || false,
            coursesTags: course.coursesTags?.map((t: any) => t.id) || [],
            allowRatingOnContent: course.allowRatingOnContent || false,
            code: course.code || "",
            duration: course.duration || "",
            hasCertificate: course.hasCertificate || false,
            programId: course.program?.id || "",
            coursesLanguages: course.coursesLanguages?.map((l: any) => l.id) || [],
          });
        }
      } catch (err) {
        console.error("❌ Failed to load course metadata:", err);
      }
    };

    fetchCourseData();
  }, [courseId, reset]);

  return (
    <form className="flex flex-col gap-7">
      <CourseCategoryAddCourses disabled={disabled} />
      <CourseLevelAddCourse disabled={disabled} />
      <CourseTagsInput disabled={disabled} />
      <RatingCourse disabled={disabled} />
      <CourseCodeInput disabled={disabled} />
      <CourseDurationInput disabled={disabled} />
      <CourseLanguages disabled={disabled} />
      <CourseCertificateToggle disabled={disabled} />
      <ProgramSelector disabled={disabled} />
    </form>
  );
};

export default MetaDataAddCourse;

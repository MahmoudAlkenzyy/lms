"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { CiTextAlignLeft } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";

import BasicInfoAddCourses from "@/app/components/BasicInfoAddCourses/BasicInfoAddCourses";
import ContentAddCourses from "@/app/components/CurriculumAddCourses/CurriculumAddCourses";
import CourseLevelAddCourse from "@/app/components/CourseLevelAddCourse/CourseLevelAddCourse";
import CourseCategoryAddCourses from "@/app/components/CourseCategoryAddCourses/CourseCategoryAddCourses";
import InstructorInfo from "@/app/components/InstructorInfo/InstructorInfo";
import CourseTagsInput from "@/app/components/CourseTagsInput/CourseTagsInput";
import RatingCourse from "@/app/components/RatingCourse/RatingCourse";
import CourseDurationInput from "@/app/components/CourseDurationInput/CourseDurationInput";
import CourseCertificateToggle from "@/app/components/CourseCertificateToggle/CourseCertificateToggle";
import ProgramSelector from "@/app/components/ProgramSelector/ProgramSelector";
import CourseCodeInput from "@/app/components/CourseCodeInput/CourseCodeInput";
import CourseLanguages from "@/app/components/CourseLanguages/CourseLanguages";
import { toast } from "react-toastify";
import { createStepConfigs } from "@/app/configs/courseStepsConfig";
import { Backend_Url, Fake_Token } from "@/constants";

export default function AddCoursePageClient() {
  const basicInfoForm = useForm();
  const sidePanelForm = useForm();
  const instructorForm = useForm();
  const contentForm = useForm();

  const [step, setStep] = useState("new");
  const [courseId, setCourseId] = useState("");

  const searchParams = useSearchParams();
  const courseIdFromURL = searchParams.get("id");

  useEffect(() => {
    const fetchCourseById = async () => {
      if (!courseIdFromURL) return;

      try {
        const response = await fetch(`${Backend_Url}/Courses/GetCourseBasicInfo?Id=${courseIdFromURL}`, {
          method: "GET",
          headers: {
            Accept: "text/plain",
            Authorization: Fake_Token,
          },
        });

        const data = await response.json();

        if (data.isSuccess && data.course) {
          setCourseId(data.course.id);
          setStep(data.course.status || "new");
        } else {
          console.warn("❌ Course not found, starting fresh.");
          setStep("new");
        }
      } catch (error) {
        console.error("❌ Error loading course:", error);
        setStep("new");
      }
    };

    fetchCourseById();
  }, [courseIdFromURL]);

  const stepConfigs = createStepConfigs(basicInfoForm, sidePanelForm, instructorForm, contentForm);
  const activeStepConfig = stepConfigs.find((s) => s.step === step);

  const handleAllSubmits = async () => {
    if (!activeStepConfig) return;

    const isValid = await activeStepConfig.form.trigger();
    if (isValid) {
      await activeStepConfig.form.handleSubmit(async (data) => {
        const toastId = toast.loading("Saving your course...");
        try {
          await activeStepConfig.onSubmit(data, {
            setStep,
            setCourseId,
            courseId,
            Backend_Url,
            Fake_Token,
          });

          toast.update(toastId, {
            render: "✅ Saved successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (err) {
          console.error("❌ Submission error:", err);
          toast.update(toastId, {
            render: "❌ Error saving data",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      })();
    }
  };

  return (
    <div className="pb-8">
      {/* Sticky Header */}
      <div className="py-2 px-4 sticky mt-3 -top-[16px] z-50 bg-black text-white flex flex-wrap items-center rounded-lg justify-start gap-6">
        <CiTextAlignLeft />
        <div>
          <h2 className="text-xl">Add Courses</h2>
          <p className="text-xs text-[#FFFFFFB0]">let's check your update today.</p>
        </div>
        <div className="flex text-sm items-center gap-2 bg-[#FFFFFF14] rounded p-[2px]">
          <IoCheckmark size={18} />
          <p>Changes saved 2 min ago</p>
        </div>
        <div className="flex gap-4 items-center w-full justify-end">
          <button
            type="button"
            onClick={handleAllSubmits}
            className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc] transition-colors"
          >
            Save to draft
          </button>
        </div>
      </div>

      <div className="flex mt-4 gap-7">
        <div className="flex-col flex gap-7 w-2/3">
          <FormProvider {...basicInfoForm}>
            <form>
              <BasicInfoAddCourses disabled={step !== "new"} />
            </form>
          </FormProvider>

          <FormProvider {...instructorForm}>
            <form>
              <InstructorInfo disabled={step !== "Draft-MetaData"} />
            </form>
          </FormProvider>

          <FormProvider {...contentForm}>
            <form>
              <ContentAddCourses id={courseId} disabled={step !== "Draft-StaffInfo"} />
            </form>
          </FormProvider>
        </div>

        <div className="w-1/3 gap-7 flex flex-col">
          <FormProvider {...sidePanelForm}>
            <form className="flex flex-col gap-7">
              <CourseCategoryAddCourses disabled={step !== "Draft-BasicInfo"} />
              <CourseLevelAddCourse disabled={step !== "Draft-BasicInfo"} />
              <CourseTagsInput disabled={step !== "Draft-BasicInfo"} />
              <RatingCourse disabled={step !== "Draft-BasicInfo"} />
              <CourseCodeInput disabled={step !== "Draft-BasicInfo"} />
              <CourseDurationInput disabled={step !== "Draft-BasicInfo"} />
              <CourseLanguages disabled={step !== "Draft-BasicInfo"} />
              <CourseCertificateToggle disabled={step !== "Draft-BasicInfo"} />
              <ProgramSelector disabled={step !== "Draft-BasicInfo"} />
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

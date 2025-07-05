"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import BasicInfoAddCourses from "@/app/components/BasicInfoAddCourses/BasicInfoAddCourses";
import MetaDataAddCourse from "@/app/components/MetaDataAddCourse/MetaDataAddCourse";
import InstructorInfo from "@/app/components/InstructorInfo/InstructorInfo";
import ContentAddCourses from "@/app/components/CurriculumAddCourses/CurriculumAddCourses";

import { Backend_Url, Fake_Token } from "@/constants";

export default function UpdateCoursePage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");

  const basicInfoForm = useForm();
  const metaDataForm = useForm();
  const instructorForm = useForm();
  const contentForm = useForm();

  const [step, setStep] = useState("");

  const handleAllSubmits = async () => {
    const forms = [
      { name: "Basic Info", form: basicInfoForm, submit: submitBasicInfo },
      { name: "MetaData", form: metaDataForm, submit: submitMetaData },
      { name: "Instructor", form: instructorForm, submit: submitInstructor },
      //   { name: "Content", form: contentForm, submit: submitContent },
    ];

    for (const section of forms) {
      const isValid = await section.form.trigger();
      if (!isValid) {
        toast.error(`Please complete ${section.name}`);
        return;
      }

      await section.form.handleSubmit(section.submit)();
    }

    toast.success("All data saved successfully!");
  };

  const submitBasicInfo = async (data: any) => {
    const formData = new FormData();
    formData.append("Name", data.Name);
    formData.append("Description", data.Description ?? "");
    formData.append("Outcome", data.Outcome ?? "");
    formData.append("Prerequisites", data.Prerequisites ?? "");
    formData.append("Id", courseId || "");

    if (data.CoverImage instanceof File) {
      formData.append("CoverImage", data.CoverImage);
    }
    const res = await fetch(`${Backend_Url}/Courses/UpdateCourse`, {
      method: "POST",
      headers: { Authorization: Fake_Token },
      body: formData,
    });

    const result = await res.json();
    if (!result.isSuccess) throw new Error(result.message || "Failed to update basic info");

    setStep(result.status);
  };

  const submitMetaData = async (data: any) => {
    const res = await fetch(`${Backend_Url}/Courses/AddCourseData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Fake_Token,
      },
      body: JSON.stringify({
        ...data,
        id: courseId,
        duration: Number(data.duration),
        minEnrollment: 0,
      }),
    });

    const result = await res.json();
    if (!result.isSuccess) throw new Error(result.message || "Failed to update metadata");

    setStep(result.status);
  };

  const submitInstructor = async (data: any) => {
    const res = await fetch(`${Backend_Url}/Courses/AddCourseStaff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Fake_Token,
      },
      body: JSON.stringify({
        id: courseId,
        instructorIds: data.instructorIds || [],
        assistantIds: data.assistantIds || [],
        allowRatingOnInstructor: data.allowRatingOnInstructor || false,
        allowRatingOnAssistant: true,
      }),
    });

    const result = await res.json();
    if (!result.isSuccess) throw new Error(result.message || "Failed to update instructors");

    setStep(result.status);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="py-2 px-4 sticky pb-3 top-[70px] z-50 bg-black text-white flex flex-wrap items-center rounded-b-lg justify-start gap-3">
        <h2 className="text-xl font-semibold">Edit Course</h2>
        <button
          type="button"
          onClick={handleAllSubmits}
          className="px-6 py-1 ms-auto text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc] transition-colors"
        >
          Save to Draft
        </button>
      </div>

      {/* Main layout */}
      <div className="flex mt-4 mx-2 gap-7">
        <div className="flex-col flex gap-7 w-2/3">
          <FormProvider {...basicInfoForm}>
            <form>
              <BasicInfoAddCourses setStep={setStep} setCourseId={() => {}} disabled={false} />
            </form>
          </FormProvider>

          <FormProvider {...instructorForm}>
            <form>
              <InstructorInfo disabled={false} />
            </form>
          </FormProvider>

          <FormProvider {...contentForm}>
            <form>
              <ContentAddCourses id={courseId || ""} disabled={false} />
            </form>
          </FormProvider>
        </div>

        <div className="w-1/3 gap-7 flex flex-col">
          <FormProvider {...metaDataForm}>
            <MetaDataAddCourse disabled={false} courseId={courseId || ""} step={step} />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

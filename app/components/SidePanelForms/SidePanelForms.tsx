import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import CourseCategoryAddCourses from "../CourseCategoryAddCourses/CourseCategoryAddCourses";
import CourseLevelAddCourse from "../CourseLevelAddCourse/CourseLevelAddCourse";
import CourseTagsInput from "../CourseTagsInput/CourseTagsInput";
import RatingCourse from "../RatingCourse/RatingCourse";
import CourseCodeInput from "../CourseCodeInput/CourseCodeInput";
import CourseDurationInput from "../CourseDurationInput/CourseDurationInput";
import CourseLanguages from "../CourseLanguages/CourseLanguages";
import CourseCertificateToggle from "../CourseCertificateToggle/CourseCertificateToggle";
import ProgramSelector from "../ProgramSelector/ProgramSelector";

interface Props {
  step: string;
  form: UseFormReturn<any>;
}

export default function SidePanelForms({ step, form }: Props) {
  return (
    <FormProvider {...form}>
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
  );
}

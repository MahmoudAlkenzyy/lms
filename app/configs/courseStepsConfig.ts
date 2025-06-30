// configs/courseStepsConfig.ts

import { UseFormReturn } from "react-hook-form";

export interface StepConfig {
  step: string;
  form: UseFormReturn<any>;
  onSubmit: (
    data: Record<string, any>,
    context: {
      setStep: (step: string) => void;
      setCourseId: (id: string) => void;
      courseId: string;
      Backend_Url: string;
      Fake_Token: string;
    }
  ) => Promise<void>;
}

export const createStepConfigs = (
  basicInfoForm: UseFormReturn<any>,
  sidePanelForm: UseFormReturn<any>,
  instructorForm: UseFormReturn<any>,
  contentForm: UseFormReturn<any>
): StepConfig[] => {
  return [
    {
      step: "new",
      form: basicInfoForm,
      onSubmit: async (data, { setStep, setCourseId, Backend_Url, Fake_Token }) => {
        const formData = new FormData();
        formData.append("Name", data.Name);
        formData.append("Description", data.Description ?? "");
        formData.append("Outcome", data.Outcome ?? "");
        formData.append("Prerequisites", data.Prerequisites ?? "");
        if (data.CoverImage instanceof File) {
          formData.append("CoverImage", data.CoverImage);
        }

        const res = await fetch(`${Backend_Url}/Courses/CreateCourse`, {
          method: "POST",
          headers: { Authorization: Fake_Token },
          body: formData,
        });

        const result = await res.json();
        if (!result.isSuccess) throw new Error(result.message || "Failed to create course");

        setCourseId(result.id);
        setStep(result.status);
      },
    },
    {
      step: "Draft-BasicInfo",
      form: sidePanelForm,
      onSubmit: async (data, { setStep, courseId, Backend_Url, Fake_Token }) => {
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
        if (!result.isSuccess) throw new Error(result.message || "Failed to save metadata");

        setStep(result.status);
      },
    },
    {
      step: "Draft-MetaData",
      form: instructorForm,
      onSubmit: async (data, { setStep, courseId, Backend_Url, Fake_Token }) => {
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
            allowRatingOnInstructor: data.instructorAllowRating || false,
            allowRatingOnAssistant: true,
          }),
        });

        const result = await res.json();
        if (!result.isSuccess) throw new Error(result.message || "Failed to save instructors");

        setStep(result.status);
      },
    },
    {
      step: "Draft-StaffInfo",
      form: contentForm,
      onSubmit: async (data, { setStep, courseId, Backend_Url, Fake_Token }) => {
        const res = await fetch(`${Backend_Url}/Courses/AddCourseContent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Fake_Token,
          },
          body: JSON.stringify({
            ...data,
            id: courseId,
          }),
        });

        const result = await res.json();
        if (!result.isSuccess) throw new Error(result.message || "Failed to save content");

        setStep(result.status);
      },
    },
  ];
};

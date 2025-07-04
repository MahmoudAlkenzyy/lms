"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { CiTextAlignLeft } from "react-icons/ci";
import { IoCheckmark } from "react-icons/io5";

import BasicInfoAddCourses from "@/app/components/BasicInfoAddCourses/BasicInfoAddCourses";
import ContentAddCourses from "@/app/components/CurriculumAddCourses/CurriculumAddCourses";
import InstructorInfo from "@/app/components/InstructorInfo/InstructorInfo";

import { toast } from "react-toastify";
import { createStepConfigs } from "@/app/configs/courseStepsConfig";
import { Backend_Url, Fake_Token } from "@/constants";
import MetaDataAddCourse from "../MetaDataAddCourse/MetaDataAddCourse";

export default function AddCoursePageClient() {
  const basicInfoForm = useForm();
  const sidePanelForm = useForm();
  const instructorForm = useForm();
  const contentForm = useForm();

  const [step, setStep] = useState("new");
  const [courseId, setCourseId] = useState("");

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
            render: " Saved successfully!",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } catch (err) {
          console.error(err);
          toast.update(toastId, {
            render: err ? `${err}` : "  Error saving data",
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
      <div className="py-2 px-4 sticky pb-3  top-[70px] z-50 bg-black text-white flex flex-wrap items-center rounded-b-lg justify-start gap-3">
        <CiTextAlignLeft />
        <div>
          <h2 className="text-xl">Add Courses</h2>
          <p className="text-xs text-[#FFFFFFB0]">let's check your update today.</p>
        </div>

        <button
          type="button"
          onClick={handleAllSubmits}
          className="px-6 py-1 ms-auto text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc] transition-colors"
        >
          Save to draft
        </button>
      </div>

      <div className="flex mt-4 mx-2 gap-7 ">
        <div className="flex-col flex gap-7 w-2/3">
          <FormProvider {...basicInfoForm}>
            <form>
              <BasicInfoAddCourses setCourseId={setCourseId} setStep={setStep} disabled={step !== "new"} />
            </form>
          </FormProvider>

          <FormProvider {...instructorForm}>
            <form>
              <InstructorInfo disabled={step !== "Draft-MetaData"} />
            </form>
          </FormProvider>

          <FormProvider {...contentForm}>
            <form>
              <ContentAddCourses
                id={courseId}
                disabled={step !== "Draft-StaffInfo" && step !== "Draft" && step !== "Published"}
              />
            </form>
          </FormProvider>
        </div>

        <div className="w-1/3 gap-7 flex flex-col ">
          <FormProvider {...sidePanelForm}>
            <MetaDataAddCourse courseId={courseId} step={step} />
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

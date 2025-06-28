"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import FileUploader from "@/app/components/FileUploader/FileUploader";
import Textarea from "@/app/components/Textarea/Textarea";
import CurriculumBar from "@/app/components/CurriculumBar/CurriculumBar";
import { Backend_Url, Fake_Token } from "@/constants";
import { toast } from "react-toastify";

export function LessonsClientPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");
  const lessonId = searchParams.get("lessonid");

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      intro: "",
      video: "",
      videoPlaceholder: "",
      description: "",
      itemImages: [
        { image: "", altText: "", description: "" },
        { image: "", altText: "", description: "" },
      ],
    },
  });

  const fetchLessonData = async (lessonId: string) => {
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${lessonId}`, {
        headers: { Authorization: Fake_Token },
      });
      const data = await res.json();
      if (data.lesson) {
        reset({
          intro: data.lesson.intro ?? "",
          video: data.lesson.video ?? "",
          videoPlaceholder: data.lesson.videoPlaceholder ?? "",
          description: data.lesson.description ?? "",
          itemImages: data.lesson.itemImages ?? [
            { image: "", altText: "", description: "" },
            { image: "", altText: "", description: "" },
          ],
        });
      }
    } catch (err) {
      console.error("❌ Failed to fetch lesson data", err);
    }
  };

  useEffect(() => {
    if (lessonId) fetchLessonData(lessonId);
  }, [lessonId]);

  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        lessonId,
        intro: formData.intro,
        video: formData.video,
        videoPlaceholder: formData.videoPlaceholder,
        description: formData.description,
        itemImages: formData.itemImages.map((item: any) => ({
          image: item.image,
          altText: "",
          description: item.description,
        })),
      };

      const res = await fetch(`${Backend_Url}/Lessons/CreateLessonItems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: Fake_Token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("❌ Failed to save lesson");

      toast.success("✅ Lesson saved successfully");
      setRefetchTrigger((n) => n + 1);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error saving lesson");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <div className="py-2 px-4 sticky mt-3 -top-[16px] z-90 bg-black text-white flex flex-wrap items-center rounded-lg justify-between">
        <div>
          <h2 className="text-xl">Add Courses</h2>
          <p className="text-xs text-[#FFFFFFB0]">Let's check your update today.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc]"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex mt-4 gap-7">
        <div className="w-2/3 flex flex-col gap-7">
          {lessonId ? (
            <>
              <Textarea {...register("intro")} id="intro" placeholder="Lesson intro" />

              <div className="flex flex-col p-3 bg-white border shadow rounded-xl border-[#00000029] gap-3">
                <Controller
                  control={control}
                  name="video"
                  render={({ field }) => (
                    <FileUploader
                      id="video"
                      type="video"
                      bg="/images/uploadImageBg.png"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {/* <Textarea {...register("videoPlaceholder")} id="videoPlaceholder" placeholder="Video Placeholder" /> */}
                <Textarea {...register("description")} id="description" placeholder="Lesson description" />
              </div>

              <div className="flex gap-3">
                {[0, 1].map((i) => (
                  <div className="flex flex-col w-full gap-2" key={i}>
                    <Controller
                      control={control}
                      name={`itemImages.${i}.image`}
                      render={({ field }) => (
                        <FileUploader
                          id={`itemImages${i}-image`}
                          type="image"
                          bg="/images/uploadImageBg.png"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Textarea
                      {...register(`itemImages.${i}.description`)}
                      id={`itemImages.${i}.description`}
                      placeholder="Image description"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-sm">Select a lesson to view/edit its data</div>
          )}
        </div>

        <div className="w-1/3">
          {courseId ? (
            <CurriculumBar
              courseId={courseId}
              currentLessonId={lessonId ?? ""}
              onLessonClick={(id) => fetchLessonData(id)}
              refetchTrigger={refetchTrigger}
            />
          ) : (
            <p className="text-sm text-red-500">Course ID not found in URL.</p>
          )}
        </div>
      </div>
    </form>
  );
}

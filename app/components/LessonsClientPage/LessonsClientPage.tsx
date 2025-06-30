"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import FileUploader from "@/app/components/FileUploader/FileUploader";
import Textarea from "@/app/components/Textarea/Textarea";
import CurriculumBar from "@/app/components/CurriculumBar/CurriculumBar";
import { Backend_Url, Fake_Token, Files_Url } from "@/constants";
import { toast } from "react-toastify";

export function LessonsClientPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");
  const lessonId = searchParams.get("lessonid");

  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      intro: "",
      video: null,
      videoPlaceholder: null,
      description: "",
      videoPreview: "",
      videoPlaceholderPreview: "",
      itemImages: [
        { image: null, description: "", previewUrl: "" },
        { image: null, description: "", previewUrl: "" },
      ],
    },
  });

  const fetchLessonData = async (id: string) => {
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${id}`, {
        headers: { Authorization: Fake_Token },
      });
      const data = await res.json();

      if (data.lesson) {
        reset({
          intro: data.lesson.intro ?? "",
          video: null,
          videoPreview: data.lesson.video ? `${Files_Url}${data.lesson.video}` : "",
          videoPlaceholder: null,
          videoPlaceholderPreview: data.lesson.videoPlaceholder ? `${Files_Url}${data.lesson.videoPlaceholder}` : "",
          description: data.lesson.description ?? "",
          itemImages: [
            {
              image: null,
              description: data.lesson.itemImages?.[0]?.description ?? "",
              previewUrl: data.lesson.itemImages?.[0]?.url ? `${Files_Url}${data.lesson.itemImages[0].url}` : "",
            },
            {
              image: null,
              description: data.lesson.itemImages?.[1]?.description ?? "",
              previewUrl: data.lesson.itemImages?.[1]?.url ? `${Files_Url}${data.lesson.itemImages[1].url}` : "",
            },
          ],
        });
        setActiveLessonId(id);
      }
    } catch (err) {
      console.error("Failed to fetch lesson data", err);
    }
  };

  useEffect(() => {
    if (lessonId) fetchLessonData(lessonId);
  }, [lessonId]);
  const onSubmit = async (formData: any) => {
    try {
      const form = new FormData();

      form.append("LessonId", lessonId || "");
      form.append("Name", formData.name);
      form.append("Intro", formData.intro);
      form.append("Order", String(formData.order));
      form.append("Type", String(formData.type));
      form.append("Description", formData.description);
      form.append("Duration", formData.duration);

      if (formData.video instanceof File) {
        form.append("Video", formData.video);
      }

      if (formData.videoPlaceholder instanceof File) {
        form.append("VideoPlaceholder", formData.videoPlaceholder);
      }

      formData.itemImages.forEach((item: any, index: number) => {
        if (item.image instanceof File) {
          form.append(`ItemImages[${index}].Image`, item.image);
        }
        form.append(`ItemImages[${index}].AltText`, item.altText || "");
        form.append(`ItemImages[${index}].Description`, item.description || "");
      });

      const res = await fetch(`${Backend_Url}/Lessons/CreateLessonItems`, {
        method: "POST",
        headers: {
          Authorization: Fake_Token,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("✅ Lesson created successfully");
      setRefetchTrigger((n) => n + 1);
    } catch (err) {
      console.error("❌ Error", err);
      toast.error("❌ Error creating lesson");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <div className="py-2 px-4 sticky pb-4 -top-[1px] z-50 bg-black text-white flex flex-wrap items-center rounded-b-lg justify-start gap-3">
        <div>
          <h2 className="text-xl">Add Courses</h2>
          <p className="text-xs text-[#FFFFFFB0]">Let's check your update today.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-1 text-sm ms-auto text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc]"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="flex mt-4 gap-7 mx-3">
        <div className="w-2/3 flex flex-col gap-7">
          {lessonId ? (
            <>
              <Textarea {...register("intro")} id="intro" placeholder="Lesson intro" />

              <div className="flex flex-col p-3 bg-white  shadow rounded-xl gap-3">
                <Controller
                  control={control}
                  name="video"
                  render={({ field }) => (
                    <FileUploader
                      key={`video-${lessonId}`}
                      id={`video-${lessonId}`}
                      type="video"
                      bg="/images/uploadImageBg.png"
                      file={field.value}
                      initialPreviewUrl={watch("videoPreview")}
                      onFileChange={field.onChange}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="videoPlaceholder"
                  render={({ field }) => (
                    <FileUploader
                      id="videoPlaceholder"
                      type="image"
                      bg="/images/uploadImageBg.png"
                      file={field.value}
                      initialPreviewUrl={watch("videoPlaceholderPreview")}
                      onFileChange={field.onChange}
                    />
                  )}
                />

                <Textarea {...register("description")} id="description" placeholder="Lesson description" />
              </div>

              <div className="flex gap-3">
                {[0, 1].map((i) => (
                  <div className="flex flex-col w-full gap-2 p-3 bg-white  shadow rounded-xl " key={i}>
                    <Controller
                      control={control}
                      name={`itemImages.${i}.image`}
                      render={({ field }) => (
                        <FileUploader
                          id={`itemImages${i}-image`}
                          type="image"
                          bg="/images/uploadImageBg.png"
                          file={field.value}
                          initialPreviewUrl={watch(`itemImages.${i}.previewUrl`)}
                          onFileChange={field.onChange}
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
              activeLessonId={activeLessonId}
            />
          ) : (
            <p className="text-sm text-red-500">Course ID not found in URL.</p>
          )}
        </div>
      </div>
    </form>
  );
}

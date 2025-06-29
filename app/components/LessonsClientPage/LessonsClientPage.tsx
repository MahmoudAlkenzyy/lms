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

  const fetchLessonData = async (lessonId: string) => {
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${lessonId}`, {
        headers: { Authorization: Fake_Token },
      });
      const data = await res.json();

      if (data.lesson) {
        console.log("Fetched lesson data:", data.lesson);

        reset({
          intro: data.lesson.intro ?? "",
          video: null,
          videoPreview: data.lesson.video ? `${Files_Url}${data.lesson.video}` : "",
          videoPlaceholder: null,
          videoPlaceholderPreview: data.lesson.videoPlaceholderPreview
            ? `${Files_Url}${data.lesson.videoPlaceholder}`
            : "",
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
      }
      setActiveLessonId(lessonId);
    } catch (err) {
      console.error(" Failed to fetch lesson data", err);
    }
  };

  useEffect(() => {
    if (lessonId) fetchLessonData(lessonId);
  }, [lessonId]);

  const onSubmit = async (formData: any) => {
    try {
      const form = new FormData();

      form.append("LessonId", lessonId || "");
      form.append("Intro", formData.intro);
      form.append("Description", formData.description);

      if (formData.video instanceof File) {
        form.append("Video", formData.video);
      }

      if (formData.videoPlaceholder instanceof File) {
        form.append("VideoPlaceholder", formData.videoPlaceholder);
      }

      formData.itemImages.forEach((item: any, index: number) => {
        if (item.image instanceof File) {
          form.append(`itemImages[${index}].image`, item.image);
        }
        form.append(`itemImages[${index}].description`, item.description || "");
        form.append(`itemImages[${index}].altText`, "");
      });

      const res = await fetch(`${Backend_Url}/Lessons/CreateLessonItems`, {
        method: "POST",
        headers: {
          Authorization: Fake_Token,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Lesson saved successfully");
      setRefetchTrigger((n) => n + 1);
    } catch (err) {
      console.error(err);
      toast.error("Error saving lesson");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <div className="py-2 px-4 sticky mt-3 -top-[16px] z-90 bg-black text-white flex justify-between rounded-lg">
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

              <div className="flex flex-col p-3 bg-white border shadow rounded-xl gap-3">
                <Controller
                  control={control}
                  name="video"
                  render={({ field }) => (
                    <FileUploader
                      id="video"
                      type="video"
                      bg="/images/uploadImageBg.png"
                      file={field.value}
                      initialPreviewUrl={control._formValues.videoPreview} // ⬅️ updated prop name
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
                      initialPreviewUrl={control._formValues.videoPlaceholderPreview}
                    />
                  )}
                />

                <Textarea {...register("description")} id="description" placeholder="Lesson description" />
              </div>

              <div className="flex gap-3">
                {[0, 1].map((i) => (
                  <div className="flex flex-col w-full gap-2" key={i}>
                    <Controller
                      key={i}
                      control={control}
                      name={`itemImages.${i}.image`}
                      render={({ field }) => (
                        <FileUploader
                          id={`itemImages${i}-image`}
                          type="image"
                          bg="/images/uploadImageBg.png"
                          file={field.value}
                          initialPreviewUrl={control._formValues.itemImages?.[i]?.previewUrl}
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

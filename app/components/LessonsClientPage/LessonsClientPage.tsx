"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Backend_Url, Fake_Token, Files_Url } from "@/constants";
import FileUploader from "@/app/components/FileUploader/FileUploader";
import Textarea from "@/app/components/Textarea/Textarea";
import CurriculumBar from "@/app/components/CurriculumBar/CurriculumBar";
import { FiSave, FiLoader } from "react-icons/fi";

export function LessonsClientPage() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseid");
  const lessonId = searchParams.get("lessonid");
  const router = useRouter();

  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      intro: "",
      video: null,
      videoPlaceholder: null,
      description: "",
      videoPreview: "",
      videoPlaceholderPreview: "",
      type: "Video", // default
      itemImages: [
        { image: null, description: "", previewUrl: "" },
        { image: null, description: "", previewUrl: "" },
      ],
    },
  });

  const fetchLessonData = async (id: string) => {
    setIsLoadingLesson(true);
    try {
      const res = await fetch(`${Backend_Url}/Lessons/GetLesson?LessonId=${id}`, {
        headers: { Authorization: Fake_Token },
      });

      if (!res.ok) throw new Error("Failed to fetch lesson");

      const data = await res.json();
      if (data.lesson) {
        reset({
          intro: data.lesson.intro ?? "",
          video: null,
          videoPreview: data.lesson.video ? `${Files_Url}${data.lesson.video}` : "",
          videoPlaceholder: null,
          videoPlaceholderPreview: data.lesson.videoPlaceholder ? `${Files_Url}${data.lesson.videoPlaceholder}` : "",
          description: data.lesson.description ?? "",
          type: data.lesson.type ?? "Video",
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
      toast.error("Failed to load lesson data");
    } finally {
      setIsLoadingLesson(false);
    }
  };

  useEffect(() => {
    if (lessonId) fetchLessonData(lessonId);
  }, [lessonId]);

  const onSubmit = async (formData: any) => {
    try {
      const form = new FormData();

      form.append("LessonId", activeLessonId || "");
      form.append("Name", formData.name || "Untitled Lesson");
      form.append("Intro", formData.intro);
      form.append("Order", String(formData.order || 0));
      form.append("Type", String(formData.type || "Video"));
      form.append("Description", formData.description);
      form.append("Duration", formData.duration || "0");

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

      toast.success("Lesson saved successfully");
      setRefetchTrigger((n) => n + 1);
    } catch (err) {
      console.error("Error", err);
      toast.error("Error saving lesson");
    }
  };

  const isPdf = watch("type") === "Attachment";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-8">
      <div className="py-3 px-6 sticky pb-4 -top-[1px] z-50 bg-black text-white flex flex-wrap items-center rounded-b-lg justify-between shadow-md">
        <div>
          <h2 className="text-xl font-semibold">Add lesson items</h2>
          <p className="text-sm text-gray-300">{activeLessonId ? "Editing lesson" : "Select a lesson "}</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/CoursePreviewPublish?courseid=${courseId}`)}
            className={` px-6 py-2 text-sm text-gray-600 bg-white border border-gray-400 rounded hover:bg-gray-100 transition-colors duration-200 cursor-pointer`}
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !activeLessonId}
            className="px-6 py-2 text-sm flex items-center gap-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mt-4 gap-6 mx-4">
        {/* Main Content Area */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {isLoadingLesson ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </motion.div>
            ) : activeLessonId ? (
              <motion.div
                key="lesson-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-medium text-lg mb-4">Lesson Introduction</h3>
                  <Textarea
                    {...register("intro", { required: "intro is required" })}
                    id="intro"
                    error={errors.intro}
                    placeholder="Enter lesson introduction..."
                    rows={4}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                  <h3 className="font-medium text-lg">Media Content</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isPdf ? "Lesson File (PDF)" : "Lesson Video"}
                      </label>
                      <Controller
                        control={control}
                        name="video"
                        rules={{ required: "Video is required" }}
                        render={({ field, fieldState }) => (
                          <>
                            <FileUploader
                              key={`video-${lessonId}`}
                              id={`video-${lessonId}`}
                              type={isPdf ? "pdf" : "video"}
                              bg="/images/uploadImageBg.png"
                              file={field.value}
                              initialPreviewUrl={watch("videoPreview")}
                              onFileChange={field.onChange}
                            />
                            {fieldState.invalid && (
                              <p className="text-red-500 text-sm mt-1">{fieldState.error?.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>

                    {!isPdf && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Video cover</label>
                        <Controller
                          control={control}
                          name="videoPlaceholder"
                          rules={{ required: "Video Placeholder is required" }}
                          render={({ field, fieldState }) => (
                            <>
                              <FileUploader
                                id="videoPlaceholder"
                                type="image"
                                bg="/images/uploadImageBg.png"
                                file={field.value}
                                initialPreviewUrl={watch("videoPlaceholderPreview")}
                                onFileChange={field.onChange}
                              />
                              {fieldState.invalid && (
                                <p className="text-red-500 text-sm mt-1">{fieldState.error?.message}</p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <Textarea
                        {...register("description", { required: "Description is required" })}
                        id="description"
                        placeholder="Enter detailed lesson description..."
                        rows={6}
                        className="min-h-[150px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="font-medium text-lg mb-4">Lesson Materials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[0, 1].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image {i + 1}</label>
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
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image Description</label>
                          <Textarea
                            {...register(`itemImages.${i}.description`)}
                            id={`itemImages.${i}.description`}
                            placeholder={`Enter description for image ${i + 1}...`}
                            rows={3}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-lesson"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
              >
                <div className="text-center max-w-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Lesson Selected</h3>
                  <p className="text-gray-600 mb-6">
                    Please select a lesson from the curriculum sidebar to view or edit its content.
                  </p>
                  <div className="lg:hidden">
                    <button type="button" className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800">
                      Browse Curriculum
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          {courseId ? (
            <CurriculumBar
              courseId={courseId}
              currentLessonId={lessonId ?? ""}
              onLessonClick={(id) => {
                setActiveLessonId(id);
                fetchLessonData(id);
              }}
              refetchTrigger={refetchTrigger}
              activeLessonId={activeLessonId}
            />
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              Course ID not found in URL.
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

import { Suspense } from "react";
import { LessonsPreviewPageClient } from "../components/CoursePreviewClient/CoursePreviewClient";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LessonsPreviewPageClient />
      </Suspense>
    </div>
  );
}

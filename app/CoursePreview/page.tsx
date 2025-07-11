import { Suspense } from "react";
import { LessonsPreviewPageClient } from "../components/CoursePreviewClient/CoursePreviewClient";
import RouteChangeLoading from "../components/RouteChangeLoading/RouteChangeLoading";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<RouteChangeLoading />}>
        <LessonsPreviewPageClient />
      </Suspense>
    </div>
  );
}

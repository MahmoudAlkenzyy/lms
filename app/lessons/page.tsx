import { Suspense } from "react";
import { LessonsClientPage } from "../components/LessonsClientPage/LessonsClientPage";
import RouteChangeLoading from "../components/RouteChangeLoading/RouteChangeLoading";

export default function Page() {
  return (
    <Suspense fallback={<RouteChangeLoading />}>
      <LessonsClientPage />
    </Suspense>
  );
}

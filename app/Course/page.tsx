import { Suspense } from "react";
import AddCoursePageClient from "../components/AddCoursePageClient/AddCoursePageClient";
import LoadingScreen from "../components/RouteChangeLoading/RouteChangeLoading";
export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AddCoursePageClient />
    </Suspense>
  );
}

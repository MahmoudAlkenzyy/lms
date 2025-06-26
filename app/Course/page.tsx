import { Suspense } from "react";
import AddCoursePageClient from "../components/AddCoursePageClient/AddCoursePageClient";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddCoursePageClient />
    </Suspense>
  );
}

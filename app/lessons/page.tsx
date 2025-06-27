import { Suspense } from "react";
import { LessonsClientPage } from "../components/LessonsClientPage/LessonsClientPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LessonsClientPage />
    </Suspense>
  );
}

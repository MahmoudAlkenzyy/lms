import { Suspense } from "react";
import PublishCourse from "../components/PublishCourse/PublishCourse";
import RouteChangeLoading from "../components/RouteChangeLoading/RouteChangeLoading";

export default function Page() {
  return (
    <div>
      <Suspense fallback={<RouteChangeLoading />}>
        <PublishCourse />
      </Suspense>
    </div>
  );
}

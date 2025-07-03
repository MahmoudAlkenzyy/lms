import { Suspense } from "react";
import SecionsClientPage from "./../components/SecionsClientPage/SecionsClientPage";
import RouteChangeLoading from "../components/RouteChangeLoading/RouteChangeLoading";
const Page = () => {
  return (
    <Suspense fallback={<RouteChangeLoading />}>
      <SecionsClientPage />
    </Suspense>
  );
};

export default Page;

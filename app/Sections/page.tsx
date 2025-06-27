import { Suspense } from "react";
import SecionsClientPage from "./../components/SecionsClientPage/SecionsClientPage";
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SecionsClientPage />
    </Suspense>
  );
};

export default Page;

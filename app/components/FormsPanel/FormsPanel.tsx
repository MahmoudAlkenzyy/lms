// import React from "react";
// import { FormProvider, UseFormReturn } from "react-hook-form";
// import BasicInfoAddCourses from "../BasicInfoAddCourses/BasicInfoAddCourses";
// import InstructorInfo from "../InstructorInfo/InstructorInfo";
// import CurriculumAddCourses from "../CurriculumAddCourses/CurriculumAddCourses";

// interface Props {
//   step: string;
//   courseId: string;
//   forms: {
//     basicInfoForm: UseFormReturn<any>;
//     instructorForm: UseFormReturn<any>;
//     contentForm: UseFormReturn<any>;
//   };
// }

// export default function FormsPanel({ step, courseId, forms }: Props) {
//   const { basicInfoForm, instructorForm, contentForm } = forms;
//   return (
//     <div className="flex-col flex gap-7 w-2/3">
//       <FormProvider {...basicInfoForm}>
//         <form>
//           <BasicInfoAddCourses disabled={step !== "" && step !== "new"} />
//         </form>
//       </FormProvider>

//       <FormProvider {...instructorForm}>
//         <form>
//           <InstructorInfo disabled={step !== "Draft-MetaData"} />
//         </form>
//       </FormProvider>

//       <FormProvider {...contentForm}>
//         {/* <CurriculumAddCourses id={courseId} disabled={step !== "Draft-StaffInfo"} /> */}
//       </FormProvider>
//     </div>
//   );
// }

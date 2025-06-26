import React from "react";

const PreviewCourseAddCourses = () => {
  return (
    <div className=" bg-black rounded shadow p-5 pt-4">
      <div className="">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold text-white">Preview course</p>
          <button className="px-6 py-2 text-white bg-[#7337FF] rounded-lg hover:bg-[#5e2dcc] transition-colors duration-200">
            Preview
          </button>
        </div>
        <p className="text-[#FFFFFFC7] text-xs">Preview how others will see your course</p>
      </div>
    </div>
  );
};

export default PreviewCourseAddCourses;

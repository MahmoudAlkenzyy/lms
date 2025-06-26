import FileUploader from "./../components/FileUploader/FileUploader";
import Textarea from "../components/Textarea/Textarea";
import CurriculumBar from "../components/CurriculumBar/CurriculumBar";

export default function Page() {
  return (
    <div className="pb-8">
      <div className="py-2 px-4 sticky mt-3 -top-[16px] z-90 bg-black text-white flex flex-wrap items-center rounded-lg justify-start gap-6">
        {/* <CiTextAlignLeft /> */}
        <div>
          <h2 className="text-xl">Add Courses</h2>
          <p className="text-xs text-[#FFFFFFB0]">let's check your update today.</p>
        </div>
        <div className="flex text-sm items-center gap-2 bg-[#FFFFFF14] rounded p-[2px]">
          {/* <IoCheckmark size={18} /> */}
          <p>Changes saved 2 min ago</p>
        </div>
        <div className="flex gap-4 items-center w-full justify-end">
          <button
            type="button"
            //   onClick={handleAllSubmits}
            className="px-6 py-1 text-sm text-white bg-[#7337FF] rounded hover:bg-[#5e2dcc] transition-colors duration-200 cursor-pointer"
          >
            Save to draft
          </button>
        </div>
      </div>
      <p className="text-lg uppercase pt-4 pb-2">
        Technology / Figma UI UX Design Essentials / Begineer -Introduction to Design Thinking /Read before your start{" "}
      </p>
      <div className="flex mt-4 gap-7">
        <div className="w-2/3 flex bg flex-col gap-7">
          <Textarea placeholder="Enter lesson intro" />

          <div className="flex flex-col p-3 bg-white border shadow rounded-xl border-[#00000029]">
            <FileUploader bg="/images/uploadImageBg.png" type="video" />
            <Textarea placeholder="Enter lesson description" />
          </div>
          <div className="flex flex-col p-3 bg-white border shadow rounded-xl border-[#00000029]">
            <div className="flex  gap-3">
              <div className=" flex flex-col w-full">
                <FileUploader bg="/images/upoadFileBg3.png" type="image" className="flex-grow" />
                <Textarea placeholder="Enter content" />
              </div>
              <div className=" flex flex-col w-full">
                <FileUploader bg="/images/upoladFileBg2.png" type="image" className="flex-grow" />
                <Textarea placeholder="Enter content" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <CurriculumBar />
        </div>
      </div>
    </div>
  );
}

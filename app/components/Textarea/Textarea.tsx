import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxDividerVertical } from "react-icons/rx";

import React from "react";

const Textarea = ({ placeholder }: { placeholder: string }) => {
  return (
    <div className="flex flex-col pb-0 p-3 bg-white border shadow rounded-xl border-[#00000029] ">
      <textarea
        placeholder={placeholder}
        rows={3}
        className="resize-none  p-2 border-[#00000029] focus:ring-0 focus-visible:outline-[#00000029]"
      />
      <div className="h-[1px] bg-[#00000029] w-full"></div>
      <div className="self-end bg-[#7337FF36]  flex border border-[#00000029] w-fit rounded-lg py-1 px-3 m-2">
        <button>
          <FaRegEdit size={20} className="text-[#7337FF4e]" />
        </button>
        <RxDividerVertical className="text-[#00000029]" />
        <button>
          <RiDeleteBinLine size={20} className=" text-[#EF3826]" />
        </button>
      </div>
    </div>
  );
};

export default Textarea;

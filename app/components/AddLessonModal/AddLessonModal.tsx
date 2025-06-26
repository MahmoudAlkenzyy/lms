import React, { useState } from "react";

const AddLessonModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ lessonTitle, lessonDuration });
    setIsOpen(false);
  };
  return (
    isOpen && (
      <div className="fixed inset-0 bg-[#0005] bg-opacity-50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add new lesson</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type lesson</label>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration of lesson</label>
              <input
                type="text"
                value={lessonDuration}
                onChange={(e) => setLessonDuration(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter duration (e.g., 30 min)"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-[#7337FF] text-white rounded hover:bg-[#6a2cf8]">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddLessonModal;

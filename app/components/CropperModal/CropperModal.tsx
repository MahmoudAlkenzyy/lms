"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import getCroppedImg from "@/utils/cropImage";

interface CropperModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
}

const CropperModal = ({ imageUrl, isOpen, onClose, onCropComplete, aspectRatio = 16 / 9 }: CropperModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const handleCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });
    onCropComplete(croppedFile);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
      <div className="relative w-full h-[400px]">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <button onClick={onClose} className="bg-gray-300 px-3 py-1 rounded">
          Cancel
        </button>
        <button onClick={handleDone} className="bg-indigo-600 text-white px-4 py-1 rounded">
          Crop & Save
        </button>
      </div>
    </Modal>
  );
};

export default CropperModal;

import React, { useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon } from 'lucide-react';
import { useStore } from '../store';

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "environment"
};

export function Camera() {
  const webcamRef = useRef<Webcam>(null);
  const { setImage, setStep, setError } = useStore();

  const capture = useCallback(() => {
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setImage(imageSrc);
        setStep('processing');
      } else {
        throw new Error('Failed to capture image');
      }
    } catch (error) {
      setError('Failed to capture image. Please try again.');
    }
  }, [setImage, setStep, setError]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result as string;
          setImage(imageData);
          setStep('processing');
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      setError('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={capture}
          className="flex items-center justify-center px-8 py-4 text-lg font-medium text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Capture Photo
        </button>
        
        <label className="flex items-center justify-center px-8 py-4 text-lg font-medium text-indigo-600 transition-all duration-200 bg-white border-2 border-indigo-600 rounded-xl hover:bg-indigo-50 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          Upload Image
        </label>
      </div>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ImageUpload, ImageDimensions, ImageValidationError } from '../types';

const ALLOWED_TYPE = 'image/png';
const MAX_FILE_SIZE = 150 * 1024; // 150KB
const DIMENSIONS = {
  desktop: { width: 1280, height: 300 },
  tablet: { width: 768, height: 300 },
  mobile: { width: 320, height: 150 },
};

async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
}

async function validateImage(
  file: File,
  expectedDimensions: ImageDimensions
): Promise<ImageValidationError | undefined> {
  if (file.type !== ALLOWED_TYPE) {
    return { type: 'format', message: 'Only PNG files are allowed' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { type: 'size', message: 'File size must be less than 150KB' };
  }

  const dimensions = await getImageDimensions(file);
  if (
    dimensions.width !== expectedDimensions.width ||
    dimensions.height !== expectedDimensions.height
  ) {
    return {
      type: 'dimensions',
      message: `Image must be ${expectedDimensions.width}x${expectedDimensions.height}px`,
    };
  }
}

export default function ImageUpload() {
  const [images, setImages] = useState<Record<string, ImageUpload | null>>({
    desktop: null,
    tablet: null,
    mobile: null,
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: keyof typeof DIMENSIONS
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    const error = await validateImage(file, DIMENSIONS[type]);
    const dimensions = await getImageDimensions(file);

    setImages((prev) => ({
      ...prev,
      [type]: { file, preview, dimensions, error },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all images are selected and valid
    const allImagesValid = Object.entries(images).every(
      ([, image]) => image && !image.error
    );

    if (!allImagesValid) {
      setSubmitStatus({
        type: 'error',
        message: 'Please ensure all images are selected and meet the requirements',
      });
      return;
    }

    // In a real application, you would upload the images here
    setSubmitStatus({
      type: 'success',
      message: 'Images validated successfully!',
    });
  };

  const allImagesSelected = Object.values(images).every((image) => image !== null);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Image Upload</h1>
      
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(DIMENSIONS).map(([type, dimensions]) => (
          <div key={type} className="space-y-2">
            <label
              htmlFor={`${type}-image`}
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {type} Image ({dimensions.width}x{dimensions.height}px)
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="file"
                    id={`${type}-image`}
                    accept=".png"
                    onChange={(e) => handleImageChange(e, type as keyof typeof DIMENSIONS)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-describedby={`${type}-error`}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG only, max 150KB</p>
                  </div>
                </div>
                {images[type as keyof typeof images]?.error && (
                  <p
                    id={`${type}-error`}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {images[type as keyof typeof images]?.error?.message}
                  </p>
                )}
              </div>
              {images[type as keyof typeof images]?.preview && (
                <div className="w-32 h-20 relative">
                  <img
                    src={images[type as keyof typeof images]?.preview}
                    alt={`${type} preview`}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {allImagesSelected && (
          <div className="mt-8 space-y-4">
            <h2 className="text-lg font-semibold">Preview</h2>
            <picture className="block w-full bg-gray-100 rounded-lg overflow-hidden">
              <source
                media="(min-width: 1024px)"
                srcSet={images.desktop?.preview}
              />
              <source
                media="(min-width: 768px)"
                srcSet={images.tablet?.preview}
              />
              <img
                src={images.mobile?.preview}
                alt="Responsive preview"
                className="w-full h-auto"
              />
            </picture>
          </div>
        )}

        {submitStatus && (
          <div
            className={`p-4 rounded-lg flex items-center gap-2 ${
              submitStatus.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
            role="alert"
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {submitStatus.message}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Upload Images
        </button>
      </form>
    </div>
  );
}
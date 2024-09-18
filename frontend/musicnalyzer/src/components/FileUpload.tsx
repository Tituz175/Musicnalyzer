"use client"

import { useState } from "react";
import Image from "next/image";

interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file
    setUploadedFile(file || null); // Set file in state
    onFileUpload(file || null); // Notify parent component
  };

  return (
    <div>
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full border-2 border-accent rounded-lg py-14 text-white cursor-pointer"
        style={{
          background: "#DE745544",
        }}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-lg font-normal">
          <div>
            <Image
              src="/svgs/music_icon_1.png"
              alt="music"
              width="37"
              height="37"
            />
          </div>
          <p className="mb-2 mt-4">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="">Mp3</p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".mp3"
          onChange={handleFileChange} // Capture file on change
        />
      </label>

      {uploadedFile && (
        <div className="my-2">
          <p className="text-foreground">
            Uploaded File: {uploadedFile.name}
          </p>
        </div>
      )}
    </div>
  );
}

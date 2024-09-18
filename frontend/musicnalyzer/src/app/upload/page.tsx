"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import Image from "next/image";

export default function Upload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
  };

  const router = useRouter()

  return (
    <div
      className='flex justify-around items-center w-full text-foreground'
      style={{
        height: "88.8vh",
      }}
    >
      <div className='bg-tertiary w-4/12 h-2/5 rounded-lg mb-4 py-10 px-14 flex flex-col justify-between'>
        <div className='flex items-center'>
          <div className=''>
            <Image
              src='/svgs/music_icon_2.png'
              alt='music'
              width='54'
              height='54'
            />
          </div>
          <h3 className='font-secondary text-foreground font-bold text-4xl ml-6'>
            Upload File
          </h3>
        </div>
        <FileUpload onFileUpload={handleFileUpload} />
        <div className='flex justify-center'>
          <button
            className={`text-lg py-3 px-6 border-0 rounded-md font-bold transition-all duration-500 ease-in-out
              ${uploadedFile
                ? "bg-foreground text-white hover:bg-accent"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
            onClick={()=>{
              router.push("/analyze")
            }}
          >
            Analyze
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * FileUpload component for uploading and processing audio files.
 *
 * This component allows users to upload an audio file (specifically .mp3), extract metadata,
 * and submit the file to the server. After uploading, users can proceed to an analysis page.
 * It also provides an option to mark the upload as a solo recording, and includes a loading indicator.
 *
 * State Variables:
 * - uploadedFile: Holds the file selected by the user.
 * - isSolo: Boolean indicating if the recording is solo.
 * - uploadStatus: Contains the status and message of the upload.
 * - isLoading: Indicates if the file is being uploaded.
 *
 * Core Functions:
 * - handleFileChange: Handles file input changes, processes metadata, and uploads the file.
 * - extractSongMetadata: Parses the uploaded audio file to extract song metadata (title, artist, duration).
 * - handleUploadSuccess: Updates the status after successful upload and saves metadata to localStorage.
 *
 * Visual Elements:
 * - Checkbox for solo recording selection.
 * - Dropzone-style file input with drag-and-drop and click-to-upload features.
 * - Status display with optional loading spinner.
 * - Button to proceed to the analysis page, enabled after successful upload.
 *
 * Usage:
 * 
* <FileUpload />
 *

 *
 * @returns {JSX.Element} The rendered FileUpload component.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseBlob } from "music-metadata-browser";
import { ClipLoader } from "react-spinners";

interface UploadStatus {
  status: boolean;
  message: string;
}

export default function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSolo, setIsSolo] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    status: false,
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);

    if (!file) return;

    // Reset status and enable loading
    setUploadStatus({ status: false, message: "" });
    setIsLoading(true);

    try {
      const metadata = await extractSongMetadata(file);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("song", metadata?.title || "Unknown Title");
      formData.append("artist", metadata?.artist || "Unknown Artist");
      formData.append("duration", metadata?.duration.toString() || "0");
      formData.append("isSolo", isSolo.toString());

      const response = await fetch("http://localhost:5000/insert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file.");

      const data = await response.json();
      handleUploadSuccess(data, metadata);
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadStatus({ status: false, message: "Failed to upload file." });
    } finally {
      setIsLoading(false);
    }
  };

  const extractSongMetadata = async (file: File) => {
    try {
      const metadata = await parseBlob(file);
      return {
        title: metadata.common.title || file.name.slice(0, file.name.lastIndexOf(".")),
        artist: metadata.common.artist || "Unknown Artist",
        duration: metadata.format.duration
          ? Math.round(metadata.format.duration * 100) / 100
          : 0,
      };
    } catch (error) {
      console.error("Error extracting metadata:", error);
      return null;
    }
  };

  const handleUploadSuccess = (data: any, metadata: any) => {
    setUploadStatus({ status: true, message: "File uploaded successfully!" });
    const songMetadata = {
      title: metadata?.title || "Unknown Title",
      artist: metadata?.artist || "Unknown Artist",
      id: data.song_id,
      duration: metadata?.duration || 0,
      isSolo,
    };
    localStorage.setItem("metadata", JSON.stringify(songMetadata));
  };

  return (
    <div>
      <div className='inline-flex items-center my-4 text-foreground font-bold'>
        <label
          className='flex items-center cursor-pointer relative'
          htmlFor='check-2'
        >
          <input
            type='checkbox'
            checked={isSolo}
            onChange={(e) => {
              // console.log(e.target.checked);
              setIsSolo(e.target.checked);
            }}
            className='peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-accent checked:bg-accent checked:border-0'
            id='check-2'
            disabled={isLoading || uploadedFile !== null} // Disable checkbox during upload or after file selection
          />
          <span className='absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-3.5 w-3.5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              ></path>
            </svg>
          </span>
        </label>
        <label className='cursor-pointer ml-2 text-md' htmlFor='check-2'>
          Is this a solo recording?
        </label>
      </div>

      <label
        htmlFor='dropzone-file'
        className='flex flex-col items-center justify-center w-full border-2 border-accent rounded-lg py-14 text-white cursor-pointer'
        style={{ background: "#DE745544" }}
      >
        <div className='flex flex-col items-center justify-center pt-5 pb-6 text-lg font-normal'>
          <p className='mb-2 mt-4'>
            <span className='font-semibold'>Click to upload</span> or drag and
            drop
          </p>
          <p>Mp3</p>
        </div>
        <input
          id='dropzone-file'
          type='file'
          className='hidden'
          accept='.mp3'
          onClick={() => setUploadedFile(null)}
          onChange={handleFileChange}
        />
      </label>

      {uploadedFile && (
        <p className='text-foreground mt-2'>
          Uploaded File: {uploadedFile.name}
        </p>
      )}

      {isLoading ? (
        <div className='flex justify-center mt-4'>
          <ClipLoader color='#4A90E2' loading={isLoading} size={35} />
          <p className='ml-3'>Uploading file...</p>
        </div>
      ) : (
        <p className='text-center mt-4'>{uploadStatus.message}</p>
      )}

      <div className='flex justify-center mt-4'>
        <button
          className={`text-lg py-3 px-6 border-0 rounded-md font-bold transition-all duration-500 ease-in-out ${uploadedFile && uploadStatus.status
              ? "bg-foreground text-white hover:bg-accent"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          disabled={!uploadedFile || !uploadStatus.status || isLoading}
          onClick={() => uploadedFile && router.push("/analyze")}
        >
          Analyze
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // For routing
import { parseBlob } from "music-metadata-browser"; // Import the metadata library


export default function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const router = useRouter(); // Initialize Next.js router for navigation

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file
    setUploadedFile(file || null); // Set file in state

    if (file) {
      // Extract metadata from the file
      const metadata = await extractSongMetadata(file);
      console.log("Extracted Metadata:", metadata);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("song", metadata ? metadata.title : "Unknown Title");
      formData.append("artist", metadata ? metadata.artist : "Unknown Artist");

      try {
        // Make POST request to Flask API
        const response = await fetch("http://localhost:5000/insert", {
          method: "POST",
          body: formData, // Send file and metadata
        });

        const data = await response.json();
        if (response.ok) {
          setUploadStatus("File uploaded successfully!");
          console.log("Upload success:", data);

          const songMetadata = {
            title: metadata ? metadata.title : "Unknown Title",
            artist: metadata ? metadata.artist : "Unknown Artist"
          }
          localStorage.setItem("metadata", JSON.stringify(songMetadata));

        } else {
          setUploadStatus("Failed to upload file.");
          console.error("Upload failed:", data);
        }
      } catch (error) {
        setUploadStatus("Error uploading file.");
        console.error("Error:", error);
      }
    }
  };

  const extractSongMetadata = async (file: File) => {
    try {
      // Parse the audio file to extract metadata
      const metadata = await parseBlob(file);
      return {
        title: metadata.common.title || "Unknown Title",
        artist: metadata.common.artist || "Unknown Artist",
      };
    } catch (error) {
      console.error("Error extracting metadata:", error);
      return null;
    }
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
          <p className="mb-2 mt-4">
            <span className="font-semibold">Click to upload</span> or drag and drop
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
          <p className="text-foreground">Uploaded File: {uploadedFile.name}</p>
        </div>
      )}

      {uploadStatus && <p>{uploadStatus}</p>}
      <div className="flex justify-center">
        <button
          className={`text-lg py-3 px-6 border-0 rounded-md font-bold transition-all duration-500 ease-in-out
            ${uploadedFile
              ? "bg-foreground text-white hover:bg-accent"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
          onClick={()=>{
            if (uploadedFile) {
              router.push("/analyze");
            }
          }}
        >
          Analyze
        </button>
      </div>
    </div>
  );
}

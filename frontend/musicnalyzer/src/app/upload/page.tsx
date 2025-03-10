/**
 * Upload component to render a file upload interface.
 *
 * This component provides an intuitive and visually engaging interface for users to upload
 * audio or music-related files. It includes a file upload control and a music icon with a 
 * heading that prompts the user to begin the upload process.
 *
 * Functional Components:
 * - `FileUpload`: Handles file selection and upload logic, giving users a familiar 
 *   drag-and-drop or browse option.
 * - `Image`: Displays a music icon to enhance the visual appeal and prompt action in the upload area.
 *
 * Usage:
 * ```
 * <Upload />
 * ```
 *
 * Key Layout:
 * - Full-width and centered both vertically and horizontally for accessibility and focus.
 * - Uses a `bg-tertiary` background color with rounded corners to create a defined, inviting upload area.
 *
 * Additional Notes:
 * - The design focuses on simplicity and ease of use, with visual cues (music icon and heading) 
 *   to encourage user interaction.
 * - The upload form layout supports both desktop and mobile views for consistent UX across devices.
 *
 * @returns {JSX.Element} The rendered Upload component.
 */

import FileUpload from "@/components/FileUpload";
import Image from "next/image";

export default function Upload() {
  return (
    <div
      className='flex justify-around items-center w-full text-foreground'
      style={{
        height: "88.8vh",
      }}
    >
      <div className='bg-tertiary w-4/12 h-6/12 rounded-lg mb-4 py-10 px-14 flex flex-col justify-between'>
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
        <FileUpload />
      </div>
    </div>
  );
}

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
        <FileUpload />
      </div>
    </div>
  );
}

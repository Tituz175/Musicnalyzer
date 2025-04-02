interface MetadataProps {
    title: string;
    artist: string;
  }
  
  export default function MetadataDisplay({ title, artist }: MetadataProps) {
    return (
      <>
        <h2 className="
        xxs:text-xl
        lg:text-5xl
        font-bold font-secondary">{title}</h2>
        <h3 className="
        xxs:text-lg
        lg:text-4xl
        font-semibold font-secondary">{artist}</h3>
      </>
    );
  }
  
interface MetadataProps {
    title: string;
    artist: string;
  }
  
  export default function MetadataDisplay({ title, artist }: MetadataProps) {
    return (
      <>
        <h2 className="font-bold text-5xl font-secondary">{title}</h2>
        <h3 className="font-semibold text-4xl font-secondary">{artist}</h3>
      </>
    );
  }
  
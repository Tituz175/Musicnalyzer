interface LyricsProps {
    lyrics: string;
  }
  
  export default function LyricsDisplay({ lyrics }: LyricsProps) {
    return (
      <div className="w-1/2 border">
        <h4 className="font-semibold text-2xl font-secondary">Lyrics</h4>
        <div>{lyrics || "No Lyrics Available"}</div>
      </div>
    );
  }
  
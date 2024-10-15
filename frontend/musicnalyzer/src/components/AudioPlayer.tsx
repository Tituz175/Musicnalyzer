import { useRef, useEffect } from "react";

interface AudioPlayerProps {
    audioUrl: string;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    volume: number;
}

export default function AudioPlayer({ audioUrl, isPlaying, setIsPlaying, volume }: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (audioRef.current) {
            if (!isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    };

    // Update the volume whenever it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]); // Volume changes are handled here

    return (
        <section className="py-6">
            <button
                onClick={handlePlayPause}
                className="px-6 py-2 bg-accent text-white rounded-md"
            >
                {isPlaying ? "Pause" : "Play"}
            </button>

            {/* Audio element */}
            <audio ref={audioRef} src={audioUrl} hidden />
        </section>
    );
}

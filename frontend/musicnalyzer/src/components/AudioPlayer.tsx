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
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(error => {
                    console.error('Playback failed:', error);
                    setIsPlaying(false); // Ensure the play state remains consistent
                });
                setIsPlaying(true);
            }
        }
    };

    // Update the volume whenever it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle when the audio ends
    useEffect(() => {
        const audioElement = audioRef.current;

        const handleAudioEnd = () => {
            setIsPlaying(false);
        };

        if (audioElement) {
            // Add event listener when the component mounts
            audioElement.addEventListener('ended', handleAudioEnd);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleAudioEnd);
            }
        };
    }, [setIsPlaying]);

    // Update the audio source when audioUrl changes
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = !audioRef.current.paused; // Check if audio was playing

            // Set new source
            audioRef.current.src = audioUrl;

            if (wasPlaying) {
                audioRef.current.play().catch(error => {
                    console.error('Playback failed due to user interaction:', error);
                });
            }
        }
    }, [audioUrl, setIsPlaying]);

    return (
        <section className="py-6">
            <button
                onClick={handlePlayPause}
                className="px-6 py-2 bg-accent text-white rounded-md"
            >
                {isPlaying ? "Pause" : "Play"}
            </button>

            {/* Audio element */}
            <audio ref={audioRef} hidden />
        </section>
    );
}

/**
 * AudioPlayer component for playing multiple audio stems in sync.
 *
 * This component provides an audio player with the capability to handle multiple audio stems,
 * allowing for individual volume control and synchronized playback. It includes play/pause functionality,
 * a seek bar, and displays the current time and duration of the audio.
 *
 * Props:
 * - `audioStemsObj`: Object containing URLs for each audio stem (e.g., soprano, alto, tenor, instrumentals).
 * - `isPlaying`: Boolean indicating the current play state.
 * - `setIsPlaying`: Callback to update the play state.
 * - `volumes`: Object with volume levels for each audio stem.
 *
 * Functional Components:
 * - `handlePlayPause`: Toggles playback for all audio stems.
 * - `handleSliderChange`: Handles slider movements to seek within the audio.
 * - `formatTime`: Formats time in seconds into "minutes:seconds" for display.
 *
 * Key Features:
 * - Syncs playback across multiple audio elements.
 * - Allows individual volume control for each audio stem.
 * - Automatically tracks and displays the maximum duration among all stems.
 * - Styled seek bar provides visual feedback of playback progress.
 *
 * Usage:
 * ```
 * <AudioPlayer
 *   audioStemsObj={audioStems}
 *   isPlaying={isPlaying}
 *   setIsPlaying={setIsPlaying}
 *   volumes={volumes}
 * />
 * ```
 *
 * @returns {JSX.Element} The rendered AudioPlayer component.
 */


import { useRef, useEffect, useState, useMemo } from "react";

import Waveform from "@/components/Waveform";

interface AudioPlayerProps {
    audioStemsObj: Record<string, string>; // Array of audio stem URLs for multi-stem audio
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    volumes: {
        soprano: number;
        alto: number;
        tenor: number;
        instrumentals: number;
    };
    audioRefs: React.MutableRefObject<(HTMLAudioElement | null)[]>;
}

export default function AudioPlayer({
    audioStemsObj,
    isPlaying,
    setIsPlaying,
    volumes,
    audioRefs
}: AudioPlayerProps) {
    // const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [durations, setDurations] = useState<number[]>([]); // Store durations of each stem

    // Extract stems as an array for easier iteration
    const audioStems = useMemo(() => {
        return Object.values(audioStemsObj).filter(Boolean);
    }, [audioStemsObj]);

    // Handle play/pause toggle for all audio files
    const handlePlayPause = () => {
        if (audioRefs.current.length === 0) return;

        if (isPlaying) {
            // Pause all audios
            audioRefs.current.forEach((audio) => audio?.pause());
            setIsPlaying(false);
        } else {
            // Play all audios
            audioRefs.current.forEach((audio) => {
                if (audio && audio.readyState === 4) {
                    // Ensure audio is ready
                    audio.play().catch((error) => {
                        console.error("Playback failed:", error);
                        setIsPlaying(false);
                    });
                }
            });
            setIsPlaying(true);
        }
    };

    // Update volumes based on state changes
    useEffect(() => {
        let stemNames: string[];
        audioStems.length == 4
            ? (stemNames = ["soprano", "alto", "tenor", "instrumentals"])
            : (stemNames = ["soprano", "instrumentals"]);

        audioRefs.current.forEach((audio, index) => {
            if (
                audio &&
                volumes[stemNames[index] as keyof typeof volumes] !== undefined
            ) {
                audio.volume = volumes[stemNames[index] as keyof typeof volumes];
            }
        });
    }, [volumes, audioStems.length]);

    // Track duration of each audio stem
    useEffect(() => {
        const handleDuration = () => {
            // Get the duration of each audio file and update state
            const newDurations = audioRefs.current.map(
                (audio) => audio?.duration || 0
            );
            setDurations(newDurations);
        };

        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.addEventListener("loadedmetadata", handleDuration);
            }
        });

        // Clean up listeners
        return () => {
            audioRefs.current.forEach((audio) => {
                if (audio) {
                    audio.removeEventListener("loadedmetadata", handleDuration);
                }
            });
        };
    }, [audioStems]);

    // Sync current time for all audio elements
    useEffect(() => {
        const updateCurrentTime = () => {
            if (audioRefs.current[0]) {
                setCurrentTime(audioRefs.current[0].currentTime);
            }
        };

        audioRefs.current.forEach((audio) => {
            if (audio) {
                audio.addEventListener("timeupdate", updateCurrentTime);
            }
        });

        // Clean up listeners on component unmount or change
        return () => {
            audioRefs.current.forEach((audio) => {
                if (audio) {
                    audio.removeEventListener("timeupdate", updateCurrentTime);
                }
            });
        };
    }, [audioStems]);

    // Handle audio end event to stop playback
    useEffect(() => {
        const handleAudioEnd = () => {
            setIsPlaying(false);
        };

        audioRefs.current.forEach((audio) => {
            if (audio) audio.addEventListener("ended", handleAudioEnd);
        });

        // Clean up "ended" event listeners
        return () => {
            audioRefs.current.forEach((audio) => {
                if (audio) audio.removeEventListener("ended", handleAudioEnd);
            });
        };
    }, [setIsPlaying]);

    // Handle slider change to seek in audio
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        audioRefs.current.forEach((audio) => {
            if (audio) audio.currentTime = newTime;
        });
        setCurrentTime(newTime);
    };

    // Get the maximum duration of all audio stems
    const maxDuration = Math.max(...durations);

    return (
        <section className='mt-10 py-6'>

            <Waveform
                audioStemsObj={audioStemsObj} // or whichever stem you want to visualize
                isPlaying={isPlaying}
                currentTime={currentTime}
                onSeek={(time) => {
                    audioRefs.current.forEach(audio => {
                    if (audio) audio.currentTime = time;
                    });
                    setCurrentTime(time);
                }}
            />
            {/* Styled range slider */}
            <input
                type='range'
                min='0'
                max={maxDuration}
                value={currentTime}
                onChange={handleSliderChange}
                style={{
                    width: "100%",
                    appearance: "none",
                    background: "linear-gradient(90deg, #DE7456 " + (currentTime / maxDuration) * 100 + "%, #ddd " + (currentTime / maxDuration) * 100 + "%)",
                    height: "auto",
                    // boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)"
                }}
                className='w-full cursor-pointer range'
            />
    
            <div className='text-lg mt-4 flex items-center justify-between text-center space-x-4 font-semibold'>
                <span className=''>{formatTime(currentTime)}</span>
    
                <a
                    onClick={handlePlayPause}
                    className='w-16 h-16 bg-accent rounded-full ring-4 ring-white grid place-items-center transition-transform transform hover:scale-110 cursor-pointer'
                >
                    {!isPlaying ? (
                        <svg
                            className='ml-1 w-8'
                            viewBox='0 0 16 18'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M15 7.26795C16.3333 8.03775 16.3333 9.96225 15 10.7321L3 17.6603C1.66667 18.4301 1.01267e-06 17.4678 1.07997e-06 15.9282L1.68565e-06 2.0718C1.75295e-06 0.532196 1.66667 -0.430054 3 0.339746L15 7.26795Z'
                                fill='white'
                            />
                        </svg>
                    ) : (
                        <svg
                            className='w-8'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path d="M6 4H10V22H6V4Z" fill="white"/>
                            <path d="M14 4H18V22H14V4Z" fill="white"/>
                        </svg>
                    )}
                </a>
    
                <span className='font-mono'>{formatTime(maxDuration)}</span>
            </div>
    
            {/* Render audio elements for all stems */}
            {audioStems.map((audioUrl, index) => (
                <audio
                    key={index}
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={audioUrl}
                    hidden
                />
            ))}
        </section>
    );
    
}

// Helper function to format time (seconds)
function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}
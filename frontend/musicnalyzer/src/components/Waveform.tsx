import WaveSurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";

interface WaveformProps {
  audioStemsObj: Record<string, string>;
  isPlaying: boolean;
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function Waveform({ audioStemsObj, isPlaying, currentTime, onSeek }: WaveformProps) {
  const [selectedStem, setSelectedStem] = useState<string>("soprano");
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStem(event.target.value);
  };

  useEffect(() => {
    if (!waveformRef.current || !audioStemsObj[selectedStem]) return;

    if (!wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#aaa",
        progressColor: "#DE7456",
        responsive: true,
        height: 100,
      });

      wavesurferRef.current.on("seek", (progress) => {
        const duration = wavesurferRef.current?.getDuration() || 0;
        onSeek(progress * duration);
      });
    }

    // Load new audio without destroying the instance
    wavesurferRef.current.load(audioStemsObj[selectedStem]);

  }, [audioStemsObj, selectedStem, onSeek]);

  useEffect(() => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      if (!wavesurferRef.current.isPlaying()) {
        wavesurferRef.current.play().catch(() => { });
      }
    } else {
      wavesurferRef.current.pause();
    }
  }, [isPlaying]);

  // Sync current time
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setTime(currentTime);
    }
  }, [currentTime]);

  return (
    <div className="relative w-full">
      {/* Styled Dropdown Box */}
      <div className="absolute top-[-50px] right-0">
        <label htmlFor="stem-select" className="text-md font-semibold text-foreground">
          Select Stem:
        </label>
        <select
          id="stem-select"
          value={selectedStem}
          onChange={handleDropdownChange}
          className="ml-2 border-2 border-gray-300 rounded-lg px-3 py-1 text-foreground bg-white hover:border-accent focus:outline-none transition-all"
        >
          {Object.entries(audioStemsObj)
            .filter(([_, url]) => url !== "")
            .map(([name, _]) => {
              let listName = name;
              if (name == "soprano" && [].length > 2) {
                listName = "vocal";
              }
              return (
                <option key={name} value={name}>
                  {listName.charAt(0).toUpperCase() + listName.slice(1)}
                </option>
              );
            })
          }
            
        </select>
      </div>

      {/* Waveform */}
      <div ref={waveformRef} className="w-full min-h-[100px] bg-gray-100 rounded-lg shadow-md" />
    </div>
  );
}

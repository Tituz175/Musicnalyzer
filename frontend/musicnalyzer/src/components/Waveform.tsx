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
  const currentSrc = useRef<string>("");

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
        backend: "MediaElement", // Use MediaElement backend (no audio playback)
        interact: false, // Disable interaction if you don't want the user to interact with the waveform
        audioContext: null, // Disable audio context to prevent sound playback
        mediaControls: false, // Disable media controls
        cursorColor: "transparent", // Optionally, make the cursor transparent so it doesn't appear
        hideScrollbar: true, // Optionally hide the scrollbar
      });

      wavesurferRef.current.on("seek", (progress) => {
        const duration = wavesurferRef.current?.getDuration() || 0;
        console.log(duration);
        onSeek(progress * duration);
      });
    }

    // Load new audio without destroying the instance
    if (currentSrc.current !== audioStemsObj[selectedStem]) {
      wavesurferRef.current.load(audioStemsObj[selectedStem]);
      currentSrc.current = audioStemsObj[selectedStem]; // Update the ref with the new source
    }

  }, [audioStemsObj, selectedStem, onSeek]);

  // useEffect(() => {
  //   if (!wavesurferRef.current) return;

  //   if (isPlaying) {
  //     if (!wavesurferRef.current.isPlaying()) {
  //       wavesurferRef.current.play().catch(() => { });
  //     }
  //   } else {
  //     wavesurferRef.current.pause();
  //   }
  // }, [isPlaying]);

  // Sync current time
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setTime(currentTime);
    }
  }, [currentTime]);

  return (
    <div className="
    xxs:w-full
    lg:w-full
    relative">
      {/* Styled Dropdown Box */}
      <div className="
      max-lg:w-full xxs:flex xxs:justify-center xxs:items-center
      lg:right-0 lg:block
      absolute top-[-50px]">
        <label htmlFor="stem-select" className="text-md font-semibold text-foreground">
          Select Stem:
        </label>
        <select
          id="stem-select"
          value={selectedStem}
          onChange={handleDropdownChange}
          className="ml-2 border-2 border-gray-300 rounded-lg px-3 py-1 text-foreground bg-white hover:border-accent focus:outline-none transition-all"
        >

          {Object.entries(audioStemsObj).reduce((acc, [name, url], _, array) => {
            if (url === "") return acc; // Skip empty URLs

            const validCount = array.filter(([_, u]) => u !== "").length; // Count valid stems
            const listName = name === "soprano" && validCount === 2 ? "vocals" : name;

            acc.push(
              <option key={name} value={name}>
                {listName.charAt(0).toUpperCase() + listName.slice(1)}
              </option>
            );

            return acc;
          }, [] as JSX.Element[])}


        </select>
      </div>

      {/* Waveform */}
      <div ref={waveformRef} className="w-full min-h-[100px] bg-gray-100 rounded-lg shadow-md" />
    </div>
  );
}

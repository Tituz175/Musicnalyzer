/**
 * AudioPlayer component for playing multiple audio stems in sync.
 *
 * This component provides an audio player with the capability to handle multiple audio stems,
 * allowing for individual volume control and synchronized playback. It includes play/pause functionality,
 * a seek bar, and displays the current time and duration of the audio.
 *
 * Props:
 * - audioStemsObj: Object containing URLs for each audio stem (e.g., soprano, alto, tenor, instrumentals).
 * - isPlaying: Boolean indicating the current play state.
 * - setIsPlaying: Callback to update the play state.
 * - volumes: Object with volume levels for each audio stem.
 *
 * Functional Components:
 * - handlePlayPause: Toggles playback for all audio stems.
 * - handleSliderChange: Handles slider movements to seek within the audio.
 * - formatTime: Formats time in seconds into "minutes:seconds" for display.
 *
 * Key Features:
 * - Syncs playback across multiple audio elements.
 * - Allows individual volume control for each audio stem.
 * - Automatically tracks and displays the maximum duration among all stems.
 * - Styled seek bar provides visual feedback of playback progress.
 *
 * Usage:
 * 
* <AudioPlayer
 *   audioStemsObj={audioStems}
 *   isPlaying={isPlaying}
 *   setIsPlaying={setIsPlaying}
 *   volumes={volumes}
 * />
 *

 *
 * @returns {JSX.Element} The rendered AudioPlayer component.
 */


"use client";

import { useEffect, useState, useRef } from "react";
import MetadataDisplay from "@/components/MetadataDisplay";
import KeyBpmControl from "@/components/KeyBpmControl";
import VolumeControl from "@/components/VolumeControl";
import LyricsDisplay from "@/components/LyricsDisplay";
import AudioPlayer from "@/components/AudioPlayer";
// import Waveform from "@/components/Waveform";

interface SongData {
  title: string;
  artist: string;
  musical_key: string;
  song_tempo: string;
  lyrics: string;
  paths: string;
  stems: object;
}

interface Metadata {
  id: string;
  title: string;
  artist: string;
}

interface AudioStems {
  soprano: string;
  alto?: string;
  tenor?: string;
  instrumentals: string;
}

export default function Analyze() {
  const [songData, setSongData] = useState<SongData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  // const waveformRef = useRef(null);

  const [stemVolumes, setStemVolumes] = useState({
    soprano: 0.5,
    alto: 0.5,
    tenor: 0.5,
    instrumentals: 0.5,
  });

  const [stemAudioUrls, setStemAudioUrls] = useState<AudioStems>({
    soprano: "",
    alto: "",
    tenor: "",
    instrumentals: "",
  });

  const [metaDataParsed, setMetaDataParsed] = useState<Metadata | null>(null);
  const [originalKey, setOriginalKey] = useState<string>("");
  const [originalBpm, setOriginalBpm] = useState<number>(0);

  useEffect(() => {
    // Parse metadata once when component mounts
    const metaData = localStorage.getItem("metadata");
    const parsedMetaData = metaData ? JSON.parse(metaData) : null;
    setMetaDataParsed(parsedMetaData);
  }, []); // Run this effect only once on mount

  useEffect(() => {
    if (metaDataParsed && metaDataParsed.id) {
      const songId = metaDataParsed.id;

      // Fetch song details from backend using song ID
      const fetchSongData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/songs/${songId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch song data");
          }

          const data = await response.json();
          console.log(data);
          setOriginalKey(data.musical_key);
          setOriginalBpm(data.song_tempo);
          const { musical_parts } = data;
          const { soprano_path, alto_path, tenor_path, instrumental_path } = musical_parts;
          console.log(soprano_path, alto_path, tenor_path, instrumental_path)
          const formatUrl = (path: string | "") =>
            path
              ? `http://localhost:5000/${encodeURIComponent(
                path.replace(/\\/g, "/")
              )}`
              : null;

          const fullSopranoUrl = formatUrl(soprano_path);
          const fullAltoUrl = formatUrl(alto_path);
          const fullTenorUrl = formatUrl(tenor_path);
          const fullInstrumentalUrl = formatUrl(instrumental_path);

          const fullAudioUrl = `http://localhost:5000/${encodeURIComponent(
            data.paths.replace(/\\/g, "/")
          )}`;

          localStorage.setItem(
            "originalStem",
            JSON.stringify({
              soprano: fullSopranoUrl,
              alto: fullAltoUrl,
              tenor: fullTenorUrl,
              instrumental: fullInstrumentalUrl,
            })
          );

          localStorage.setItem("originalPath", JSON.stringify(fullAudioUrl));

          console.log(fullAudioUrl);

          // Set song data and audio URL
          setSongData({ ...data, paths: fullAudioUrl });
          setSongData({
            ...data,
            stems: {
              soprano: fullSopranoUrl,
              alto: fullAltoUrl,
              tenor: fullTenorUrl,
              instrumental: fullInstrumentalUrl,
            },
          });
          // setAudioUrl(fullAudioUrl);
          setStemAudioUrls({
            soprano: fullSopranoUrl ? fullSopranoUrl : "",
            alto: fullAltoUrl ? fullAltoUrl : "",
            tenor: fullTenorUrl ? fullTenorUrl : "",
            instrumentals: fullInstrumentalUrl ? fullInstrumentalUrl : "",
          })
          // setAudioStem([fullSopranoUrl, fullAltoUrl, fullTenorUrl, fullInstrumentalUrl]);
        } catch (error) {
          console.error("Error fetching song data:", error);
        }
      };

      fetchSongData();
    }
  }, [metaDataParsed]); // Only run when metaDataParsed changes

  // Handle key change from KeyBpmControl
  const handleKeyChange = (
    newAudioStems: AudioStems,
    // newAudioPath: string,
    { newKey, newBPM }: { newKey?: string; newBPM?: number }
  ) => {
    console.log("This is handle keychange function: ", newAudioStems);

    const formatUrl = (path: string | "") =>
      path
        ? `http://localhost:5000/${path}`
        : null;

    const fullSopranoUrl = formatUrl(newAudioStems.soprano);
    const fullAltoUrl = newAudioStems.alto ? formatUrl(newAudioStems.alto) : null;
    const fullTenorUrl = newAudioStems.tenor ? formatUrl(newAudioStems.tenor) : null;
    const fullInstrumentalUrl = formatUrl(newAudioStems.instrumentals);

    setSongData((prevData) => {
      if (!prevData) return null;

      return {
        ...prevData,
        // paths: newAudioPath,
        stems: {
          soprano: fullSopranoUrl,
          alto: fullAltoUrl,
          tenor: fullTenorUrl,
          instrumental: fullInstrumentalUrl,
        },
        musical_key: newKey ?? prevData.musical_key,
        song_tempo: newBPM ?? prevData.song_tempo,
      };
    }); // Update song data and audio URL
    setStemAudioUrls({
      soprano: fullSopranoUrl ? fullSopranoUrl : "",
      alto: fullAltoUrl ? fullAltoUrl : "",
      tenor: fullTenorUrl ? fullTenorUrl : "",
      instrumentals: fullInstrumentalUrl ? fullInstrumentalUrl : "",
    })
  };

  const handleVolumeChange = (stem: string, value: number) => {
    setStemVolumes((prevVolumes) => ({
      ...prevVolumes,
      [stem]: value,
    }));
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  

  return (
    <div className='px-4 xxs:px-6 xxs:py-0 xxs:my-3 md:px-14 lg:px-60 my-14 lg:py-14 text-foreground'>
      <MetadataDisplay
        title={metaDataParsed?.title || "Unknown Title"}
        artist={metaDataParsed?.artist || "Unknown Artist"}
      />
      <section className='
      xxs:flex-col-reverse
      lg:flex-col
      flex items-center flex-col justify-between w-full font-secondary'>
        <div className="
        xxs:flex-col
        lg:flex-row
        flex w-full justify-between">
          <div className='
          max-lg:w-full max-lg:p-2
          w-2/5 flex flex-col items-center justify-center p-10'>
            <KeyBpmControl
              incomingmusicalKey={songData?.musical_key || ""}
              incomingbpm={songData?.song_tempo || ""}
              // paths={songData?.paths || ""}
              stems={songData?.stems || ""}
              onKeyChange={handleKeyChange}
              originalKey={originalKey}
              originalBpm={originalBpm}
            />
            <VolumeControl
              volume={stemVolumes}
              onVolumeChange={handleVolumeChange}
              stemsUrl={stemAudioUrls}
            />
          </div>
          <LyricsDisplay lyrics={songData?.lyrics || ""} />
        </div>

        <div className="w-full">
        <AudioPlayer
          audioStemsObj={stemAudioUrls}
          audioRefs={audioRefs}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          volumes={stemVolumes}
        />
        </div>
      </section>
      {/* <Waveform audioUrl={stemAudioUrls.soprano} audioRef={audioRefs.current[0]} isPlaying={isPlaying} onSeek={handleSeek} /> */}
    </div>
  );
}

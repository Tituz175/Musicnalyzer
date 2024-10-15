"use client";

import { useEffect, useState, useMemo } from "react";
import MetadataDisplay from "@/components/MetadataDisplay";
import KeyBpmControl from "@/components/KeyBpmControl";
import VolumeControl from "@/components/VolumeControl";
import LyricsDisplay from "@/components/LyricsDisplay";
import AudioPlayer from "@/components/AudioPlayer";

interface SongData {
  title: string;
  artist: string;
  musical_key: string;
  song_tempo: string;
  lyrics: string;
  paths: string;
}

export default function Analyze() {
  const [songData, setSongData] = useState<SongData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Memoize metaDataParsed to ensure it only changes when 'metadata' in localStorage changes
  const metaDataParsed = useMemo(() => {
    const metaData = localStorage.getItem('metadata');
    return metaData ? JSON.parse(metaData) : null;
  }, []); // Only re-run this when the component first mounts

  useEffect(() => {
    if (metaDataParsed && metaDataParsed.id) {
      const songId = metaDataParsed.id;

      // Fetch song details from backend using song ID
      const fetchSongData = async () => {
        try {
          const response = await fetch(`http://localhost:5000/songs/${songId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch song data');
          }

          const data = await response.json();
          const fullAudioUrl = `http://localhost:5000/${data.paths}`;

          // Set song data and audio URL
          setSongData({ ...data, paths: fullAudioUrl });
        } catch (error) {
          console.error('Error fetching song data:', error);
        }
      };

      fetchSongData();
    }

  }, [metaDataParsed]);


  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-60 text-foreground">
      <MetadataDisplay title={metaDataParsed?.title || "Unknown Title"} artist={metaDataParsed?.artist || "Unknown Artist"} />
      <section className="flex items-center w-full font-secondary">
        <div className="w-1/2 flex flex-col items-center justify-center p-10">
          <KeyBpmControl musicalKey={songData?.musical_key || "C"} bpm={songData?.song_tempo || "160"} />
          <VolumeControl volume={volume} onVolumeChange={setVolume}/>
        </div>
        <LyricsDisplay lyrics={songData?.lyrics || ""} />
      </section>
      <AudioPlayer
        audioUrl={songData?.paths || ""}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
      />
    </div>
  );
}

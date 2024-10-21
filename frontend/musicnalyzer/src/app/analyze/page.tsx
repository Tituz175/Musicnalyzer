"use client";

import { useEffect, useState } from "react";
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

interface Metadata {
  id: string;
  title: string;
  artist: string;
}

export default function Analyze() {
  const [songData, setSongData] = useState<SongData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [metaDataParsed, setMetaDataParsed] = useState<Metadata | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    // Parse metadata once when component mounts
    const metaData = localStorage.getItem('metadata');
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
          const fullAudioUrl = `http://localhost:5000/${data.paths}`;

          console.log(fullAudioUrl);

          // Set song data and audio URL
          setSongData({ ...data, paths: fullAudioUrl });
          setAudioUrl(fullAudioUrl);
        } catch (error) {
          console.error("Error fetching song data:", error);
        }
      };

      fetchSongData();
    }

  }, [metaDataParsed]); // Only run when metaDataParsed changes

  // Handle key change from KeyBpmControl
  const handleKeyChange = (newKey: string, newAudioPath: string) => {
    const fullAudioUrl = `http://localhost:5000/${newAudioPath}`;
    console.log(`This is the new path: ${fullAudioUrl}`)
    setSongData((prevData) => prevData ? { ...prevData, musical_key: newKey, paths: fullAudioUrl } : null);
    setAudioUrl(fullAudioUrl); // Update audio URL
  };

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-60 text-foreground">
      <MetadataDisplay title={metaDataParsed?.title || "Unknown Title"} artist={metaDataParsed?.artist || "Unknown Artist"} />
      <section className="flex items-center w-full font-secondary">
        <div className="w-1/2 flex flex-col items-center justify-center p-10">
          <KeyBpmControl musicalKey={songData?.musical_key || ""} bpm={songData?.song_tempo || ""} onKeyChange={handleKeyChange} />
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
        </div>
        <LyricsDisplay lyrics={songData?.lyrics || ""} />
      </section>
      <AudioPlayer
        audioUrl={audioUrl} 
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        volume={volume}
      />
    </div>
  );
}

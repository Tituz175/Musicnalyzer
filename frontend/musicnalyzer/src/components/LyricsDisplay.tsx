/**
 * LyricsDisplay component for displaying and fetching song lyrics.
 *
 * This component renders lyrics with a smooth fade-in animation for each line.
 * If lyrics are not available, it provides a button to fetch them from the server.
 * The component also handles loading states with a spinner animation.
 *
 * Props:
 * - incomingLyrics: A string containing the initial lyrics to display.
 *
 * Functional Components:
 * - changeOnServer: Sends a request to fetch lyrics from the server.
 * - handleResponse: Processes the server response and updates the lyrics state.
 * - handleLyrics: Manages the lyric fetching process, including UI state updates.
 *
 * Key Features:
 * - Displays lyrics with staggered fade-in effects.
 * - Fetches lyrics dynamically if not provided initially.
 * - Handles loading state with a spinner animation.
 * - Responsive and adaptive layout.
 *
 * Usage:
 * 
 * <LyricsDisplay incomingLyrics={lyrics} />
 *
 * @returns {JSX.Element} The rendered LyricsDisplay component.
 */

import { useState } from "react";

interface LyricsProps {
  incomingLyrics: string;
}

interface ChangeParams {
  value?: number;
  currentKey?: string;
  currentBPM?: number;
  songId?: string;
  currentAudioPath?: string;
}

export default function LyricsDisplay({ incomingLyrics }: LyricsProps) {
  const [lyrics, setLyrics] = useState(incomingLyrics);
  const [loading, setLoading] = useState(false); // for loading spinner

  const changeOnServer = async (url: string, params: ChangeParams) => {
    const { songId, currentAudioPath } = params;

    const body: any = {
      currentAudioPath,
      songId,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const handleResponse = async (response: Response) => {
    console.log(response.ok);
    if (response.ok) {
      const data = await response.json();
      setLyrics(data.lyrics);
    }
  };

  const handleLyrics = async () => {
    setLoading(true); // start spinner
    const metadata = localStorage.getItem("metadata");
    const songId = metadata ? JSON.parse(metadata)["id"] : null;
    const response = await changeOnServer("http://localhost:5000/get_lyrics", {
      songId,
    });
    await handleResponse(response);
    setLoading(false); // stop spinner
  };

  return (
    <div className={`
    max-lg:w-full max-lg:my-4 max-lg:h-[30vh] lg:h-[55vh]
    w-2/5 flex flex-col ${lyrics ? 'justify-start' : 'justify-between'} h-[60vh] border rounded-lg bg-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow duration-500 ease-in-out`}>
      <h4 className="
      max-lg:text-xl max-lg:mb-0
      font-semibold text-3xl font-secondary mb-4 text-center">
        Lyrics
      </h4>

      <div className="
      max-lg:my-1 max-lg:text-sm max-lg:font-normal max-lg:space-y-1
      my-3 text-xl font-medium text-justify overflow-y-auto space-y-2">
        {lyrics ? (
          lyrics.split(/(?=[A-Z])/).map((line, index) => (
            <p
              key={index}
              className="whitespace-pre-line leading-relaxed text-foreground animate-fade-in-down"
              style={{ animationDelay: `${index * 100}ms` }} // staggered fade-in
            >
              {line}
            </p>
          ))
        ) : (
          <p className="text-gray-500 text-center animate-bounce">No Lyrics Available</p>
        )}

        <div className="flex justify-center items-center mt-4">
          {!lyrics && (
            <div className="flex justify-center items-center mt-4">
              <button
                className={`flex px-6 py-2 border-2 border-accent text-foreground rounded-lg font-semibold transition-all duration-500 ease-in-out 
                ${loading ? "bg-gray-200 cursor-not-allowed" : "hover:bg-accent hover:border-white hover:text-white"} 
                ${loading ? "" : "active:scale-95"}`}
                onClick={handleLyrics}
                disabled={loading}
              >
                {loading ? (
                  <div className="
                  max-lg:text-base
                  w-6 h-6 border-4 border-t-transparent border-accent rounded-full animate-spin"></div>
                ) : (
                  "Get Lyrics"
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

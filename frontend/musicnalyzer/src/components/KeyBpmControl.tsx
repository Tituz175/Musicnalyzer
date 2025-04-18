/**

KeyBpmControl component for modifying the musical key and BPM of an audio track.
This component allows users to adjust the musical key and beats per minute (BPM) of an audio file.
It provides buttons for incrementing/decrementing the key, a dropdown for direct key selection,
and an input field for BPM modification. Additionally, it supports resetting modifications back
to the original key and BPM values.

Props:
incomingmusicalKey: The initial musical key of the track.
incomingbpm: The initial beats per minute of the track.
onKeyChange: Callback function to update audio stems and their properties.
originalKey: The original key of the track before modifications.
originalBpm: The original BPM of the track before modifications.
stems: Object containing URLs for each audio stem (e.g., soprano, alto, tenor, instrumentals).

Functional Components:
handleChange: Sends a request to change either the key or BPM on the server.
handleBpmInputChange: Handles BPM input changes and updates the track accordingly.
handleReset: Resets the key and BPM to their original values.
getDynamicKeyList: Generates a dynamically sorted list of musical keys with the current key in the center.

Key Features:
Allows dynamic modification of the musical key with a dropdown selection and increment/decrement buttons.
Enables BPM adjustments through direct input.
Supports communication with the backend to apply changes in key and BPM.
Provides a reset functionality to restore the original key and BPM.
Manages UI state, including dropdown visibility and loading indicators.

Usage:
<KeyBpmControl
incomingmusicalKey="C"
incomingbpm="120"
onKeyChange={handleKeyChange}
originalKey="C"
originalBpm={120}
stems={audioStems}
/>

@returns {JSX.Element} The rendered KeyBpmControl component.
*/


import { useState, useEffect, useRef } from "react";

const MUSICAL_KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

interface AudioStems {
    soprano: string;
    alto?: string;
    tenor?: string;
    instrumentals: string;
}

interface KeyBpmControlProps {
    incomingmusicalKey: string;
    incomingbpm: string;
    onKeyChange: (
        newAudioStems: AudioStems,
        options: { newKey?: string; newBPM?: number }
    ) => void;
    originalKey: string;
    originalBpm: number;
    stems: AudioStems;
}

interface ChangeParams {
    value: number;
    currentKey: string;
    currentBPM: number;
    songId: string;
    currentAudioStems: AudioStems;
}

export default function KeyBpmControl({
    incomingmusicalKey,
    incomingbpm,
    onKeyChange,
    originalKey,
    originalBpm,
    stems
}: KeyBpmControlProps) {

    const [songId, setSongId] = useState<string | null>(null);
    const [musicalKey, setMusicalKey] = useState(incomingmusicalKey);
    const [bpm, setBpm] = useState(incomingbpm);
    const [loading, setLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [tempBpm, setTempBpm] = useState(bpm);


    useEffect(() => {
        setMusicalKey(incomingmusicalKey);
        setBpm(incomingbpm);
    }, [incomingmusicalKey, incomingbpm]);

    useEffect(() => {
        setTempBpm(bpm);
    }, [bpm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        const data = localStorage.getItem("metadata");
        const parsedData = data ? JSON.parse(data).id : null;
        setSongId(parsedData);
    }, []);

    const changeOnServer = async (url: string, params: ChangeParams) => {
        setLoading(true);
        const body = { ...params };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error(`Error:, ${response.status}`);
            return response;
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (response: Response, type: string) => {
        if (response.ok) {
            const data = await response.json();
            const { soprano, alto, tenor, instrumental, new_key, new_bpm } = data;
            const newStems: AudioStems = { soprano, alto, tenor, instrumentals: instrumental };
            
            if (type === "key") {
                setMusicalKey(new_key);
                onKeyChange(newStems, { newKey: new_key });
            } else if (type === "bpm") {
                setBpm(new_bpm.toString());
                onKeyChange(newStems, { newBPM: new_bpm });
            } else if (type === "reset") {
                setMusicalKey(originalKey);
                setBpm(originalBpm.toString());
                onKeyChange(newStems, { newKey: originalKey, newBPM: originalBpm });
            }
        } else {
            console.error("Modification Failed");
        }
    };

    const handleChange = async (
        type: "key" | "bpm",
        value: number,
        // event: React.MouseEvent
    ) => {
        const url = type === "key" ? "/change_key" : "/change_bpm";
        try {
            const response = await changeOnServer(
                `http://localhost:5000${url}`,
                {
                    value,
                    currentKey: musicalKey,
                    currentBPM: parseInt(bpm),
                    songId: songId as string,
                    currentAudioStems: stems
                }
            );
            await handleResponse(response, type);
        } catch (error) {
            console.error("Error changing ${type}:", error);
        }
    };

    const getDynamicKeyList = () => {
        const index = MUSICAL_KEYS.indexOf(musicalKey);
        if (index === -1) return MUSICAL_KEYS;
        const before = MUSICAL_KEYS.slice(0, index);
        const after = MUSICAL_KEYS.slice(index + 1);
        return [...after, musicalKey, ...before];
    };

    const handleBpmInputChange = async () => {
        const parsedTemp = parseInt(tempBpm);
        const parsedCurrent = parseInt(bpm);
    
        if (!isNaN(parsedTemp) && parsedTemp !== parsedCurrent) {
            const diff = parsedTemp - parsedCurrent;
            await handleChange("bpm", diff);
        } else {
            // Reset tempBpm if invalid or unchanged
            setTempBpm(bpm);
        }
    };
    

    const handleReset = async () => {
        const stem = localStorage.getItem("originalStem");
        const originalStems = stem ? JSON.parse(stem) : null
        if (originalStems) {
            onKeyChange(
                originalStems
                , { newKey: originalKey, newBPM: originalBpm });
        }
        try {
            const response = await changeOnServer("http://localhost:5000/reset", { songId: songId as string });
            await handleResponse(response, "reset");
        } catch (error) {
            console.error("Error resetting song:", error);
        }
    };

    const showResetButton = musicalKey !== originalKey || parseInt(bpm) !== originalBpm;

    return (
        <div className="
        max-lg:space-x-2 max-lg:py-2
        w-full flex justify-around items-center text-2xl font-semibold py-6 space-x-6 mb-14">
            {/* Key Control */}
            <div className="
            relative flex flex-col items-center" ref={dropdownRef}>
                <h4 className="
                max-lg:text-lg max-lg:font-bold
                text-center mb-2">Key</h4>
                <div className="
                flex items-center border-2 border-accent rounded-lg overflow-hidden">
                    <button className="
                    px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90" 
                    onClick={() => handleChange("key", -1)}>-</button>
                    <div
                        className="
                        max-lg:text-lg max-lg:font-bold max-lg:px-3 max-lg:py-0.5
                        relative cursor-pointer px-6 py-2 border-x-2 border-accent bg-gray-50"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                    >
                        {musicalKey}
                    </div>
                    <button className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90" onClick={() => handleChange("key", 1)}>+</button>
                </div>
                {dropdownOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-1 z-10 max-h-48 overflow-y-auto text-center">
                        {getDynamicKeyList()
                        .filter((key) => key !== musicalKey)
                        .map((key, index) => {
                            let value = index + 1; // Start from 1
                                if (value > 6) {
                                    value = value - 12; // Convert values above 6 to negative shifts
                                }

                        return (    
                            <div 
                                key={key} 
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer" 
                                onClick={() => { 
                                    console.log(value, key);
                                    // setMusicalKey(key); 
                                    handleChange("key", value); // Calculate shift relative to current position
                                    setDropdownOpen(false); 
                                }}
                            >
                                {key}
                            </div>
                        );
                        })}
                    </div>
                )}
            </div>

            {/* Reset Button */}
            {showResetButton && (
                <button
                    className="
                    max-lg:text-lg max-lg:font-bold max-lg:px-3 max-lg:py-0.5
                    px-6 py-2 border-2 border-accent text-foreground rounded-lg hover:bg-accent hover:text-white transition-all duration-300 ease-in-out"
                    onClick={handleReset}
                >
                    {loading ? "Loading..." : "Reset"}
                </button>
            )}

            {/* BPM Control */}
            <div className="flex flex-col items-center">
                <h4 className="
                max-lg:text-lg max-lg:font-bold
                text-center mb-2">BPM</h4>
                <div className="flex items-center border-2 border-accent rounded-lg overflow-hidden">
                    <button
                        className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90"
                        onClick={() => handleChange("bpm", -1)}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        className="
                        max-lg:text-lg max-lg:font-bold max-lg:px-3 max-lg:w-[55px] max-lg:py-0.5
                        px-6 py-2 text-center border-x-2 border-accent bg-gray-50 w-20 focus:outline-none"
                        value={tempBpm}
                        onChange={(e) => setTempBpm(e.target.value)}
                        onBlur={handleBpmInputChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                (e.target as HTMLInputElement).blur(); // Triggers onBlur handler
                            }
                        }}
                    />
                    <button
                        className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90"
                        onClick={() => handleChange("bpm", 1)}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";

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

    console.log(stems);

    const [songId, setSongId] = useState<string | null>(null);
    const [musicalKey, setMusicalKey] = useState(incomingmusicalKey);
    const [bpm, setBpm] = useState(incomingbpm);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMusicalKey(incomingmusicalKey);
        setBpm(incomingbpm);
    }, [incomingmusicalKey, incomingbpm]);

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
        direction: "plus" | "minus",
        event: React.MouseEvent
    ) => {
        const url = type === "key" ? "/change_key" : "/change_bpm";
        const value = direction === "plus" ? 1 : -1;
        // const newBPM = type === "bpm" ? parseInt(bpm) + value : parseInt(bpm);

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
        <div className="w-full flex justify-around items-center text-2xl font-semibold py-6 space-x-6">
            {/* Key Control */}
            <div className="flex flex-col items-center">
                <h4 className="text-center mb-2">Key</h4>
                <div className="flex items-center border-2 border-accent rounded-lg overflow-hidden">
                    <button
                        className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90"
                        onClick={(e) => handleChange("key", "minus", e)}
                    >
                        -
                    </button>
                    <span className="px-6 py-2 border-x-2 border-accent bg-gray-50">{musicalKey}</span>
                    <button
                        className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90"
                        onClick={(e) => handleChange("key", "plus", e)}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Reset Button */}
            {showResetButton && (
                <button
                    className="px-6 py-2 border-2 border-accent text-foreground rounded-lg hover:bg-accent hover:text-white transition-all duration-300 ease-in-out"
                    onClick={handleReset}
                >
                    {loading ? "Loading..." : "Reset"}
                </button>
            )}

            {/* BPM Control */}
            <div className="flex flex-col items-center">
                <h4 className="text-center mb-2">BPM</h4>
                <div className="flex items-center border-2 border-accent rounded-lg overflow-hidden">
                    <button
                        className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90"
                        onClick={(e) => handleChange("bpm", "minus", e)}
                    >
                        -
                    </button>
                    <span className="px-6 py-2 border-x-2 border-accent bg-gray-50">{bpm}</span>
                    <button
                        className="px-4 py-2 cursor-pointer hover:bg-accent hover:text-white transition active:scale-90"
                        onClick={(e) => handleChange("bpm", "plus", e)}
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
}

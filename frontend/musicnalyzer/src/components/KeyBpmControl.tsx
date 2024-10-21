import { useState, useEffect } from "react";

interface KeyBpmControlProps {
    musicalKey: string;
    bpm: string;
    onKeyChange: (newKey: string, newAudioPath: string) => void;
}

export default function KeyBpmControl({ musicalKey, bpm, onKeyChange }: KeyBpmControlProps) {
    const [songId, setSongId] = useState<string | null>(null);
    const [initialKey, setInitialKey] = useState(musicalKey);

    useEffect(() => {
        // Safe to use localStorage here since we're on the client-side
        const data = localStorage.getItem('metadata');
        const parsedData = data ? JSON.parse(data).id : null;
        setSongId(parsedData);
    }, []);


    const handleKeyChange = async (direction: 'plus' | 'minus', e) => {
        const value = direction === 'plus' ? 1 : -1;

        // Update the key directly instead of relying on initialKey before it updates
        const newKey = e.target.parentElement.childNodes[1].innerText;

        setInitialKey(newKey);  // Set new key here

        console.log('Current key:', newKey);  // Log the updated key directly
        console.log(initialKey);
        console.log('Value change:', value);

        try {
            // Call your backend to change the key
            const response = await fetch('http://localhost:5000/change_key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    value: value,
                    song_id: songId,
                    initialKey: newKey
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const { new_key, new_path } = data;


                musicalKey = new_key

                onKeyChange(new_key, new_path);


                console.log('Key changed successfully:', data);
            } else {
                console.error('Failed to change key');
            }
        } catch (error) {
            console.error('Error changing key:', error);
        }
    };

    return (
        <div className="w-full flex justify-evenly text-2xl font-semibold py-6">
            <div className="flex flex-col w-1/2 justify-center items-center">
                <h4 className="text-center mb-2">Key</h4>
                <div className="w-2/5 flex justify-between items-center border-2 border-accent px-6 rounded-lg">
                    <span className="cursor-pointer" onClick={(e) => handleKeyChange("minus", e)}>-</span>
                    <span className="px-6 border-x-2 border-accent">{musicalKey}</span> 
                    <span className="cursor-pointer" onClick={(e) => handleKeyChange("plus", e)}>+</span>
                </div>
            </div>
            <div className="flex flex-col w-1/2 justify-center items-center">
                <h4 className="text-center mb-2">BPM</h4>
                <div className="w-2/5 flex justify-between items-center border-2 border-accent px-6 rounded-lg">
                    <span className="cursor-pointer">-</span>
                    <span className="px-6 border-x-2 border-accent">{bpm}</span>
                    <span className="cursor-pointer">+</span>
                </div>
            </div>
        </div>
    );
}

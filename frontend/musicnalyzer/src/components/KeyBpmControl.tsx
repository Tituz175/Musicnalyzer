import { useState } from "react";

interface KeyBpmControlProps {
    musicalKey: string;
    bpm: string;
}

export default function KeyBpmControl({ musicalKey, bpm }: KeyBpmControlProps) {
    const data = localStorage.getItem('metadata');
    const songId = data ? JSON.parse(data).id : null;
    const [initialKey, setInitialKey] = useState(musicalKey)

    const handleKeyChange = async (direction: 'plus' | 'minus', e) => {
        const value = direction === 'plus' ? 1 : -1
        setInitialKey(e.target.parentElement.children[1].textContent)
        console.log(value)
        console.log(initialKey)

    }


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

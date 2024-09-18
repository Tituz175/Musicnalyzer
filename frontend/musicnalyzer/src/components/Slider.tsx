"use client"

import { useState, ChangeEvent } from 'react';

const VerticalSlider: React.FC = () => {
  const [value, setValue] = useState<number>(55); // Default value at 55%

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value)); // Update the slider value
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Slider Value */}
      <div className="text-lg font-medium">{value}%</div>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        className="w-2 h-48 appearance-none bg-gray-300 rounded-full relative"
        onChange={handleSliderChange}
        style={{
          background: `linear-gradient(to top, black ${value}%, lightgray ${value}%)`,
        }}
      />

      {/* Custom styling for slider thumb */}
      {/* <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
          cursor: pointer;
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border: 2px solid black;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style> */}

      {/* Label at the bottom */}
      <div className="text-xl font-semibold">Soprano</div>
    </div>
  );
};

export default VerticalSlider;

// import { useState } from 'react';

interface sliderprops {
  volume: number;
  onVolumeChange: (value: number) => void;
  inputValue: string;
}

const VerticalSlider: React.FC<sliderprops> = ({ volume, onVolumeChange, inputValue }) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
  };

  return (
    <div className="slider-container">
      <div className="value-display" id='rangeValue'>
        {(volume * 100).toFixed(0)}%
      </div>
      <input
        type="range"
        className="range vertical"
        value={volume}
        id="volume"
        min="0"
        step="0.01"
        max="1"
        onChange={handleVolumeChange}
      />
      <div className="slider-title">
        {inputValue}
      </div>
    </div>
  );
};

export default VerticalSlider;

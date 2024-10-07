import { useState } from 'react';

type sliderprops = {
  inputValue: string,
};

const VerticalSlider: React.FC<sliderprops> = ({ inputValue }) => {
  const [rangeValue, setRangeValue] = useState<number>(0);

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(e.target.value));
  };

  return (
    <div className="slider-container">
      <div className="value-display" id='rangeValue'>
        {rangeValue}
      </div>
      <input
        type="range"
        className="range"
        value={rangeValue}
        min="0"
        max="100"
        onChange={handleRangeChange}
      />
      <div className="slider-title">
        {inputValue}
      </div>
    </div>
  );
};

export default VerticalSlider;

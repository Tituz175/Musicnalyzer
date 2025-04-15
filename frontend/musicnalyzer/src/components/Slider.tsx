/**
 * A vertical slider component for adjusting volume levels.
 *
 * This component displays a range input that allows users to modify the volume.
 * It also shows the current volume as a percentage and an optional label.
 *
 * @param {SliderProps} props - The properties of the vertical slider component.
 * @returns {JSX.Element} The rendered vertical slider.
 */

interface sliderprops {
  volume: number;
  stem?: string;
  onVolumeChange: (value: number) => void;
  inputValue: string;
}

const VerticalSlider: React.FC<sliderprops> = ({ volume, stem, onVolumeChange, inputValue }) => {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
  };

  return (
    <div className={`max-2xl:w-[80px] slider-container flex ${stem == "" ? "hidden" : ""}`}>
      <div className="value-display" id='rangeValue'>
        {(volume * 100).toFixed(0)}%
      </div>
      <input
        type="range"
        className="range vertical"
        value={volume}
        id="volume"
        min="0.004"
        step="0.01"
        max="1"
        onChange={handleVolumeChange}
      />
      <div className="
      max-lg:text-sm max-lg:font-bold
      slider-title font-bold">
        {inputValue}
      </div>
    </div>
  );
};

export default VerticalSlider;

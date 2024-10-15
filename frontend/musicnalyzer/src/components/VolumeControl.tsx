import VerticalSlider from "@/components/Slider";

interface VolumeControlProps {
    volume: number;
    onVolumeChange: (value: number) => void;
  }

export default function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="w-full flex justify-between">
      <VerticalSlider volume={volume} onVolumeChange={onVolumeChange} inputValue="Soprano" />
      <VerticalSlider volume={volume} onVolumeChange={onVolumeChange} inputValue="Alto" />
      <VerticalSlider volume={volume} onVolumeChange={onVolumeChange} inputValue="Tenor" />
      <VerticalSlider volume={volume} onVolumeChange={onVolumeChange} inputValue="Instrumentals" />
    </div>
  );
}

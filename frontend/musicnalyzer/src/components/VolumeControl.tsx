import VerticalSlider from "@/components/Slider";

interface VolumeControlProps {
  volume: {
    soprano: number;
    alto: number;
    tenor: number;
    instrumentals: number;
  };
  onVolumeChange: (stem: string, value: number) => void;
  stemsUrl: {
    soprano: string;
    alto?: string;
    tenor?: string;
    instrumentals: string;
  };
}

export default function VolumeControl({
  volume,
  onVolumeChange,
  stemsUrl,
}: VolumeControlProps) {
  return (
    <div className='w-full flex justify-evenly'>
      <VerticalSlider
        volume={volume.soprano}
        stem={stemsUrl.soprano}
        onVolumeChange={(value) => onVolumeChange("soprano", value)}
        inputValue={stemsUrl.alto == "" ? "Vocals" : "Soprano"}
      />
      <VerticalSlider
        volume={volume.alto}
        stem={stemsUrl.alto ? stemsUrl.alto : ""}
        onVolumeChange={(value) => onVolumeChange("alto", value)}
        inputValue='Alto'
      />
      <VerticalSlider
        volume={volume.tenor}
        stem={stemsUrl.tenor ? stemsUrl.tenor : ""}
        onVolumeChange={(value) => onVolumeChange("tenor", value)}
        inputValue='Tenor'
      />
      <VerticalSlider
        volume={volume.instrumentals}
        stem={stemsUrl.instrumentals}
        onVolumeChange={(value) => onVolumeChange("instrumentals", value)}
        inputValue='Instrumentals'
      />
    </div>
  );
}

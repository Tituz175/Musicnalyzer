import { useRef, useEffect, useState } from "react";

interface WaveformProps {
  audioStems: [string, string][]; // Array of [name, url] for audio stems
}

export default function Waveform({ audioStems }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visualizationMode, setVisualizationMode] = useState<"single" | "all">("single");
  const [selectedStem, setSelectedStem] = useState("soprano");
  const animationProgress = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  const drawWaveform = async (mode: "single" | "all", animate = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.offsetWidth * dpr;
    const height = canvas.offsetHeight * dpr;

    canvas.width = width;
    canvas.height = height;

    if (animate) {
      animationProgress.current = 0; // Reset animation progress
      animateWaveform(ctx, mode, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
      await draw(ctx, mode, width, height, 1); // Render final state
    }
  };

  const animateWaveform = (
    ctx: CanvasRenderingContext2D,
    mode: "single" | "all",
    width: number,
    height: number
  ) => {
    const step = 0.05; // Animation increment

    const render = async () => {
      if (animationProgress.current < 1) {
        animationProgress.current += step;
        ctx.clearRect(0, 0, width, height);
        await draw(ctx, mode, width, height, animationProgress.current);
        animationFrameId.current = requestAnimationFrame(render);
      } else {
        // Complete animation and render final state
        ctx.clearRect(0, 0, width, height);
        await draw(ctx, mode, width, height, 1);
        cancelAnimationFrame(animationFrameId.current!);
      }
    };

    render();
  };

  const draw = async (
    ctx: CanvasRenderingContext2D,
    mode: "single" | "all",
    width: number,
    height: number,
    opacity: number
  ) => {
    ctx.save();
    ctx.globalAlpha = opacity;

    if (mode === "single") {
      const stemIndex = audioStems.findIndex(([name]) => name === selectedStem);
      if (stemIndex !== -1) {
        await drawAudio(audioStems[stemIndex][1], ctx, width, height);
      }
    } else {
      const combinedWaveform = await combineWaveforms(audioStems.map(([, url]) => url));
      drawCombinedWaveform(combinedWaveform, ctx, width, height);
    }

    ctx.restore();
  };

  const combineWaveforms = async (urls: string[]) => {
    // Combine waveforms logic (same as before)
  };

  const drawAudio = async (
    url: string,
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Fetch audio and draw single waveform (same as before)
  };

  const drawCombinedWaveform = (
    data: number[],
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    data.forEach((value, i) => {
      const x = (i / data.length) * width;
      const y = (1 - value) * height * 0.5;
      ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#DE7456";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    const renderWaveform = async () => {
      await drawWaveform(visualizationMode, true); // Enable animation
    };
    renderWaveform();

    // Cleanup animation frame when the component unmounts or dependencies change
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [visualizationMode, selectedStem, audioStems]);

  return (
    <>
      <div className="flex justify-between items-center mb-4 font-secondary font-semibold">
        <button
          onClick={() =>
            setVisualizationMode((prev) => (prev === "single" ? "all" : "single"))
          }
          className="bg-accent text-white px-4 py-2 rounded-lg"
        >
          {visualizationMode === "single" ? "Show All Stems" : "Show Single Stem"}
        </button>

        {visualizationMode === "single" && (
          <select
            value={selectedStem}
            onChange={(e) => setSelectedStem(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded-lg outline-none"
          >
            {audioStems.map(([name]) => (
              <option key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        )}
      </div>
      <canvas ref={canvasRef} className="w-full h-48 bg-gray-100 rounded-t-lg"></canvas>
    </>
  );
}

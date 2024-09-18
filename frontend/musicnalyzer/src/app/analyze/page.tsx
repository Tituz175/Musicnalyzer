import VerticalSlider from "@/components/Slider";

export default function Analyze() {
  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-60 text-foreground">
      <h2 className="font-bold text-5xl font-secondary">Song Title</h2>
      <h3 className="font-semibold text-4xl font-secondary">Song Artist</h3>

      <section className="flex items-center w-full">
        <div className="w-1/2">
        <VerticalSlider />
        </div>
        <div className="w-1/2">
          <h4 className="font-semibold text-2xl font-secondary">Lyrics</h4>
          <div></div>
        </div>
      </section>
      <section>
        <div></div>
      </section>
    </div>
  )
}
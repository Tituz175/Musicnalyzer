import Image from "next/image"

type CardProps = {
  image: string,
  title: string,
  paragraph: string
}

export default function Card( {image, title, paragraph }: CardProps) {
  return(
    <div className="w-full bg-white border border-tertiary rounded-xl shadow-md overflow-hidden" style={{
      maxWidth: "24.5rem"
    }}>
      <div className="w-full h-64">
        <Image
          src={image}
          alt="card image"
          width={896}
          height={1152}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h4 className="text-xl font-secondary font-bold text-center">{title}</h4>
        <p className="mt-2 font-light text-lg text-foreground prose text-justify">{paragraph}</p>
      </div>
    </div>
  )
}
/**
 * Card component to display an image, title, and description.
 *
 * This component is a simple card layout that includes an image, a title, and a paragraph of text.
 * It's styled with rounded corners, a border, and shadow, suitable for displaying visually appealing content blocks.
 *
 * Props:
 * - `image`: URL of the image to display on the card.
 * - `title`: Title text displayed in bold at the center.
 * - `paragraph`: Description text shown below the title.
 *
 * Key Features:
 * - Responsive layout: The card has a defined max-width but adapts within a flexible container.
 * - Image display: Configured to fit within a specified aspect ratio with `object-cover`.
 * - Styled text: Title is styled as a bold heading, and paragraph has light font weight with justified alignment for readability.
 *
 * Usage:
 * ```
 * <Card
 *   image="/path/to/image.jpg"
 *   title="Card Title"
 *   paragraph="This is a sample description for the card."
 * />
 * ```
 *
 * @returns {JSX.Element} The rendered Card component.
 */

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

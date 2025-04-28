/**
 * Home component to render the landing page of the application.
 *
 * This component displays a full-page background image and several sections describing the application's features,
 * benefits, and purpose. It includes navigation to the upload page for starting the analysis process.
 *
 * Components:
 * - `NavBar`: The top navigation bar displayed throughout the application.
 * - `Footer`: The bottom footer component, shown on all pages.
 * - `Card`: Reusable component to showcase key features such as "Vocal Part and Instrument Extraction" and "Key and Tempo Analysis".
 *
 * Layout Sections:
 * 1. Main Hero Section:
 *    - Background image with overlay text and a call-to-action button ("Analyze") that navigates to the upload page.
 * 2. About Section:
 *    - Provides an overview of the app's purpose and how it aids musicians, vocalists, and enthusiasts.
 * 3. Features Section:
 *    - Highlights key functionalities with descriptions, each represented by a Card component.
 * 4. Call-to-Action Section:
 *    - Encourages users to begin using the app for music analysis and customization, with an additional button to navigate to the upload page.
 *
 * Usage:
 * ```
 * <Home />
 * ```
 *
 * @returns {JSX.Element} The rendered Home component.
 */

"use client";

import Card from "@/components/Card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (
    <>
      <div
        className="w-full bg-cover bg-center h-[95vh] xxs:h-[70vh] md:h-[60vh] lg:h-[95vh] xl:h-[95vh]"
        style={{
          backgroundImage: "url('/images/main.jpg')",
        }}
      >
        <main className="
      xxs:items-center xxs:px-0 px-6
      md:items-center md:justify-evenly
      lg:items-start
      h-full w-full flex flex-col gap-8 justify-center">
          <div
            className="
          xxs:w-full xxs:h-full xxs:mt-0 xxs:mx-0 xxs:rounded-none xxs:px-4 
          md:py-6 md:space-y-10 
          lg:px-16 lg:py-16 lg:space-y-16 lg:w-2/5 lg:h-auto lg:rounded-xl lg:ml-52
          flex flex-col text-white px-8 py-8 space-y-8 rounded-xl ml-52"
            style={{
              background: "#242f3799",
            }}
          >
            <h1 className="
          xxs:text-4xl xxs:text-center
          md:text-6xl md:my-4 md:mx-20
          lg:text-left lg:text-8xl lg:m-0
          font-secondary font-bold">
              Your Musical Assistant
            </h1>
            <p className="
          xxs:text-2xl xxs:text-center xxs:leading-relaxed
          md:text-4xl md:mx-14 md:leading-relaxed
          lg:text-left lg:mx-0 lg:leading-normal lg:text-5xl
          text-5xl">
              Deconstruct your music into its individual components, unlock the hidden layers of your favorite songs.
            </p>
            <button
              onClick={() => {
                router.push("/upload");
              }}
              className="
            xxs:text-xl xxs:w-1/2 max-lg:mx-auto 
            font-extrabold text-3xl bg-accent text-white px-6 py-3.5 rounded-lg w-full"
            >
              Analyze
            </button>
          </div>
        </main>
      </div>

      <section className='xxs:px-6 xxs:py-0 xxs:my-6 md:px-14 lg:px-60 my-14 lg:py-14'>
        <div>
          <h2 className='
          xxs:text-xl xxs:pb-2
          md:text-3xl
          lg:text-5xl lg:pb-6
          font-bold text-accent font-secondary'>
            About
          </h2>
          <p className='
          xxs:text-sm xxs:pb-2 
          md:text-base
          lg:text-2xl lg:pb-6
          text-foreground font-light text-justify'>
            Musicnalyzer is more than just a tool. It&apos;s your musical
            companion, designed to empower vocalists, composers, and music
            enthusiasts by offering a deep dive into the intricacies of your
            favourite tracks. Unleash the power of music analysis by
            deconstructing your songs into individual components from vocals to
            instruments while gaining insights into the hidden harmonies,
            rhythms, and melodies that shape your music.
          </p>
          <p className='
          xxs:text-sm xxs:pb-2 
          md:text-base
          lg:text-2xl lg:pb-6
          text-foreground font-light text-justify'>
            For vocalists, Musicnalyzer is an invaluable resource, allowing you
            to isolate and learn your specific vocal and harmony parts with
            precision. Whether you&apos;re mastering a solo or perfecting group
            harmonies, Musicnalyzer helps you understand and internalize the
            nuances of each part, making it easier to practice and perform with
            confidence.
          </p>
          <p className='
          xxs:text-sm xxs:pb-2 
          md:text-base
          lg:text-2xl lg:pb-6
          text-foreground font-light text-justify'>
            Learn and grow as you improve your musical skills by understanding
            the underlying structure of your favourite pieces, and use these
            insights to master your desired musical tracks.
          </p>
        </div>
      </section>

      <section className='xxs:px-6 xxs:py-0 xxs:my-6 md:px-14 lg:px-60 my-14 lg:py-14'>
        <h2 className='
          xxs:text-xl xxs:pb-2
          md:text-3xl
          lg:text-5xl lg:pb-8
          font-bold text-accent font-secondary'>
          Features
        </h2>
        <div className='
        xxs:gap-6 xxs:flex-col
        md:flex-row md:gap-4
        flex justify-around'>
          <Card
            image='/images/card_img_1.jpg'
            title='Vocal Part and Instrument Extraction'
            paragraph='Precisely isolate soprano, alto, and tenor parts with the song instrumental. Analyze each vocal line for performance, technique, and harmonic relationships. Practice these parts independently or collaboratively to enhance your skills.'
          />
          <Card
            image='/images/card_img_2.jpg'
            title='Key and Tempo Analysis'
            paragraph="Accurately determine the song's key and tempo, then experiment by transposing it to different keys and adjusting the tempo to match your desired pace or style, allowing you to create unique versions and interpretations of your favorite songs that suit your vocal range or instrument."
          />
          <Card
            image='/images/card_img_3.jpeg'
            title='Lyrics in Multiple Languages'
            paragraph='Automatically extract and display song lyrics with high accuracy to deepen comprehension and cultural connection. Perfect for singers, language learners, and curious minds who want to experience music beyond the melody.'
          />
        </div>
      </section>
      <section className="
      xxs:px-8 xxs:mt-0 xxs:mb-4 xxs:py-0 
      md:px-14
      lg:px-60 lg:my-14 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center w-full justify-between">
          {/* Left Content */}
          <div className="
          xxs:mb-4
          w-full lg:w-2/5 flex flex-col justify-between mb-8 lg:mb-0">
            <h3 className="font-bold text-accent text-4xl xxs:text-xl md:text-3xl lg:text-4xl font-secondary pb-4 max-w-md">
              Unleash the Full Potential of Your Music Today!
            </h3>
            <p className="
            xxs:text-sm 
            md:text-base 
            lg:text-xl
            font-light text-sm text-foreground prose text-justify">
              Dive deep into the details of any song, separate vocal parts, isolate instrumental, and even tweak the key and tempo to match your style. Whether you're a vocalist looking to perfect your craft or a music lover eager to explore, Musicnalyzer is your ultimate tool for music analysis and customization. Don’t just listen to music, experience it. Start Analyzing Now and take your music journey to the next level!
            </p>
            <button
              onClick={() => {
                router.push('/upload');
              }}
              className="
              xxs:text-base xxs:w-full
              sm:text-2xl
              lg:w-3/12
              bg-foreground text-white px-6 py-2.5 rounded-lg font-extrabold w-full text-xl hover:bg-accent transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 mt-4"
            >
              Analyze
            </button>
          </div>

          {/* Right Image */}
          <div className="w-full md:h-1/4 lg:w-2/5 overflow-hidden rounded-xl">
            <Image
              src="/images/card_img_4.jpg"
              alt="card"
              width="896"
              height="1000"
              className="w-full h-full md:h-1/4 object-cover"
            />
          </div>
        </div>
      </section>


    </>
  );
}

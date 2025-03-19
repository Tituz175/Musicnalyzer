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
      className='w-full bg-cover bg-center'
      style={{
        backgroundImage: "url('/images/main.jpg')",
        height: "95vh",
      }}
    >
      <main className='h-full w-full flex flex-col gap-8 row-start-2 sm:items-start justify-center'>
        <div
          className='w-2/5 h-auto flex flex-col text-white ml-52 px-16 py-16 space-y-16 rounded-xl'
          style={{
            background: "#242f3799",
          }}
        >
          <h1 className='font-secondary text-8xl font-bold'>
            Your Musical Assistant
          </h1>
          <p className='text-5xl leading-normal'>
            Deconstruct your music into its individual components, unlock the
            hidden layers of your favorite songs.
          </p>
          <button onClick={() => {
                router.push('/upload');
              }} className='font-extrabold text-3xl bg-accent text-white px-6 py-3.5 rounded-lg w-4/12'>
            Analyze
          </button>
        </div>
      </main>
      </div>
      <section className='sm:px-8 md:px-16 lg:px-60 my-14 py-14'>
        <div>
          <h2 className='font-bold text-accent text-5xl font-secondary pb-6'>
            About
          </h2>
          <p className='text-foreground font-light text-2xl pb-6'>
            Musicnalyzer is more than just a tool. It&apos;s your musical
            companion, designed to empower vocalists, composers, and music
            enthusiasts by offering a deep dive into the intricacies of your
            favourite tracks. Unleash the power of music analysis by
            deconstructing your songs into individual components from vocals to
            instruments while gaining insights into the hidden harmonies,
            rhythms, and melodies that shape your music.
          </p>
          <p className='text-foreground font-light text-2xl pb-6'>
            For vocalists, Musicnalyzer is an invaluable resource, allowing you
            to isolate and learn your specific vocal and harmony parts with
            precision. Whether you&apos;re mastering a solo or perfecting group
            harmonies, Musicnalyzer helps you understand and internalize the
            nuances of each part, making it easier to practice and perform with
            confidence.
          </p>
          <p className='text-foreground font-light text-2xl pb-6'>
            Learn and grow as you improve your musical skills by understanding
            the underlying structure of your favourite pieces, and use these
            insights to master your desired musical tracks.
          </p>
        </div>
      </section>
      <section className='sm:px-8 md:px-16 lg:px-60 my-14 py-14'>
        <h2 className='font-bold text-accent text-5xl font-secondary pb-12'>
          Features
        </h2>
        <div className='flex justify-around'>
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
            paragraph='Precisely isolate soprano, alto, and tenor parts with the song instrumental. Analyze each vocal line for performance, technique, and harmonic relationships. Practice these parts independently or collaboratively to enhance your skills.'
          />
        </div>
      </section>
      <section className='sm:px-8 md:px-16 lg:px-60 my-14 py-14'>
        <div className="flex w-full h-96 justify-between">
          <div className="w-2/5 flex flex-col justify-between">
            <h3 className="font-bold text-accent text-4xl font-secondary pb-4 max-w-md">Unleash the Full Potential of Your Music Today!</h3>
            <p className="font-light text-xl text-foreground prose text-justify">
              Dive deep into the details of any song, separate vocal parts,
              isolate instrumental, and even tweak the key and tempo to match
              your style. Whether you&apos;re a vocalist looking to perfect your
              craft or a music lover eager to explore, Musicnalyzer is your
              ultimate tool for music analysis and customization. Don&apos;t just
              listen to music, experience it. Start Analyzing Now and take your
              music journey to the next level!
            </p>
            <button onClick={() => {
                router.push('/upload');
              }} className='bg-foreground text-white px-6 py-2.5 rounded-lg font-extrabold w-3/12 text-2xl hover:bg-accent transition-all duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 mt-4'>
              Analyze
            </button>
          </div>
          <div className="w-2/5 overflow-hidden rounded-xl">
            <Image src="/images/card_img_4.jpg" alt="card" width="896" height="1152" className="w-full h-full object-cover"/>
          </div>
        </div>
      </section>
    </>
  );
}

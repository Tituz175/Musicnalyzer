export default function About() {
  return (
    <>
      <section className='xxs:px-6 xxs:py-0 xxs:my-3 md:px-14 lg:px-60 my-14 lg:py-14'>
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
          Musicnalyzer was born from a passion for music and technology, 
          designed to empower vocalists, composers, and music enthusiasts 
          with a powerful tool for indepth music analysis. Whether you're 
          looking to study the intricacies of a song, remix a track, or 
          simply enjoy your favorite music in a new way, Musicnalyzer 
          offers a seamless experience.
        </p>
        <p className='
          xxs:text-sm xxs:pb-2 
          md:text-base
          lg:text-2xl lg:pb-6
          text-foreground font-light text-justify'>
          For vocalists, Musicnalyzer serves as a dedicated resource 
          to isolate and learn your vocal and harmony parts with precision. 
          It’s not just about hearing your part; it’s about understanding 
          how your voice fits within the broader context of the song, 
          helping you refine your performance and gain confidence.
        </p>
        <p className='
          xxs:text-sm xxs:pb-2 
          md:text-base
          lg:text-2xl lg:pb-6
          text-foreground font-light text-justify'>
          Our application utilizes cutting edge algorithms to separate 
          vocal parts and instruments, extract lyrics, and allow for 
          key and tempo adjustments. We are committed to making music 
          more accessible and customizable, ensuring that you can enjoy 
          and interact with your favorite tracks in ways that suit your needs.
        </p>
      </section>
    </>
  )
}
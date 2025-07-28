import React from 'react';

const HeroBanner = () => {
  return (
    <section className="relative w-screen h-screen overflow-hidden pt-20 font-sans">
      {/* Background Image */}
      <img
        src="/hero.jpg"
        alt="hero background"
        className="absolute inset-0 object-cover w-full h-full brightness-75"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 z-10" />

      {/* Text Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight tracking-wide drop-shadow-2xl">
          Building Dreams with <span className="text-[#56CCF2]">Trust</span> & Precision
        </h1>
        <p className="text-white mt-6 text-lg md:text-2xl max-w-2xl leading-relaxed tracking-wide">
          Welcome to HPR Infra — Hyderabad's trusted name in real estate excellence.
        </p>

        <a
          href="#projects"
          className="mt-8 inline-block px-8 py-3 text-lg font-medium text-white bg-[#56CCF2] hover:bg-[#3894bd] transition rounded-full shadow-md"
        >
          Explore Our Projects
        </a>
      </div>
    </section>
  );
};

export default HeroBanner;

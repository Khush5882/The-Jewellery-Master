import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: 'url(/your-image.jpg)' }}>
      {/* Overlay for the background */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full">
        <h1 className="text-5xl sm:text-6xl font-bold text-white animate__animated animate__fadeIn animate__delay-1s">
          Discover Timeless Jewelry
        </h1>
        <p className="text-lg sm:text-xl text-white opacity-75 mt-4 animate__animated animate__fadeIn animate__delay-2s">
          Shop exclusive collections crafted with elegance.
        </p>
        {/* Call-to-action button */}
        <div className="mt-6">
          <a
            href="/shop"
            className="px-8 py-3 bg-primary text-white text-lg rounded-full transition-all hover:bg-accent hover:scale-105 transform"
          >
            Shop Now
          </a>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;

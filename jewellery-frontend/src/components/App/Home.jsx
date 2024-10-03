import React, { useState, useEffect } from 'react'; // Import useEffect from React
import Header from './Header';
import Products from './Products';

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        { id: 1, image: 'pexels-didsss-1302307.jpg' },
        { id: 2, image: 'pexels-gdtography-277628-6563393.jpg' },
        { id: 3, image: 'pexels-godisable-jacob-226636-1191531.jpg' },
        { id: 4, image: 'pexels-pixabay-265906.jpg' },
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + slides.length) % slides.length
        );
    };

    // Automatically go to the next slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000); // 5000 ms = 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <div>

            <div className="relative w-full h-[500px]"> {/* Set height to 500px */}
                {/* Carousel Items */}
                <div className="carousel h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`carousel-item h-full ${
                                index === currentIndex ? 'block' : 'hidden'
                            }`}
                        >
                            <img
                                src={`/${slide.image}`} // Ensure images are referenced correctly
                                alt={`Slide ${slide.id}`}
                                className="w-full h-full object-cover" // Cover the entire height and width
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                    onClick={prevSlide}
                >
                    &#10094;
                </button>
                <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                    onClick={nextSlide}
                >
                    &#10095;
                </button>
            </div>
            <Products/>
        </div>
        
    );
}

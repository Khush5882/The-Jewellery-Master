import React, { useState, useEffect } from 'react'; // Import useEffect from React
import Header from './Header';
import MetalInvestment from './MetalInvestment';

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
                            className={`carousel-item h-full ${index === currentIndex ? 'block' : 'hidden'}`}
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

            {/* About Us Section */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">About Us</h2>
                    <p className="text-lg text-gray-600">
                        At [Jewelry Brand], we create timeless pieces that celebrate elegance, craftsmanship, and style. 
                        Our jewelry is designed to bring beauty and sophistication into your life, with an emphasis on high-quality materials and attention to detail.
                    </p>
                </div>
            </section>

            {/* Vision Section */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Vision</h2>
                    <p className="text-lg text-gray-600">
                        Our vision is to be the leading provider of luxury jewelry that combines modern design with classic elegance. 
                        We aspire to craft pieces that stand the test of time, creating memories and moments that will last forever.
                    </p>
                </div>
            </section>

            {/* Full-Width Photo */}
            <section>
                <img
                    src="/banner.jpg"
                    alt="Our Vision Banner"
                    className="w-full h-auto object-cover"
                />
            </section>

            {/* Jewelry Collection Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Jewelry Collection</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Engagement Rings</h3>
                            <p className="text-gray-600">
                                Our engagement rings feature exquisite designs, showcasing diamonds and gemstones in settings that perfectly represent your love.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Necklaces & Pendants</h3>
                            <p className="text-gray-600">
                                Discover our range of stunning necklaces and pendants, crafted to complement any outfit and elevate your style.
                            </p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Bracelets & Bangles</h3>
                            <p className="text-gray-600">
                                Our bracelets and bangles collection features intricate designs that are both elegant and versatile for every occasion.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Sections */}
        </div>
    );
}

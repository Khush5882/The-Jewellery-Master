import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection'; // Import HeroSection
import MetalInvestment from './MetalInvestment';

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        { id: 1, image: 'pexels-didsss-1302307.jpg', caption: 'Exquisite Craftsmanship' },
        { id: 2, image: 'pexels-gdtography-277628-6563393.jpg', caption: 'Timeless Elegance' },
        { id: 3, image: 'pexels-godisable-jacob-226636-1191531.jpg', caption: 'Modern Style' },
        { id: 4, image: 'pexels-pixabay-265906.jpg', caption: 'Luxury Redefined' },
    ];

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <HeroSection /> {/* Render Hero Section */}

            {/* Carousel Section */}
            <div className="relative w-full h-[500px]">
                <div className="carousel h-full">
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`carousel-item h-full ${index === currentIndex ? 'block' : 'hidden'}`}
                        >
                            <img
                                src={`/${slide.image}`}
                                alt={`Slide ${slide.id}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                                {slide.caption}
                            </div>
                        </div>
                    ))}
                </div>
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

           {/* Promotional Banner */}
            <section className="bg-primary py-16"> {/* Changed from bg-pink-100 to bg-primary */}
              <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-extrabold text-white mb-6">Be Love</h2> {/* Changed text color to white for better contrast */}
                   <p className="text-lg text-white leading-relaxed mb-6">
                      Open your heart to our new collection that celebrates love in all its forms.
                   </p>
                  <button className="px-6 py-3 bg-secondary text-white rounded-full hover:bg-primary hover:text-white transition-all">
                     Shop the Collection
                  </button>
              </div>
            </section>
            {/* Featured Collection */}
            <section className="bg-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Featured Collection</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Discover our curated selection of pieces that embody elegance and style.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[ 
                            { name: 'Elegant Ring', image: 'elegant-ring.jpg', price: '$120' },
                            { name: 'Classic Necklace', image: 'classic-necklace.jpg', price: '$150' },
                            { name: 'Stylish Bracelet', image: 'stylish-bracelet.jpg', price: '$130' }
                        ].map((item) => (
                            <div key={item.name} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                                <img
                                    src={`/${item.image}`}
                                    alt={item.name}
                                    className="w-full h-64 object-cover mb-4 rounded"
                                />
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                                <p className="text-lg text-gray-600 mb-4">{item.price}</p>
                                <button className="px-6 py-2 bg-primary text-white rounded-full hover:bg-accent transition-all">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Shop by Category */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Shop by Category</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                        {[ 
                            { name: 'Charms', image: 'charms.jpg' },
                            { name: 'Necklaces', image: 'necklaces.jpg' },
                            { name: 'Rings', image: 'rings.jpg' },
                            { name: 'Bracelets', image: 'bracelets.jpg' },
                            { name: 'Earrings', image: 'earrings.jpg' }
                        ].map((category) => (
                            <div key={category.name} className="relative group">
                                <img
                                    src={`/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-lg font-semibold">{category.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="bg-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6">About Us</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Welcome to The Jewel Masters, where we craft timeless pieces that combine elegance and artistry.
                        Our mission is to bring beauty and sophistication into your life through high-quality jewelry
                        designed with passion and precision.
                    </p>
                </div>
            </section>
        </div>
    );
}

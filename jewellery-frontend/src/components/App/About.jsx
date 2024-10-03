import React from 'react';

const AboutJewelryMaster = () => {
  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">About Our Jewelry Master</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img 
              src="pexels-coppertist-wu-313365563-15955333.jpg" 
              alt="Jewelry Master" 
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Meet Our Master Artisan</h3>
              <p className="text-gray-600 mb-4">
                With over 20 years of experience, our jewelry master combines traditional techniques with modern designs to create stunning pieces that tell a story.
              </p>
              <p className="text-gray-600">
                Passionate about craftsmanship, every piece is meticulously handcrafted to ensure the highest quality and attention to detail.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img 
              src="pexels-eugenia-remark-5767088-13918657.jpg" 
              alt="Jewelry" 
              className="w-full h-72 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our Philosophy</h3>
              <p className="text-gray-600 mb-4">
                We believe that jewelry is more than just an accessory; it's a way to express individuality and celebrate moments. Each piece we create is a reflection of our commitment to quality and design.
              </p>
              <p className="text-gray-600">
                Join us on a journey to discover the perfect piece that resonates with you and captures your unique style.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutJewelryMaster;

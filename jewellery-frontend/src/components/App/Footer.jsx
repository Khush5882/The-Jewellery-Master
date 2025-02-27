import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok, FaShoppingBag, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f5d5ae] text-[#4b0f0f] py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
        
        {/* Left Section - Branding */}
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-semibold text-[#4b0f0f]">AS Jewelers</h2>
          <p className="italic text-[#8b0000] mt-2">Elegance in Every Detail.</p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="text-[#4b0f0f] hover:text-[#8b0000] transition"><FaFacebookF size={20} /></a>
            <a href="#" className="text-[#4b0f0f] hover:text-[#8b0000] transition"><FaInstagram size={20} /></a>
            <a href="#" className="text-[#4b0f0f] hover:text-[#8b0000] transition"><FaTwitter size={20} /></a>
            <a href="#" className="text-[#4b0f0f] hover:text-[#8b0000] transition"><FaTiktok size={20} /></a>
          </div>
        </div>

        {/* Center Section - Quick Links & Support */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3 text-[#8b0000]">Quick Links</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaShoppingBag className="text-[#8b0000]" />
                <a href="/shop" className="hover:text-[#8b0000]">Shop</a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#8b0000]" />
                <a href="/about" className="hover:text-[#8b0000]">About Us</a>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-[#8b0000]" />
                <a href="/contact" className="hover:text-[#8b0000]">Contact</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3 text-[#8b0000]">Customer Support</h3>
            <ul className="space-y-2">
              <li><a href="/shipping" className="hover:text-[#8b0000]">Shipping & Returns</a></li>
              <li><a href="/privacy" className="hover:text-[#8b0000]">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-[#8b0000]">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        {/* Right Section - Newsletter Signup */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-[#8b0000]">Subscribe to our Newsletter</h3>
          <p className="text-[#4b0f0f] text-sm mb-4 italic">Get exclusive offers & latest updates.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-2 bg-[#f5d5ae] border border-[#8b0000] text-[#4b0f0f] rounded-l focus:outline-none placeholder-[#8b0000]"
            />
            <button className="bg-[#8b0000] px-4 py-2 text-white rounded-r hover:bg-[#4b0f0f] transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-[#8b0000] pt-4 text-center text-sm text-[#4b0f0f]">
        <p>© {new Date().getFullYear()} AS Jewelers. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

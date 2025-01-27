<footer className="w-full bg-secondary text-white p-8">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
    {/* Company Info */}
    <div>
      <h3 className="text-2xl font-semibold mb-4">The Jewel Masters</h3>
      <p className="text-sm mb-4">Bringing elegance and artistry to your life with our curated selection of fine jewelry.</p>
      <div className="flex space-x-4">
        {/* Social Media Icons */}
        <a href="https://facebook.com" className="text-white hover:text-accent transition-colors">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://instagram.com" className="text-white hover:text-accent transition-colors">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://twitter.com" className="text-white hover:text-accent transition-colors">
          <i className="fab fa-twitter"></i>
        </a>
      </div>
    </div>

    {/* Quick Links */}
    <div>
      <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
      <ul className="space-y-2">
        <li><a href="/shop" className="text-white hover:text-accent transition-colors">Shop</a></li>
        <li><a href="/about" className="text-white hover:text-accent transition-colors">About Us</a></li>
        <li><a href="/faq" className="text-white hover:text-accent transition-colors">FAQ</a></li>
        <li><a href="/contact" className="text-white hover:text-accent transition-colors">Contact</a></li>
      </ul>
    </div>

    {/* Newsletter Signup */}
    <div>
      <h4 className="text-xl font-semibold mb-4">Join Our Newsletter</h4>
      <p className="text-sm mb-4">Get updates on new collections, offers, and jewelry trends directly to your inbox.</p>
      <div className="flex">
        <input
          type="email"
          placeholder="Your email address"
          className="px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none"
        />
        <button className="px-6 py-3 bg-secondary text-white rounded-lg shadow-lg hover:bg-primary hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none">
          Subscribe
        </button>
      </div>
    </div>

    {/* Contact Information */}
    <div>
      <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
      <ul className="space-y-2">
        <li><a href="mailto:support@jewelmasters.com" className="text-white hover:text-accent transition-colors">support@jewelmasters.com</a></li>
        <li><a href="tel:+123456789" className="text-white hover:text-accent transition-colors">+1 234 567 890</a></li>
        <li><a href="/store-locator" className="text-white hover:text-accent transition-colors">Store Locator</a></li>
      </ul>
    </div>
  </div>

  {/* Footer Bottom */}
  <div className="border-t border-white pt-6 mt-6 text-center">
    <p className="text-sm">&copy; 2025 The Jewel Masters Pvt. Ltd. All rights reserved.</p>
  </div>
</footer>

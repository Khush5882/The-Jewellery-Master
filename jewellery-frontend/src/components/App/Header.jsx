import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // To track open dropdown

  useEffect(() => {
    const username = localStorage.getItem('username');
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setCurrentUser(username);
    setIsAdmin(adminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const toggleCart = () => setCartOpen(!cartOpen);
  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);
  const handleLogin = () => navigate('/login');

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(prevDropdown => (prevDropdown === dropdownName ? null : dropdownName));
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <a href="/" className="text-2xl font-bold flex items-center">
          <img className="h-10 w-auto mr-2" src="/image-removebg-preview (2).png" alt="Logo" />
          <span className="font-mono">The Jewel Masters</span>
        </a>

        <div className="hidden lg:flex space-x-8">
          <a href="/" className="hover:text-gray-600">Home</a>
          <div
            className="relative group"
            onMouseEnter={() => handleDropdownToggle('shop')}
            onClick={() => handleDropdownToggle('shop')}
            onMouseLeave={() => handleDropdownToggle(null)}
          >
            <a href="/shop" className="hover:text-gray-600">Shop</a>
            {activeDropdown === 'shop' && (
              <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-md p-4 space-y-2 z-10">
                <h4 className="font-semibold text-gray-800">All Products</h4>
                <h4 className="font-semibold text-gray-800">Earrings</h4>
                <div className="pl-4 space-y-1">
                  <a href="/shop/earrings/hoops" className="block text-gray-700 hover:text-gray-500">Hoops</a>
                  <a href="/shop/earrings/studs" className="block text-gray-700 hover:text-gray-500">Studs</a>
                  <a href="/shop/earrings/danglers" className="block text-gray-700 hover:text-gray-500">Danglers</a>
                </div>
                <h4 className="font-semibold text-gray-800">Necklaces</h4>
                <div className="pl-4 space-y-1">
                  <a href="/shop/necklaces/chokers" className="block text-gray-700 hover:text-gray-500">Chokers</a>
                  <a href="/shop/necklaces/pendants" className="block text-gray-700 hover:text-gray-500">Pendants</a>
                  <a href="/shop/necklaces/lariats" className="block text-gray-700 hover:text-gray-500">Lariats</a>
                </div>
                <h4 className="font-semibold text-gray-800">Bracelets</h4>
                <div className="pl-4 space-y-1">
                  <a href="/shop/bracelets/cuffs" className="block text-gray-700 hover:text-gray-500">Cuffs</a>
                  <a href="/shop/bracelets/bangles" className="block text-gray-700 hover:text-gray-500">Bangles</a>
                  <a href="/shop/bracelets/chains" className="block text-gray-700 hover:text-gray-500">Chains</a>
                </div>
                <h4 className="font-semibold text-gray-800">Rings</h4>
                <div className="pl-4 space-y-1">
                  <a href="/shop/rings/solitaire" className="block text-gray-700 hover:text-gray-500">Solitaire</a>
                  <a href="/shop/rings/wedding" className="block text-gray-700 hover:text-gray-500">Wedding</a>
                  <a href="/shop/rings/stackable" className="block text-gray-700 hover:text-gray-500">Stackable</a>
                </div>
              </div>
            )}
          </div>
          <a href="/about" className="hover:text-gray-600">About</a>
          <a href="/jewellery-customization" className="hover:text-gray-600">Customize</a>
          {isAdmin && <a href="/admin" className="hover:text-gray-600">Admin</a>}
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full px-4 py-1 text-sm focus:border-indigo-500"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-2 right-2" />
          </div>
          <button onClick={toggleCart}>
            <ShoppingCartIcon className="h-6 w-6 text-gray-900" />
          </button>
          <div className="relative">
            {currentUser ? (
              <>
                <button onClick={toggleProfileDropdown} className="flex items-center">
                  <UserIcon className="h-6 w-6 text-gray-900" />
                  <span className="ml-2">{currentUser}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={() => navigate('/profile')}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button onClick={handleLogin} className="hover:text-gray-600">
                Login
              </button>
            )}
          </div>
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          <Dialog.Panel className="relative flex-1 bg-white p-6 w-3/4 h-3/4 mx-auto my-auto rounded-lg shadow-xl">
            <div className="flex items-center justify-between">
              <img className="h-10 w-auto" src="/path-to-your-logo.png" alt="Logo" />
              <button onClick={() => setMobileMenuOpen(false)}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              <a href="/" className="block hover:text-gray-600">Home</a>
              <a href="/shop" className="block hover:text-gray-600">Shop</a>
              <a href="/about" className="block hover:text-gray-600">About</a>
              <a href="/contact" className="block hover:text-gray-600">Contact</a>
              {isAdmin && <a href="/admin" className="block hover:text-gray-600">Admin</a>}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </header>
  );
};

export default Header;

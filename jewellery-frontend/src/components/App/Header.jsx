import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is an admin

  useEffect(() => {
    const username = localStorage.getItem('username');
    const adminStatus = localStorage.getItem('isAdmin') === 'true'; // Retrieve admin status from localStorage
    setCurrentUser(username);
    setIsAdmin(adminStatus); // Set admin status
  }, []);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAdmin'); // Clear admin status on logout
    navigate('/login');
    setCurrentUser(null);
    setIsAdmin(false);
    console.log('Logged out');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-gray-900 flex items-center">
              <span className="sr-only">Your Logo</span>
              <img
                className="h-10 w-auto mr-2 scale-150"
                src='/image-removebg-preview (2).png'
                alt="Logo"
              />
              <h3 className="text-2xl font-mono">The Jewel Masters</h3>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            <a href="/" className="text-gray-900 hover:text-gray-600">Home</a>
            <a href="/shop" className="text-gray-900 hover:text-gray-600">Shop</a>
            <a href="/about" className="text-gray-900 hover:text-gray-600">About</a>
            <a href="/jewellery-customization" className="text-gray-900 hover:text-gray-600">Customize</a>
            {isAdmin && ( // Conditionally render the Admin link
              <a href="/admin" className="text-gray-900 hover:text-gray-600">Admin</a>
            )}
          </div>

          {/* Search, Cart, and Profile/Login Button */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:border-indigo-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 absolute top-2 right-2" />
            </div>

            <div>
              <button onClick={toggleCart} className="relative">
                <ShoppingCartIcon className="h-6 w-6 text-gray-900" />
              </button>
            </div>

            <div className="relative">
              {currentUser ? (
                <>
                  <button onClick={toggleProfileDropdown} className="flex items-center">
                    <UserIcon className="h-6 w-6 text-gray-900" />
                    <span className="ml-2 text-gray-900">{currentUser}</span>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <button
                          onClick={() => navigate('/profile')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="text-gray-900 hover:text-gray-600"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="text-gray-900 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="fixed inset-0 flex z-40 lg:hidden">
          <Dialog.Panel className="relative flex-1 bg-white p-4">
            <div className="flex items-center justify-between">
              <img className="h-10 w-auto" src="/path-to-your-logo.png" alt="Logo" />
              <button
                type="button"
                className="text-gray-900 hover:text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <a href="/" className="block text-gray-900 hover:text-gray-600">Home</a>
              <a href="/shop" className="block text-gray-900 hover:text-gray-600">Shop</a>
              <a href="/about" className="block text-gray-900 hover:text-gray-600">About</a>
              {isAdmin && ( // Conditionally render Admin link in mobile menu
                <a href="/admin" className="block text-gray-900 hover:text-gray-600">Admin</a>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Cart open={cartOpen} setOpen={setCartOpen} />
    </header>
  );
};

export default Header;

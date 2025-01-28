import React, { useState, useEffect, useContext } from 'react';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Link } from 'react-router-dom';
import { AuthContext } from '@/api/auth';

const navItems = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Find Nurses", link: "/search" },
  { name: "Find Apartments", link: "/apartments" },
  { name: "Contact Us", link: "/contact" }
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  //get current path of the page in react


  const { token, logout } = useContext(AuthContext);

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled || true
        ? 'bg-white/80 backdrop-blur-lg shadow-sm'
        : 'bg-white/0 backdrop-blur-sm'
        }`}
    >
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <p className="tapovan text-4xl font-medium m-0 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent p-4">
            तपोवन्
          </p>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="relative text-lg font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              <span className="relative">
                {item.name}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-blue-600 scale-x-0 transition-transform group-hover:scale-x-100" />
              </span>
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Desktop Login Button */}
          {!token ? (
            <>
              <Link
                to="/login/user"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                User Login
              </Link>
              <Link
                to="/login/nurse"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Nurse Login
              </Link>
              <Link
                to="/login/apartment"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Apartment Login
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          )}


          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="inline-flex md:hidden items-center justify-center p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              <MenuIcon className="h-6 w-6 text-gray-600" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 p-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.link}
                    className="text-lg font-medium text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}

                {!token ? (
                  <>
                    <Link
                      to="/login/user"
                      className="mt-4 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      User Login
                    </Link>
                    <Link
                      to="/login/nurse"
                      className="mt-4 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Nurse Login
                    </Link>
                    <Link
                      to="/login/apartment"
                      className="mt-4 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Apartment Login
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="mt-4 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="mt-4 inline-flex items-center justify-center px-6 py-3 font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </>
                )}

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function MenuIcon({ className = '' }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
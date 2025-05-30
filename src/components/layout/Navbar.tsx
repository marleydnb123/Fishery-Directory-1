import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Menu, X, User, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const ticking = useRef(false);

  // Hide Navbar on admin/dashboard routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  useEffect(() => {
    if (isAdminRoute) setShowNavbar(false);
    else setShowNavbar(true);
  }, [isAdminRoute]);

  // Scroll logic: hide on scroll down, show on scroll up
  useEffect(() => {
    if (isAdminRoute) return;
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY <= 0) {
            setShowNavbar(true);
          } else if (currentScrollY > lastScrollY) {
            setShowNavbar(false);
          } else {
            setShowNavbar(true);
          }
          setLastScrollY(currentScrollY);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [lastScrollY, isAdminRoute]);

  // Auth logic
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    checkUser();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (isAdminRoute) return null;

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.header
          key="navbar"
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            window.scrollY > 20 || location.pathname !== '/' ? 'bg-customBlue shadow-md' : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full px-4 md:px-8">
            <div className="flex justify-between items-center h-12 md:h-14">
              <Link 
                to="/"  
                className="flex items-center space-x-2"
              >
                <Fish className="text-primary-100 h-6 w-6" />
                <span className="text-primary-100 font-bebas font-bold text-2xl">
                  TackleFlow
                </span>
              </Link>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8 items-center">
                <Link 
                  to="/" 
                  className={`text-primary-100 hover:text-white font-medium transition-colors ${
                    location.pathname === '/' ? 'border-b-2 border-primary-400' : ''
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/directory" 
                  className={`text-primary-100 hover:text-white font-medium transition-colors ${
                    location.pathname === '/directory' ? 'border-b-2 border-primary-400' : ''
                  }`}
                >
                  Fisheries
                </Link>
                <Link 
                  to="/accommodation" 
                  className={`text-primary-100 hover:text-white font-medium transition-colors ${
                    location.pathname === '/accommodation' ? 'border-b-2 border-primary-400' : ''
                  }`}
                >
                  Accommodation
                </Link>
                <Link 
                  to="/tackle-shops" 
                  className={`text-primary-100 hover:text-white font-medium transition-colors ${
                    location.pathname === '/tackle-shops' ? 'border-b-2 border-primary-400' : ''
                  }`}
                >
                  <span className="flex items-center">
                    Tackle Shops
                  </span>
                </Link>
                <Link 
                  to="/contact" 
                  className={`text-primary-100 hover:text-white font-medium transition-colors ${
                    location.pathname === '/contact' ? 'border-b-2 border-primary-400' : ''
                  }`}
                >
                  Contact
                </Link>
                <Link 
                  to="/list-your-fishery" 
                  className={`text-primary-100 hover:text-white font-medium transition-colors ${
                    location.pathname === '/list-your-fishery' ? 'border-b-2 border-primary-400' : ''
                  }`}
                >
                  List Your Fishery
                </Link>
                {user ? (
                  <Link 
                    to="/admin" 
                    className="flex items-center bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-full transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                ) : (
                  <Link 
                    to="/login" 
                    className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-full transition-colors"
                  >
                    Login
                  </Link>
                )}
              </nav>
              {/* Mobile menu button */}
              <button 
                className="md:hidden text-primary-100 hover:text-white"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                className="md:hidden bg-customBlue"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full px-4 py-4">
                  <nav className="flex flex-col space-y-4">
                    <Link 
                      to="/" 
                      className={`text-primary-100 hover:text-white font-medium py-2 ${
                        location.pathname === '/' ? 'border-l-4 border-primary-400 pl-2' : ''
                      }`}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/directory" 
                      className={`text-primary-100 hover:text-white font-medium py-2 ${
                        location.pathname === '/directory' ? 'border-l-4 border-primary-400 pl-2' : ''
                      }`}
                    >
                      Fisheries
                    </Link>
                    <Link 
                      to="/accommodation" 
                      className={`text-primary-100 hover:text-white font-medium py-2 ${
                        location.pathname === '/accommodation' ? 'border-l-4 border-primary-400 pl-2' : ''
                      }`}
                    >
                      Accommodation
                    </Link>
                    <Link 
                      to="/tackle-shops" 
                      className={`text-primary-100 hover:text-white font-medium py-2 ${
                        location.pathname === '/tackle-shops' ? 'border-l-4 border-primary-400 pl-2' : ''
                      }`}
                    >
                      <span className="flex items-center">
                        Tackle Shops
                      </span>
                    </Link>
                    <Link 
                      to="/contact" 
                      className={`text-primary-100 hover:text-white font-medium py-2 ${
                        location.pathname === '/contact' ? 'border-l-4 border-primary-400 pl-2' : ''
                      }`}
                    >
                      Contact
                    </Link>
                    <Link 
                      to="/list-your-fishery" 
                      className={`text-primary-100 hover:text-white font-medium py-2 ${
                        location.pathname === '/list-your-fishery' ? 'border-l-4 border-primary-400 pl-2' : ''
                      }`}
                    >
                      List Your Fishery
                    </Link>
                    {user ? (
                      <Link 
                        to="/admin" 
                        className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-md transition-colors flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link 
                        to="/login" 
                        className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        Login
                      </Link>
                    )}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
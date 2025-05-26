import React from 'react';
import { Link } from 'react-router-dom';
import { Fish, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-customBlue shadow-md text-primary-100">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Fish className="text-primary-100 h-6 w-6" /> 
              <span className="text-primary-100 font-bebas font-bold text-3xl">TackleFlow</span>
            </Link>
            <p className="mb-4">
              Discover and book the best fishing locations across the UK. 
              TackleFlow helps anglers find their perfect fishing spot.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-100 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-primary-100 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-primary-100 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-100 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/directory" className="text-primary-100 hover:text-white transition-colors">
                  Fisheries Directory
                </Link>
              </li>
              <li>
                <Link to="/accommodation" className="text-primary-100 hover:text-white transition-colors">
                  Accommodation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-100 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-100 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Districts */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Popular Districts</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/directory?district=Cumbria" className="text-primary-100 hover:text-white transition-colors">
                  Cumbria
                </Link>
              </li>
              <li>
                <Link to="/directory?district=Yorkshire" className="text-primary-100 hover:text-white transition-colors">
                  Yorkshire
                </Link>
              </li>
              <li>
                <Link to="/directory?district=Dumfries+%26+Galloway" className="text-primary-100 hover:text-white transition-colors">
                  Dumfries & Galloway
                </Link>
              </li>
              <li>
                <Link to="/directory?district=Hampshire" className="text-primary-100 hover:text-white transition-colors">
                  Hampshire
                </Link>
              </li>
              <li>
                <Link to="/directory?district=Kent" className="text-primary-100 hover:text-white transition-colors">
                  Kent
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-primary-400" />
                <span>123 Angler's Way, London, UK</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 shrink-0 text-primary-400" />
                <span>+44 1234 567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 shrink-0 text-primary-400" />
                <span>info@tackleflow.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-800 mt-10 pt-6 text-center">
          <p>© {currentYear} TackleFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full py-2 top-0 z-50 backdrop-blur-sm bg-[#F8F9FA]/80 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-[#FF3B30] rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-[#FF3B30]">
                FLASH
              </span>
              <span className="text-xs text-[#111827] font-medium">
                SPORTS PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link 
                to="/venue-listing" 
                className="text-[#000000] hover:text-[#FF3B30] transition-colors duration-300 font-medium"
              >
                Venues
              </Link>
              <Link 
                to="/group-chat" 
                className="text-[#000000] hover:text-[#FF3B30] transition-colors duration-300 font-medium"
              >
                Community
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="font-medium text-[#000000] hover:text-[#FF3B30] transition-colors duration-300"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="font-medium text-[#111827] bg-[#FFD60A] px-4 py-2 rounded-lg hover:bg-[#FFD60A]/90 transition-all duration-300 ease-in-out hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-[#000000] hover:text-[#FF3B30] transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 py-3 space-y-3 bg-[#F8F9FA]">
          <Link 
            to="/venue-listing" 
            className="block text-[#000000] hover:text-[#FF3B30] transition-colors duration-300 font-medium"
          >
            Venues
          </Link>
          <Link 
            to="/group-chat" 
            className="block text-[#000000] hover:text-[#FF3B30] transition-colors duration-300 font-medium"
          >
            Community
          </Link>
          <div className="pt-3 border-t border-gray-100">
            <Link 
              to="/login" 
              className="block text-[#000000] hover:text-[#FF3B30] transition-colors duration-300 font-medium"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="block mt-3 text-center font-medium text-[#111827] bg-[#FFD60A] px-4 py-2 rounded-lg hover:bg-[#FFD60A]/90 transition-all duration-300 ease-in-out hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
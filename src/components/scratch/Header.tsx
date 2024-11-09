import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className=" w-full py-2 top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                FLASH
              </span>
              <span className="text-xs text-gray-500 font-medium">
                SPORTS PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link 
                to="/venue-listing" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Venues
              </Link>
              <Link 
                to="/group-chat" 
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Community
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64' : 'max-h-0 overflow-hidden'}`}>
        <div className="px-4 py-3 space-y-3 bg-white">
          <Link 
            to="/venue-listing" 
            className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Venues
          </Link>
          <Link 
            to="/group-chat" 
            className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
          >
            Community
          </Link>
          <div className="pt-3 border-t border-gray-100">
            <Link 
              to="/login" 
              className="block text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="block mt-3 text-center font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
import { Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom'; // Added for navigation links

export default function Header() {
  const handleSearch = () => {
    // Implement search functionality or remove if not needed
    console.log('Search button clicked');
  };

  const handleMenu = () => {
    // Implement menu toggle functionality or remove if not needed
    console.log('Menu button clicked');
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Flash</span>
            </Link>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900" onClick={handleSearch}>
              <Search size={20} />
            </button>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="font-medium text-gray-900 hover:text-gray-600">Sign In</Link>
              <Link to="/signup" className="font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">Get Started</Link>
            </div>
            <button className="md:hidden text-gray-600 hover:text-gray-900" onClick={handleMenu}>
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Hidden by default */}
      <div className="hidden">
        <div className="px-4 py-3 space-y-3">
          <Link to="/about" className="block text-gray-600 hover:text-gray-900">About</Link>
          <Link to="/contact" className="block text-gray-600 hover:text-gray-900">Contact</Link>
          <Link to="/pricing" className="block text-gray-600 hover:text-gray-900">Pricing</Link>
        </div>
      </div>
    </header>
  );
}
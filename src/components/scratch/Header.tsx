import React from "react";
import {
  Search,
  Menu,
  BookOpen,
  Code,
  MessageCircle,
  Heart,
  Settings,
} from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="font-mono text-xl font-bold text-gray-900">
                Flash
              </span>
            </a>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            <button className="text-gray-600 hover:text-gray-900">
              <Search size={20} />
            </button>
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="/login"
                className="font-medium text-gray-900 hover:text-gray-600"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </a>
            </div>
            <button className="md:hidden text-gray-600 hover:text-gray-900">
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu - Hidden by default */}
      <div className="hidden">
        <div className="px-4 py-3 space-y-3">
          <a href="/about" className="block text-gray-600 hover:text-gray-900">
            About
          </a>
          <a
            href="/contact"
            className="block text-gray-600 hover:text-gray-900"
          >
            Contact
          </a>
          <a
            href="/pricing"
            className="block text-gray-600 hover:text-gray-900"
          >
            Pricing
          </a>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children }) => (
  <a href={href} className="text-gray-600 hover:text-gray-900 font-medium">
    {children}
  </a>
);

const NavDropdown = ({ text, items }) => (
  <div className="relative group">
    <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center space-x-1">
      <span>{text}</span>
      <svg
        className="w-4 h-4 transition-transform group-hover:rotate-180"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {/* Dropdown Menu */}
    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
      <div className="py-2">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {item.icon && item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

export default Header;

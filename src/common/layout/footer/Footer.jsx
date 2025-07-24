import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaShoppingBag,
  FaHeart,
  FaShieldAlt,
  FaTruck,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <FaShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">ShoeCart</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Your trusted partner for premium footwear that combines exceptional 
              style, comfort, and quality craftsmanship.
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaShieldAlt className="w-4 h-4 text-red-500" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaTruck className="w-4 h-4 text-red-500" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaHeart className="w-4 h-4 text-red-500" />
                <span>Loved by 10K+</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-3 pt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                aria-label="YouTube"
              >
                <FaYoutube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-500"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Home" },
                { to: "/products", label: "All Products" },
                { to: "/categories", label: "Categories" },
                { to: "/brands", label: "Brands" },
                { to: "/sale", label: "Sale" },
                { to: "/new-arrivals", label: "New Arrivals" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-red-500 transition-colors duration-200 flex items-center group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 relative">
              Customer Care
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-500"></div>
            </h3>
            <ul className="space-y-4">
              {[
                { to: "/help", label: "Help Center" },
                { to: "/shipping", label: "Shipping Info" },
                { to: "/returns", label: "Returns & Exchanges" },
                { to: "/size-guide", label: "Size Guide" },
                { to: "/track-order", label: "Track Your Order" },
                { to: "/contact", label: "Contact Support" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-600 hover:text-red-500 transition-colors duration-200 flex items-center group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 relative">
              Get In Touch
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-500"></div>
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                <span className="text-gray-600 text-sm leading-relaxed">
                  123 Shoe Street<br />
                  Footwear City, FC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhoneAlt className="text-red-500 flex-shrink-0" />
                <a 
                  href="tel:+15551234567"
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-red-500 flex-shrink-0" />
                <a
                  href="mailto:info@shoecart.com"
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  info@shoecart.com
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Stay Updated</h4>
              <p className="text-sm text-gray-600 mb-4">
                Get the latest deals and new arrivals
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
                <button className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-r-md hover:bg-red-600 transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Copyright & Legal */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              <div>
                &copy; {currentYear} ShoeCart. All rights reserved.
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/privacy" 
                  className="hover:text-red-500 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  to="/terms" 
                  className="hover:text-red-500 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
                <span className="text-gray-300">|</span>
                <Link 
                  to="/cookies" 
                  className="hover:text-red-500 transition-colors duration-200"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 mr-4">We Accept:</span>
              <div className="flex items-center space-x-2">
                {/* Visa */}
                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                {/* Mastercard */}
                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* PayPal */}
                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Apple Pay */}
                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                    alt="Apple Pay"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Google Pay */}
                <div className="w-12 h-8 bg-white rounded border border-gray-200 flex items-center justify-center p-1">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                    alt="Google Pay"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
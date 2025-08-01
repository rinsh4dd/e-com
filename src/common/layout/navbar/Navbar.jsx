import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CiShoppingCart, CiHeart, CiUser } from "react-icons/ci";
import { IoLogoAmplify } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";
import Swal from "sweetalert2";
import { AuthContext } from "../../../common/context/AuthProvider";

// Custom hook to detect clicks outside an element
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, setCartLength, cartLength, logout } =
    useContext(AuthContext);
  
  // Refs for click outside detection
  const mobileMenuRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Close mobile menu when clicking outside
  useClickOutside(mobileMenuRef, () => {
    if (isOpen) setIsOpen(false);
  });

  // Close profile dropdown when clicking outside
  useClickOutside(profileDropdownRef, () => {
    if (showProfileDropdown) setShowProfileDropdown(false);
  });

  if (loading) return null;

  const isCartActive = location.pathname === "/cart";
  const isWishlistActive = location.pathname === "/wishlist";
  const isProfileActive = location.pathname.startsWith("/profile");
  const isOrdersActive = location.pathname === "/orders";

  const requireLoginPrompt = (action = "continue") => {
    return Swal.fire({
      title: "Login Required",
      text: `Please login to ${action}.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Login Now",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6366f1",
      width: "90%",
      padding: "1.5rem",
      customClass: {
        popup: "rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/login");
      }
    });
  };

  const handleProfileClick = () => {
    if (user) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      requireLoginPrompt("access your profile");
    }
  };

  const handleCartClick = () => {
    if (user) {
      navigate("/cart");
    } else {
      requireLoginPrompt("view your cart");
    }
  };

  const handleWishlistClick = () => {
    if (user) {
      navigate("/wishlist");
    } else {
      requireLoginPrompt("access your wishlist");
    }
  };

  const handleLogout = () => {
    setCartLength(0);
    Swal.fire({
      title: "Confirm Logout",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      width: "90%",
      padding: "1.5rem",
      customClass: {
        popup: "rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        setShowProfileDropdown(false);
        setIsOpen(false);
        navigate("/");
      }
    });
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <IoLogoAmplify className="text-3xl text-red-500" />
          <span className="text-xl font-semibold text-red-500">ShoeCart</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10 items-center">
          {navItems.map(({ label, path }) => (
            <div
              key={label}
              onClick={() => navigate(path)}
              className={`cursor-pointer text-[16px] transition duration-200 ${
                location.pathname === path
                  ? "text-red-500 font-semibold"
                  : "text-gray-700 hover:text-red-500"
              }`}
            >
              {label}
            </div>
          ))}

          {/* Icons */}
          <div className="flex gap-4 text-2xl relative" ref={profileDropdownRef}>
            <CiShoppingCart
              onClick={handleCartClick}
              className={`cursor-pointer transition duration-200 ${
                isCartActive
                  ? "text-red-500"
                  : "hover:text-red-500 text-gray-700"
              }`}
            />
            {cartLength > 0 && (
              <span className="absolute -top-2 left-3 bg-red-500 text-white text-[13px] px-[7px] py-[1px] rounded-full">
                {cartLength}
              </span>
            )}

            <CiHeart
              onClick={handleWishlistClick}
              className={`cursor-pointer transition duration-200 ${
                isWishlistActive
                  ? "text-red-500"
                  : "hover:text-red-500 text-gray-700"
              }`}
            />
            <div
              className={`flex items-center gap-1 cursor-pointer transition duration-200 ${
                isProfileActive
                  ? "text-red-500"
                  : "hover:text-red-500 text-gray-700"
              }`}
              onClick={handleProfileClick}
            >
              <CiUser />
              {user && (
                <span className="text-[16px] font-medium">{user.name}</span>
              )}
            </div>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute top-10 right-0 w-44 bg-white border rounded shadow-md p-2 text-sm z-50">
                <div className="px-3 py-1 text-gray-700">
                  Signed in as <b>{user.name}</b>
                </div>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setShowProfileDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-1 hover:bg-gray-100 ${
                    isOrdersActive ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  Track Orders
                </button>
                <button className="w-full text-left px-3 py-1 text-gray-500 hover:bg-gray-100">
                  Contact
                </button>
                <button className="w-full text-left px-3 py-1 text-gray-500 hover:bg-gray-100">
                  Report Bug
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-1 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-3xl text-red-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4" ref={mobileMenuRef}>
          <div className="flex flex-col gap-4 bg-white rounded shadow p-4 text-[16px]">
            {navItems.map(({ label, path }) => (
              <div
                key={label}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`cursor-pointer ${
                  location.pathname === path
                    ? "text-red-500 font-semibold"
                    : "hover:text-red-500 text-gray-700"
                }`}
              >
                {label}
              </div>
            ))}

            {/* Icons */}
            <div className="flex gap-6 text-2xl mt-2 justify-center">
              <CiShoppingCart
                onClick={() => {
                  handleCartClick();
                  setIsOpen(false);
                }}
                className={`cursor-pointer transition duration-200 ${
                  isCartActive
                    ? "text-red-500"
                    : "hover:text-red-500 text-gray-700"
                }`}
              />
              <CiHeart
                onClick={() => {
                  handleWishlistClick();
                  setIsOpen(false);
                }}
                className={`cursor-pointer transition duration-200 ${
                  isWishlistActive
                    ? "text-red-500"
                    : "hover:text-red-500 text-gray-700"
                }`}
              />
              <CiUser
                onClick={() => {
                  handleProfileClick();
                  setIsOpen(false);
                }}
                className={`cursor-pointer transition duration-200 ${
                  isProfileActive
                    ? "text-red-500"
                    : "hover:text-red-500 text-gray-700"
                }`}
              />
            </div>

            {/* Profile Info */}
            {user && (
              <div className="flex flex-col gap-1 mt-4 text-sm">
                <span className="text-gray-600">
                  Signed in as <b>{user.name}</b>
                </span>
                <button
                  onClick={() => {
                    navigate("/orders");
                    setIsOpen(false);
                  }}
                  className={`text-left px-3 py-1 rounded hover:bg-gray-100 ${
                    isOrdersActive ? "text-red-500" : ""
                  }`}
                >
                  Track Orders
                </button>
                <button className="text-left px-3 py-1 rounded hover:bg-gray-100">
                  Contact
                </button>
                <button className="text-left px-3 py-1 rounded hover:bg-gray-100">
                  Report Bug
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-1 text-red-500 rounded hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
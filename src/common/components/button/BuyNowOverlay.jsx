import React from 'react';
import { useNavigate } from 'react-router-dom';

function BuyNowOverlay({ id }) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    
      navigate(`/product/${id}`);
    
  };

  const handleViewProduct = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center group overflow-hidden rounded-lg">
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/50 opacity-0 
                     group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>

      {/* Buy Now button */}
      <button
        onClick={handleBuyNow}
        className="relative z-10 opacity-0 transform -translate-y-2 scale-95
                  group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                  px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white 
                  font-semibold rounded-full shadow-lg hover:shadow-xl
                  transition-all duration-300 ease-out
                  hover:from-red-500 hover:to-red-600
                  active:scale-95
                  after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r 
                  after:from-white/30 after:to-transparent after:opacity-0 
                  after:hover:opacity-100 after:transition-opacity after:duration-300"
      >
        <span className="relative z-20">Buy Now</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-2 inline-block transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>

      {/* 👁️ Eye icon (Quick View) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleViewProduct}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default BuyNowOverlay;

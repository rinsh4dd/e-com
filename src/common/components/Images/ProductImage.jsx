import React, { useState } from 'react';

function ProductImage({ src, alt = "", className = "" }) {
  const [imgError, setImgError] = useState(false);
  const finalSrc = !src || imgError 
    ? "https://via.placeholder.com/150?text=No+Image" 
    : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Main image */}
      <img
        className="w-full h-full object-contain transition-all duration-500 ease-out 
                   hover:scale-105 hover:opacity-95"
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onError={() => setImgError(true)}
      />

      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent 
                      opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Loading shimmer (only if no src initially) */}
      {!src && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 
                        animate-pulse" />
      )}
    </div>
  );
}

export default ProductImage;

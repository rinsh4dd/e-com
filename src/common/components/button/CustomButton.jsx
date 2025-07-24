import React from 'react';

const COLORS = {
  blue: {
    base: 'bg-blue-50',
    hoverBg: 'hover:bg-blue-100',
    hoverBorder: 'hover:border-blue-300',
  },
  red: {
    base: 'bg-red-50',
    hoverBg: 'hover:bg-red-100',
    hoverBorder: 'hover:border-red-300',
  },
  green: {
    base: 'bg-green-50',
    hoverBg: 'hover:bg-green-100',
    hoverBorder: 'hover:border-green-300',
  }
};

function CustomButton({
  children = "Button",
  className = "",
  color = "blue",
  onClick
}) {
  const selected = COLORS[color] || COLORS.blue;

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden border border-gray-300 w-full text-gray-700 font-medium transition-all duration-300 
        ${selected.hoverBorder} ${selected.hoverBg} hover:text-gray-900 ${className}`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-0 ${selected.base} transition-all duration-300 group-hover:w-full`}
      ></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default CustomButton;

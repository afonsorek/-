import React, { useState, useEffect, useCallback } from "react";

// Component: PolaroidImage (Modified for spreading)
const PolaroidImage = ({
  imageUrl,
  caption,
  altText = "Polaroid image",
  onMouseEnter,
  onMouseLeave,
  tilt = 0, // Default tilt to 0, can be overridden
  positioningClasses = "", // For absolute positioning and z-index
}: {
  imageUrl: string;
  caption?: string;
  altText?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  tilt?: number;
  positioningClasses?: string;
}) => {
  // Inline style for dynamic rotation
  const style: React.CSSProperties = {
    transform: `rotate(${tilt}deg)`,
  };

  const [tiltStyle, setTiltStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const rotateX = deltaY * 20;
    const rotateY = deltaX * -20;

    const shadowX = deltaX * 10;
    const shadowY = deltaY * 10;

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`,
      boxShadow: `${-shadowX}px ${-shadowY}px 10px rgba(0, 0, 0, 0.3)`,
      transition: "transform 0.1s ease, box-shadow 0.1s ease",
    });
  };

  const internalHandleMouseLeave = () => {
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1.0)",
      boxShadow: `0px 5px 15px rgba(0, 0, 0, 0.15)`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    });
    if (onMouseLeave) {
      onMouseLeave();
    }
  };

  return (
    <div
      // Smaller size, absolute positioning, and transitions
      className={`absolute p-1.5 bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ease-in-out rounded w-28 h-36 md:w-32 md:h-40 lg:w-36 lg:h-44 ${positioningClasses}`}
      //   style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        internalHandleMouseLeave();
      }}
    >
      <div className="w-full h-24 md:h-28 lg:h-32 bg-gray-200 overflow-hidden rounded-sm">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
          onError={(e) => {
            const imgTarget = e.target as HTMLImageElement;
            imgTarget.onerror = null;
            // Placeholder for smaller polaroid
            imgTarget.src = `https://placehold.co/144x128/EAEAEA/BDBDBD?text=Error`;
          }}
        />
      </div>
      {caption && (
        <p className="mt-1.5 text-center text-xs md:text-sm text-gray-700 font-departure leading-tight">
          {caption}
        </p>
      )}
    </div>
  );
};

export default PolaroidImage; // Ensure this is exported if in a separate file

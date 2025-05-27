import React, { useState } from "react";

interface ImageLinkProps {
  imageSrc: string; // URL or path to the image
  link: string; // Destination URL for the link
}

const ImageLink: React.FC<ImageLinkProps> = ({ imageSrc, link }) => {
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

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1.0)",
      boxShadow: `0px 5px 15px rgba(0, 0, 0, 0.15)`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    });
  };

  return (
    <div
      className="relative w-40 h-40 cursor-pointer rounded-bl-[32px] rounded-tr-[32px] overflow-hidden"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Shape */}
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-40 rounded-bl-[32px] rounded-tr-[32px]"></div>

      {/* Foreground Image */}
      <div className="absolute top-2 left-2 w-36 h-36 flex items-center justify-center bg-white/[.5] opacity-100 rounded-bl-[32px] rounded-tr-[32px] font-departure overflow-hidden">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <img
            src={imageSrc}
            alt="Icon"
            className="w-full h-full object-cover opacity-100 scale-[.7]"
          />
        </a>
      </div>
    </div>
  );
};

export default ImageLink;

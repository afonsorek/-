import React, { useState, useEffect, useCallback } from "react";
import "./Card.css";
import ImageLink from "./link.tsx";

// Interface for Hover Data
interface HoverData {
  title: string;
  description: string;
}

// Helper: SVG Icons (using Heroicons-like style for simplicity)
const ChevronRightIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);

// Helper: SVG Icons (using Heroicons-like style for simplicity)
const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
    />
  </svg>
);

// Component: PolaroidImage (User's version with slight modifications for consistency)
const PolaroidImage = ({
  imageUrl,
  caption,
  altText = "Polaroid image",
  onMouseEnter,
  onMouseLeave,
}: {
  imageUrl: string;
  caption?: string;
  altText?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <div
      className="p-3 bg-white shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-200 ease-in-out rounded-md w-60 md:w-72 lg:w-80 mx-auto my-6" // Increased my margin
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full h-52 md:h-64 lg:h-72 bg-gray-200 overflow-hidden rounded-sm">
        {" "}
        {/* Adjusted height slightly */}
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
          onError={(e) => {
            const imgTarget = e.target as HTMLImageElement;
            imgTarget.onerror = null;
            imgTarget.src = `https://placehold.co/280x320/EAEAEA/BDBDBD?text=Profile+Error`; // Adjusted placeholder size
          }}
        />
      </div>
      {caption && (
        <p className="mt-3 text-center text-md text-gray-700 font-departure">
          {" "}
          {/* Increased mt and text size */}
          {caption}
        </p>
      )}
    </div>
  );
};

export default function Card({
  isProjectsView,
  toggleProjectsView,
}: {
  isProjectsView: boolean;
  toggleProjectsView: () => void;
}) {
  // Added types for props
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({}); // Added type for tiltStyle
  const [dateTime, setDateTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  const [hoverData, setHoverData] = useState<HoverData | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
      setShowColon((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Added type for event
    if (isProjectsView) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;
    const rotateX = deltaY * 6;
    const rotateY = deltaX * -6;
    const shadowX = deltaX * 15;
    const shadowY = deltaY * 15;

    setTiltStyle({
      transform: `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
      boxShadow: `${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.25)`,
      transition: "transform 0.05s ease-out, box-shadow 0.05s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: `0px 15px 30px rgba(0, 0, 0, 0.15)`,
      transition:
        "transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)",
    });
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    const strHours = hours < 10 ? `0${hours}` : `${hours}`;
    const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${strHours}${showColon ? ":" : " "}${strMinutes} ${ampm}`;
  };

  return (
    // Main container for the card and its tooltip
    <div
      className={`relative flex transition-all duration-700 ease-in-out ${
        isProjectsView
          ? "w-56 items-center justify-center h-72" // Use h-72 (standard scale, 18rem / 288px)
          : "w-full max-w-xl md:max-w-2xl lg:max-w-3xl items-start"
      }`}
    >
      {/* Enhanced Tooltip OUTSIDE the card */}
      <div
        className={`absolute left-full ml-4 top-1/4 text-[#420B89] font-departure transition-all duration-300 ease-in-out transform z-50
                   bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-4 w-64 ${
                     // Made tooltip wider
                     hoverData
                       ? "opacity-100 translate-x-0"
                       : "opacity-0 -translate-x-4 pointer-events-none"
                   }`}
      >
        {hoverData && (
          <>
            <h3 className="text-lg font-bold text-[#420B89] mb-1">
              {hoverData.title}
            </h3>
            <p className="text-sm text-gray-700 font-sans">
              {hoverData.description}
            </p>
          </>
        )}
      </div>

      {/* The Card itself */}
      <div
        className={`card relative transition-all duration-700 ease-in-out shadow-xl bg-white/[.65] backdrop-blur-sm w-full 
                   font-departure rounded-bl-[100px] rounded-tr-[100px]
                   ${
                     isProjectsView
                       ? "max-w-56"
                       : "aspect-[5/7] md:aspect-[4/6]" // Adjusted aspect ratio for bigger card
                   }`}
        style={
          isProjectsView
            ? {
                transform: "scale(0.95)",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
              }
            : tiltStyle
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          handleMouseLeave();
          setHoverData(null); // Clear hover data on card mouse leave
        }}
      >
        {/* MODIFIED BUTTON */}
        <button
          onClick={() => {
            toggleProjectsView();
            setHoverData(null);
          }}
          className="absolute z-20 flex items-center justify-center w-24 h-24 rounded-full bg-white/[.65] backdrop-blur-sm text-[#420B89] hover:bg-white/[.90] hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#420B89]/50 transition-all duration-300 ease-in-out shadow-xl"
          style={{ top: "-10px", right: "-20px" }} // Positioned to be centered on the card's TR corner
          aria-label={isProjectsView ? "Back to main card" : "View projects"}
          onMouseEnter={() =>
            setHoverData({
              title: isProjectsView ? "Go back to card" : "See my overview",
              description: isProjectsView
                ? "Go to windows view"
                : "See my projects",
            })
          }
          onFocus={() => setHoverData(null)}
        >
          {isProjectsView ? (
            <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" /> // Slightly larger icon for larger button
          ) : (
            <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" /> // Slightly larger icon
          )}
        </button>

        {/* Inner content of the card */}
        <div
          className={`flex flex-col h-full p-4 md:p-6 transition-opacity duration-500 ${
            isProjectsView ? "items-start" : "items-center justify-between" // Use justify-between for normal view
          }`}
        >
          {!isProjectsView ? (
            <>
              {/* --- NORMAL VIEW (isProjectsView is false) --- */}
              {/* Top section: Time */}
              <div className="w-full text-center md:text-left mb-1 md:mb-2 text-lg md:text-xl opacity-100 transition-opacity duration-300">
                <p className="text-[#420B89]/[1.0]">
                  {`Now @Brasil | ${formatTime(dateTime)} | GMT-3`}
                </p>
              </div>

              {/* Main content area (Polaroid) */}
              <div className="w-full flex flex-col items-center justify-center flex-grow opacity-100 max-h-[1000px] transition-opacity duration-500 ease-in-out">
                <PolaroidImage
                  imageUrl="https://placehold.co/300x350/E0E0F0/A0A0C0?text=Afonso+Rek"
                  caption="Afonso Rek - Developer"
                  altText="Afonso Rek's polaroid style photo"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "About Me!",
                      description:
                        "Hello, I'm Afonso. I'm a passionate developer creating cool things.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
              </div>

              {/* Image Links for NORMAL view */}
              <div className="w-full flex justify-center items-center gap-6 md:gap-16 py-4 opacity-100 transition-opacity duration-500 ease-in-out">
                <ImageLink
                  imageSrc={require("../assets/git.png")}
                  link="https://www.github.com/afonsorek"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "GitHub Profile",
                      description: "Explore my code and projects.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
                <ImageLink
                  imageSrc={require("../assets/linkedin.png")}
                  link="https://www.linkedin.com/in/afonsorek"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "LinkedIn Profile",
                      description: "Connect with me professionally.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
                <ImageLink
                  imageSrc={require("../assets/instagram.png")}
                  link="https://www.instagram.com/afonso.wav"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "Instagram",
                      description: "Follow my visual stories.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
              </div>

              {/* Bottom section: Signature */}
              <div className="w-full text-center md:text-right pt-2 md:pt-4 text-base md:text-lg opacity-100 transition-opacity duration-300">
                <p className="text-[#420B89]/[1.0]">afonsoRek@2025</p>
              </div>
            </>
          ) : (
            <>
              {/* --- COLLAPSED VIEW (isProjectsView is true) --- */}
              {/* Only Image Links, vertically stacked and centered */}
              <div className="flex flex-col items-center justify-center gap-6 py-4">
                {" "}
                {/* Increased gap for vertical stack */}
                <ImageLink
                  imageSrc={require("../assets/git.png")}
                  link="https://www.github.com/afonsorek"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "GitHub Profile",
                      description: "Explore my code and projects.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
                <ImageLink
                  imageSrc={require("../assets/linkedin.png")}
                  link="https://www.linkedin.com/in/afonsorek"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "LinkedIn Profile",
                      description: "Connect with me professionally.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
                <ImageLink
                  imageSrc={require("../assets/instagram.png")}
                  link="https://www.instagram.com/afonso.wav"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "Instagram",
                      description: "Follow my visual stories.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

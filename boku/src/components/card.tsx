import React, { useState, useEffect } from "react";
// Assuming Card.css contains necessary base styles and font-departure
import "./Card.css";
// Assuming ImageLink.tsx is in the same directory or path is adjusted
import ImageLink from "./link.tsx";
import PolaroidImage from "./PolaroidImage.tsx";

// Interface for Hover Data
interface HoverData {
  title: string;
  description: string;
}

// Helper: SVG Icons
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

const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    {/* Using the corrected path for ChevronLeftIcon from your code */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
    />
  </svg>
);

export default function Card({
  isProjectsView,
  toggleProjectsView,
}: {
  isProjectsView: boolean;
  toggleProjectsView: () => void;
}) {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
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

  const formatTime = (date: Date): string => {
    // Added type for date
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const strHours = hours < 10 ? `0${hours}` : `${hours}`;
    const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${strHours}${showColon ? ":" : " "}${strMinutes} ${ampm}`;
  };

  return (
    // Main container for the card and its tooltip - Preserving user's classes
    <div
      className={`relative flex transition-all duration-700 ease-in-out ${
        isProjectsView
          ? "w-56 items-center justify-center h-72"
          : "w-full max-w-xl md:max-w-2xl lg:max-w-3xl items-start justify-center" // Added justify-center to center the card itself
      }`}
    >
      {/* Enhanced Tooltip OUTSIDE the card - Preserving user's classes */}
      <div
        className={`absolute left-full ml-4 top-1/4 text-[#420B89] font-departure transition-all duration-300 ease-in-out transform z-50
                    bg-white/70 backdrop-blur-md shadow-lg rounded-lg p-4 w-64 ${
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

      {/* The Card itself - Preserving user's classes for aspect ratio and general style */}
      <div
        className={`card relative transition-all duration-700 ease-in-out shadow-xl bg-white/[.65] backdrop-blur-sm w-full 
                    font-departure rounded-bl-[100px] rounded-tr-[100px]
                    ${
                      isProjectsView
                        ? "max-w-56" // Collapsed view
                        : "aspect-[5/7] md:aspect-[4/6]" // Normal view - CRITICAL FOR PROPORTIONS
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
          setHoverData(null);
        }}
      >
        {/* Toggle Button - Preserving user's classes */}
        <button
          onClick={() => {
            toggleProjectsView();
            setHoverData(null);
          }}
          className="absolute z-40 flex items-center justify-center w-24 h-24 rounded-full bg-white/[.65] backdrop-blur-sm text-[#420B89] hover:bg-white/[.90] hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#420B89]/50 transition-all duration-300 ease-in-out shadow-xl"
          style={{ top: "-10px", right: "-20px" }}
          aria-label={isProjectsView ? "Back to main card" : "View projects"}
          onMouseEnter={() =>
            setHoverData({
              title: isProjectsView ? "Go back to card" : "See my overview",
              description: isProjectsView
                ? "Go to windows view"
                : "See my projects",
            })
          }
          onMouseLeave={() => setHoverData(null)} // Ensure tooltip clears when mouse leaves button
          onFocus={() => setHoverData(null)}
        >
          {isProjectsView ? (
            <ChevronRightIcon className="w-6 h-6 md:w-8 md:h-8" />
          ) : (
            <ChevronLeftIcon className="w-6 h-6 md:w-8 md:h-8" />
          )}
        </button>

        {/* Inner content of the card - Preserving user's flex structure */}
        <div
          className={`flex flex-col h-full p-4 md:p-6 transition-opacity duration-500 ${
            isProjectsView
              ? "items-center justify-center"
              : "items-center justify-between" // Adjusted for collapsed view
          }`}
        >
          {!isProjectsView ? (
            <>
              {/* --- NORMAL VIEW (isProjectsView is false) --- */}
              {/* Top section: Time - Preserving user's classes */}
              <div className="w-full text-center md:text-left mb-1 md:mb-2 text-lg md:text-xl opacity-100 transition-opacity duration-300 z-10">
                <p className="text-[#420B89]/[1.0]">
                  {`Now @Brasil | ${formatTime(dateTime)} | GMT-3`}
                </p>
              </div>

              {/* Main content area (Polaroid Spread) - This is the key modification area */}
              <div className="w-full flex-grow relative flex items-center justify-center opacity-100 my-2 md:my-4">
                {/* Polaroids are absolutely positioned within this relative container */}
                {/* Adjust top/left/right/bottom and translate values to spread them */}
                <PolaroidImage
                  imageUrl="https://placehold.co/144x128/A7C7E7/333333?text=Skill+1"
                  caption="UI/UX Design"
                  altText="UI/UX Design Polaroid"
                  tilt={-8}
                  positioningClasses="top-[10%] left-[10%] md:top-[15%] md:left-[15%] z-10"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "UI/UX Expertise",
                      description: "Crafting intuitive user interfaces.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
                <PolaroidImage
                  imageUrl="https://placehold.co/144x128/B2D8B2/333333?text=Skill+2"
                  caption="Development"
                  altText="Development Polaroid"
                  tilt={5}
                  positioningClasses="top-[25%] right-[10%] md:top-[30%] md:right-[15%] z-20"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "Full-Stack Dev",
                      description: "Building robust applications.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
                <PolaroidImage
                  imageUrl="https://placehold.co/144x128/FFDAB9/333333?text=Skill+3"
                  caption="Creative Tech"
                  altText="Creative Tech Polaroid"
                  tilt={-3}
                  positioningClasses="bottom-[10%] left-[25%] md:bottom-[15%] md:left-[30%] z-10"
                  onMouseEnter={() =>
                    setHoverData({
                      title: "Creative Solutions",
                      description: "Innovating with technology.",
                    })
                  }
                  onMouseLeave={() => setHoverData(null)}
                />
              </div>

              {/* Image Links for NORMAL view - Preserving user's classes, ensure z-10 if needed */}
              <div className="w-full flex justify-center items-center gap-6 md:gap-16 py-4 opacity-100 transition-opacity duration-500 ease-in-out z-10">
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

              {/* Bottom section: Signature - Preserving user's classes, ensure z-10 if needed */}
              <div className="w-full text-center md:text-right pt-2 md:pt-4 text-base md:text-lg opacity-100 transition-opacity duration-300 z-10">
                <p className="text-[#420B89]/[1.0]">afonsoRek@2025</p>
              </div>
            </>
          ) : (
            <>
              {/* --- COLLAPSED VIEW (isProjectsView is true) --- */}
              <div className="flex flex-col items-center justify-center h-full gap-6 py-4">
                {" "}
                {/* Added h-full */}
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

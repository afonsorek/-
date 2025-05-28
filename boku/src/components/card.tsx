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

const BriefcaseIcon = ({ className = "w-6 h-6" }) => (
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
      d="M20.25 14.15v4.073a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25V14.15M16.5 18.75h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zM12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25-"
    />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-6 h-6" }) => (
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
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
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
      className={`relative flex items-start transition-all duration-700 ease-in-out ${
        isProjectsView
          ? "w-full md:w-[35%] lg:w-[30%]"
          : "w-full max-w-xl md:max-w-2xl lg:max-w-3xl" // Increased card width
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
                       ? "aspect-auto min-h-[calc(100vh-4rem)] overflow-y-auto"
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
          onClick={toggleProjectsView}
          className="absolute z-20 flex items-center justify-center w-24 h-24 rounded-full bg-white/[.65] backdrop-blur-sm text-[#420B89] hover:bg-white/[.90] hover:backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#420B89]/50 transition-all duration-300 ease-in-out shadow-xl"
          style={{ top: "-10px", right: "-20px" }} // Positioned to be centered on the card's TR corner
          aria-label={isProjectsView ? "Back to main card" : "View projects"}
        >
          {isProjectsView ? (
            <ArrowLeftIcon className="w-6 h-6 md:w-8 md:h-8" /> // Slightly larger icon for larger button
          ) : (
            <BriefcaseIcon className="w-6 h-6 md:w-8 md:h-8" /> // Slightly larger icon
          )}
        </button>

        {/* Inner content of the card */}
        <div
          className={`flex flex-col h-full p-4 md:p-6 transition-opacity duration-500 ${
            isProjectsView ? "items-start" : "items-center justify-between" // Use justify-between for normal view
          }`}
        >
          {/* Top section: Time */}
          <div
            className={`w-full text-center md:text-left mb-1 md:mb-2 transition-all duration-300 ${
              isProjectsView
                ? "opacity-70 text-sm"
                : "opacity-100 text-lg md:text-xl"
            }`}
          >
            <p className="text-[#420B89]/[1.0]">
              {`Now @Brasil | ${formatTime(dateTime)} | GMT-3`}
            </p>
          </div>

          {/* Main content area (Polaroid, About Me, Links) - hidden when projects view is active */}
          <div
            className={`w-full flex flex-col items-center justify-center flex-grow transition-all duration-500 ease-in-out ${
              isProjectsView
                ? "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                : "opacity-100 max-h-[1000px]"
            }`}
          >
            <PolaroidImage
              imageUrl="https://placehold.co/300x350/E0E0F0/A0A0C0?text=Afonso+Rek" // Slightly larger placeholder
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
            {/* Removed the separate "About Me" text section as Polaroid can trigger its own tooltip */}
          </div>

          {/* Image Links - Placed at the bottom in normal view */}
          <div
            className={`w-full flex justify-center items-center gap-6 md:gap-16 py-4 transition-all duration-500 ease-in-out ${
              isProjectsView
                ? "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                : "opacity-100"
            }`}
          >
            <ImageLink
              imageSrc={require("../assets/git.png")}
              link="https://www.github.com/afonsorek"
              onMouseEnter={() =>
                setHoverData({ title: "Gitas", description: "aloo" })
              }
              onMouseLeave={() => setHoverData(null)}
            />

            <ImageLink
              imageSrc={require("../assets/linkedin.png")}
              link="https://www.linkedin.com/in/afonsorek"
              onMouseEnter={() =>
                setHoverData({ title: "Gitas", description: "aloo" })
              }
              onMouseLeave={() => setHoverData(null)}
            />

            <ImageLink
              imageSrc={require("../assets/instagram.png")}
              link="https://www.instagram.com/afonso.wav"
              onMouseEnter={() =>
                setHoverData({ title: "Gitas", description: "aloo" })
              }
              onMouseLeave={() => setHoverData(null)}
            />
          </div>

          {/* Content visible when card IS collapsed (minimal info) */}
          <div
            className={`w-full transition-all duration-500 ease-in-out ${
              !isProjectsView
                ? "opacity-0 max-h-0 overflow-hidden pointer-events-none"
                : "opacity-100 max-h-[1000px] mt-12"
            }`}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#420B89] mb-2">
              Afonso Rek
            </h1>
            <p className="text-sm md:text-base text-gray-700 font-sans mb-4">
              Software Developer
            </p>
            <p className="text-xs text-gray-500 font-sans">
              Explore my projects on the right, or click the arrow to go back to
              my main card.
            </p>
          </div>

          {/* Bottom section: Signature */}
          <div
            className={`w-full text-center md:text-right pt-2 md:pt-4 transition-all duration-300 ${
              isProjectsView
                ? "opacity-70 text-xs mt-auto" // Ensure it's at bottom in project view
                : "opacity-100 text-base md:text-lg"
            }`}
          >
            <p className="text-[#420B89]/[1.0]">afonsoRek@2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}

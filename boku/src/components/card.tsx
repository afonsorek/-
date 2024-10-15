import React, { useState, useEffect } from "react";
import "./Card.css"; // Import the CSS file for animation
import ImageLink from "./link.tsx";

export default function Card() {
  const [hoverText, setHoverText] = useState({
    topText1: "フラッター",
    topText2: "スウィフト",
    bottomText: "デベロッパー",
  });

  const [isHovering, setIsHovering] = useState({
    topText1: false,
    topText2: false,
    bottomText: false,
  });

  useEffect(() => {
    const hoveringKeys = Object.keys(isHovering).filter(
      (key) => isHovering[key]
    );

    const hoverEffect = (key) => {
      const intervalId = setInterval(() => {
        setHoverText((prevHoverText) => ({
          ...prevHoverText,
          [key]: generateRandomText(prevHoverText[key].length),
        }));
      }, 50);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        setHoverText((prevHoverText) => ({
          ...prevHoverText,
          [key]:
            key === "topText1"
              ? "Flutter"
              : key === "topText2"
              ? "Swift"
              : "Developer",
        }));
        setIsHovering((prevIsHovering) => ({
          ...prevIsHovering,
          [key]: false,
        }));
      }, 400);

      return { intervalId, timeoutId };
    };

    const effectCleanups = hoveringKeys.map((key) => hoverEffect(key));

    return () => {
      effectCleanups.forEach(({ intervalId, timeoutId }) => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      });
    };
  }, [isHovering]);

  const generateRandomText = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const renderHoverText = (textKey) => {
    return hoverText[textKey].split("").map((char, index) => (
      <span key={index} className="fade-letter">
        {char}
      </span>
    ));
  };

  return (
    <div className="card relative transition duration-300 shadow-xl bg-white/[.7] hover:scale-[1.01] w-2/6 h-5/6 justify-center stack rounded-bl-[100px] rounded-tr-[100px]">
      <div className="grid grid-rows-4 grid-flow-col gap-0 p-4">
        <div
          className="text-[#420B89] text-xl font-thin italic"
          onMouseEnter={() =>
            setIsHovering((prev) => ({ ...prev, topText1: true }))
          }
        >
          {renderHoverText("topText1")}
        </div>
        <div
          className="text-[#420B89] text-xl font-thin italic"
          onMouseEnter={() =>
            setIsHovering((prev) => ({ ...prev, topText2: true }))
          }
        >
          {renderHoverText("topText2")}
        </div>
      </div>

      <div className="">
        <div className="grid-flow-row flex gap-16 justify-center items-center">
          <ImageLink
            imageSrc="https://www.google.com"
            link="https://www.google.com"
          />
          <ImageLink
            imageSrc="https://www.google.com"
            link="https://www.google.com"
          />
          <ImageLink
            imageSrc="https://www.google.com"
            link="https://www.google.com"
          />
        </div>
      </div>

      <div
        className="absolute text-[#420B89] text-xl font-thin right-0 bottom-0 p-4 italic"
        onMouseEnter={() =>
          setIsHovering((prev) => ({ ...prev, bottomText: true }))
        }
      >
        {renderHoverText("bottomText")}
      </div>
    </div>
  );
}

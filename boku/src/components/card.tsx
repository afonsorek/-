import React, { useState, useEffect } from "react";
import "./Card.css";
import ImageLink from "./link.tsx";

export default function Card() {
  const [tiltStyle, setTiltStyle] = useState({});
  const [dateTime, setDateTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
      setShowColon((prev) => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX;
    const deltaY = (y - centerY) / centerY;

    const rotateX = deltaY * 8;
    const rotateY = deltaX * -8;

    const shadowX = deltaX * 20;
    const shadowY = deltaY * 20;

    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`,
      boxShadow: `${-shadowX}px ${-shadowY}px 30px rgba(0, 0, 0, 0.3)`,
      transition: "transform 0.1s ease, box-shadow 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      boxShadow: `0px 10px 30px rgba(0, 0, 0, 0.15)`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    });
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 -> 12

    const strHours = hours < 10 ? `0${hours}` : `${hours}`;
    const strMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${strHours}${showColon ? ":" : " "}${strMinutes} ${ampm}`;
  };

  return (
    <div
      className="card relative transition duration-300 shadow-xl bg-white/[.6] w-full max-w-2xl aspect-[4/6] justify-center stack rounded-bl-[100px] rounded-tr-[100px] font-departure"
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-rows-4 grid-flow-col gap-0 p-4">
        <div className="text-[#420B89]/[1.0] text-xl font-departure">
          {`Now @Brasil | ${formatTime(dateTime)} | -3GMT`}
        </div>
      </div>

      <div>
        <div className="grid-flow-row flex gap-12 justify-center items-center">
          <ImageLink
            imageSrc={require("../assets/git.png")}
            link="https://www.github.com/afonsorek"
          />
          <ImageLink
            imageSrc={require("../assets/linkedin.png")}
            link="https://www.linkedin.com/in/afonsorek"
          />
          <ImageLink
            imageSrc={require("../assets/instagram.png")}
            link="https://www.instagram.com/afonso.wav"
          />
        </div>
      </div>

      <div className="absolute text-[#420B89]/[1.0] text-xl font-departure right-0 bottom-0 p-4">
        afonsoRek@2025
      </div>
    </div>
  );
}

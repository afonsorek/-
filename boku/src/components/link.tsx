import React from "react";

interface ImageLinkProps {
  imageSrc: string; // URL or path to the image
  link: string; // Destination URL for the link
}

const ImageLink: React.FC<ImageLinkProps> = ({ imageSrc, link }) => {
  return (
    <div className="">
      <div className="w-40 h-40 items-center bg-white opacity-80 rounded-bl-[32px] rounded-tr-[32px]"></div>
      <div className="w-36 h-36 flex items-center bg-white opacity-100 rounded-bl-[32px] rounded-tr-[32px] stroke-black">
        <a href={link} target="_blank">
          <img
            src={imageSrc}
            alt="Icon"
            className="max-w-full max-h-full rounded-lg"
          />
        </a>
      </div>
    </div>
  );
};

export default ImageLink;

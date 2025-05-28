import React, { useState, useEffect, useCallback } from "react";
import Card from "./components/card.tsx"; // Assuming card.tsx is in ./components/
import "./App.css"; // Assuming your App.css and font-departure are set up

// Component: ProjectWindow (no changes needed to this component)
const ProjectWindow = ({
  title,
  description,
  imageUrl,
  projectUrl,
  index,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  index: number;
}) => {
  const WindowControls = () => (
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-[#FF5F57] rounded-full border border-[#E0443E]"></div>
      <div className="w-3 h-3 bg-[#FEBC2E] rounded-full border border-[#DEA123]"></div>
      <div className="w-3 h-3 bg-[#28C840] rounded-full border border-[#1DAD2B]"></div>
    </div>
  );

  return (
    <div
      className="bg-white/80 backdrop-blur-md shadow-2xl rounded-lg overflow-hidden w-full max-w-md transition-all duration-500 ease-out hover:shadow-3xl project-window-item"
      style={{
        // animationDelay: `${index * 100}ms`, // Initial animation properties
        opacity: 0, // Initial state for JS-driven animation
        transform: "translateY(20px)", // Initial state for JS-driven animation
      }}
    >
      <div className="h-8 bg-gray-200/70 flex items-center px-3 justify-between border-b border-gray-300/50">
        <WindowControls />
        <p className="text-xs text-gray-600 font-medium font-sans">{title}</p>
        <div className="w-12"></div> {/* Spacer */}
      </div>
      <div className="p-4">
        {imageUrl && (
          <div className="w-full h-48 bg-gray-300 rounded-md mb-3 overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const imgTarget = e.target as HTMLImageElement;
                imgTarget.onerror = null;
                imgTarget.src = `https://placehold.co/300x200/D0D0D0/A0A0A0?text=Project+Img`;
              }}
            />
          </div>
        )}
        <p className="text-gray-700 text-sm mb-3 font-sans leading-relaxed">
          {description}
        </p>
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#420B89] text-white text-xs font-['Arial'] px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors"
            // Assuming font-departure is available or use a fallback like font-['Arial']
          >
            View Project
          </a>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [isProjectsView, setIsProjectsView] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "A full-stack e-commerce solution with Stripe integration and admin dashboard. Built with React, Node.js, and PostgreSQL.",
      imageUrl: "https://placehold.co/400x250/A7C7E7/333333?text=Project+Alpha",
      projectUrl: "#",
    },
    {
      id: 2,
      title: "Portfolio Website V1",
      description:
        "My previous personal portfolio website, showcasing earlier projects and skills. Focused on clean UI and animations.",
      imageUrl: "https://placehold.co/400x250/B2D8B2/333333?text=Project+Beta",
      projectUrl: "#",
    },
    {
      id: 3,
      title: "Task Management App",
      description:
        "A collaborative task management tool with real-time updates using Firebase. Features drag-and-drop interface.",
      imageUrl: "https://placehold.co/400x250/FFDAB9/333333?text=Project+Gamma",
      projectUrl: "#",
    },
    {
      id: 4,
      title: "Interactive Data Viz",
      description:
        "A D3.js powered interactive visualization for complex datasets. Includes filtering and dynamic chart updates.",
      imageUrl: "https://placehold.co/400x250/F0E68C/333333?text=Project+Delta",
      projectUrl: "#",
    },
  ]);

  const toggleProjectsView = useCallback(() => {
    setIsProjectsView((prev) => !prev);
  }, []);

  useEffect(() => {
    // This effect handles the staggered animation for project windows when they become visible.
    if (isProjectsView) {
      const projectWindows = document.querySelectorAll(".project-window-item");
      projectWindows.forEach((windowEl, index) => {
        const htmlWindowEl = windowEl as HTMLElement;
        // Reset styles for re-triggering animation if view is toggled multiple times
        htmlWindowEl.style.opacity = "0";
        htmlWindowEl.style.transform = "translateY(20px)";
        setTimeout(() => {
          htmlWindowEl.style.opacity = "1";
          htmlWindowEl.style.transform = "translateY(0px)";
        }, 50 + index * 100); // Staggered delay
      });
    }
  }, [isProjectsView, projects]); // Rerun when isProjectsView or projects list changes

  return (
    // Assuming font-departure is globally defined or replace with a fallback like font-['Arial']
    <div className="h-screen bg-gradient-to-b from-purple-400 to-violet-700 font-['Arial']">
      {/* Main flex container: MODIFIED for conditional justification and transition */}
      <div
        className={`min-h-screen bg-cover bg-water-texture flex flex-col md:flex-row items-center ${
          isProjectsView ? "md:justify-start" : "md:justify-center"
        } p-4 md:p-8 font-['Arial'] overflow-hidden relative`}

        // {/* MODIFIED: duration and easing */}
      >
        {/* Main Card Area (container for the Card component) */}
        <div
          className={`transition-all duration-700 ease-out ${
            /* MODIFIED: duration and easing */
            isProjectsView
              ? "w-full md:w-[35%] lg:w-[30%] flex-shrink-0" // Card area shrinks when projects are viewed
              : "w-full max-w-xl md:max-w-2xl lg:max-w-2xl" // Card area is larger and centered initially
          }`}
        >
          <Card
            isProjectsView={isProjectsView}
            toggleProjectsView={toggleProjectsView}
          />
        </div>

        {/* Projects Bay Area: MODIFIED for better stacking and animation */}
        <div
          className={`projects-bay w-full transition-all duration-700 ease-out ${
            /* MODIFIED: duration, easing and removed redundant 'transform' keyword */
            isProjectsView
              ? "opacity-100 translate-x-0 h-auto md:w-[65%] lg:w-[70%] md:h-full md:flex-shrink-0" // Visible, takes space
              : "opacity-0 translate-x-full pointer-events-none max-h-0 md:max-h-full md:w-0" // Hidden, no layout space
          } 
            flex items-center justify-center`}
        >
          {/* Scrollable content area within Projects Bay */}
          <div className="w-full h-full max-h-[calc(100vh-2rem)] md:max-h-full overflow-y-auto scrollbar-thin p-4 md:p-6">
            {/* Render projects only when isProjectsView is true to ensure animations trigger correctly */}
            {isProjectsView && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 place-items-center">
                {projects.map((project, index) => (
                  <ProjectWindow
                    key={project.id}
                    index={index} // Used for animation delay in original code, now handled by useEffect
                    title={project.title}
                    description={project.description}
                    imageUrl={project.imageUrl}
                    projectUrl={project.projectUrl}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

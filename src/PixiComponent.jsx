import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SvgRotatingLine = () => {
  const lineRef = useRef(null);

  useEffect(() => {
    const line = lineRef.current;

    gsap.to(line, {
      duration: 4, // Duration of the rotation animation
      rotation: 360, // Rotate the line by 360 degrees
      transformOrigin: "100% 50%", // Set the transform origin to the center of the line
      repeat: -1, // Repeat the animation indefinitely
      ease: "none", // Linear easing
    });
  }, []);

  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="blue"
        strokeWidth="5"
      />
      <line
        ref={lineRef}
        x1="0"
        y1="100"
        x2="100"
        y2="100"
        stroke="red"
        strokeWidth="3"
      />
    </svg>
  );
};

export default SvgRotatingLine;

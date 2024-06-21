// src/CircleAnimation.js
import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

const CircleAnimation = () => {
  const pixiContainer = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });
    pixiContainer.current.appendChild(app.view);

    const centerX = app.view.width / 2;
    const centerY = app.view.height / 2;
    const radius = 100;

    // Draw circle
    const circle = new PIXI.Graphics();
    circle.lineStyle(2, 0xffffff);
    circle.drawCircle(centerX, centerY, radius);
    app.stage.addChild(circle);

    // Draw line
    const line = new PIXI.Graphics();
    line.lineStyle(2, 0xff0000);
    line.moveTo(centerX + radius, centerY);
    line.lineTo(centerX + radius + 50, centerY); // Extend the line outward
    app.stage.addChild(line);

    // Animate line along the circumference of the circle
    gsap.to(line, {
      duration: 5,
      repeat: -1,
      ease: "none",
      onUpdate: function () {
        const progress = gsap.getProperty(this, "progress");
        const angle = progress * Math.PI * 2;
        const x1 = centerX + radius * Math.cos(angle);
        const y1 = centerY + radius * Math.sin(angle);
        const x2 = centerX + (radius + 50) * Math.cos(angle);
        const y2 = centerY + (radius + 50) * Math.sin(angle);

        line.clear();
        line.lineStyle(2, 0xff0000);
        line.moveTo(x1, y1);
        line.lineTo(x2, y2);
      },
    });

    return () => {
      app.destroy(true, true);
    };
  }, []);

  return <div ref={pixiContainer}></div>;
};

export default CircleAnimation;

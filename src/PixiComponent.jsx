import React, { useRef, useEffect } from "react";
import * as PIXI from "pixi.js";
import imageUrl from "./assets/bunny.png";

const PixiComponent = () => {
  const pixiContainer = useRef(null);
  const sprite = useRef(null);
  const app = useRef(null);
  const start = useRef(null);

  useEffect(() => {
    app.current = new PIXI.Application({
      background: "#1099bb",
      resizeTo: window,
      view: pixiContainer.current,
    });

    const texture = PIXI.Texture.from(imageUrl);

    sprite.current = new PIXI.Sprite(texture);
    // sprite.current.anchor.set(1);
    sprite.current.x = app.current.renderer.width / 2;
    sprite.current.y = app.current.renderer.height / 2;
    sprite.current.alpha = 0; // Start with transparency
    app.current.stage.addChild(sprite.current);

    start.current = performance.now();

    // Start the custom animation loop
    animate();
  }, []);

  const animate = () => {
    const elapsed = performance.now() - start.current;

    // Fade-in animation
    const fadeInDuration = 1000; // Animation duration in milliseconds
    const targetAlpha = 1; // Target alpha value
    let alpha = Math.min(elapsed / fadeInDuration, 1);
    sprite.current.alpha = alpha * targetAlpha;

    // Fade-out animation after 3 seconds
    // if (elapsed > 3000) {
    //   const fadeOutDuration = 2000; // Animation duration in milliseconds
    //   alpha = Math.max(1 - (elapsed - 3000) / fadeOutDuration, 0);
    //   sprite.current.alpha = alpha * targetAlpha;
    // }

    // Continue the animation loop
    if (elapsed < 1000) {
      // Total animation duration of 5 seconds
      requestAnimationFrame(animate);
    }
  };

  return (
    <>
      <canvas ref={pixiContainer} />
    </>
  );
};

export default PixiComponent;

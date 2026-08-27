import React, { useEffect, useRef } from "react";

const UnderFooter = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 80,
    };

    // Offscreen Canvas to render Text into pixels
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");

    let particles = [];

    const init = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;

      textCanvas.width = width;
      textCanvas.height = height;

      textCtx.clearRect(0, 0, width, height);

      // Responsive Font Size
      const fontSize = Math.min(width / 7, 100);
      textCtx.font = `bold ${fontSize}px Georgia, serif`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      // Draw "RUP " in RED and "DARPON" in WHITE
      const rupText = "RUP ";
      const darponText = "DARPON";

      const rupWidth = textCtx.measureText(rupText).width;
      const darponWidth = textCtx.measureText(darponText).width;
      const totalWidth = rupWidth + darponWidth;

      const startX = width / 2 - totalWidth / 2;

      // Draw RUP (Red)
      textCtx.fillStyle = "#ef4444";
      textCtx.textAlign = "left";
      textCtx.fillText(rupText, startX, height / 2);

      // Draw DARPON (White)
      textCtx.fillStyle = "#ffffff";
      textCtx.fillText(darponText, startX + rupWidth, height / 2);

      // Get pixel data from text
      const imgData = textCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      particles = [];
      const step = 4; // Grid spacing for dots

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];

            particles.push({
              baseX: x,
              baseY: y,
              x: x,
              y: y,
              color: `rgb(${r}, ${g}, ${b})`,
              size: 1.5,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
            });
          }
        }
      }
    };

    init();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate distance from mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 5;
          p.y -= Math.sin(angle) * force * 5;
        } else {
          // Return to original position gradually
          p.x += (p.baseX - p.x) * 0.1;
          p.y += (p.baseY - p.y) * 0.1;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const canvasElem = canvas;
    canvasElem.addEventListener("mousemove", handleMouseMove);
    canvasElem.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvasElem.removeEventListener("mousemove", handleMouseMove);
      canvasElem.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] bg-neutral-950 overflow-hidden border-t border-white/10 select-none">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer block" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-widest text-neutral-500 uppercase pointer-events-none">
      </div>
    </div>
  );
};

export default UnderFooter;
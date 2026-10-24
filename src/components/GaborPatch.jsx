import { useLayoutEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Generates a classic Gabor patch on a canvas: sinusoidal luminance stripes
 * multiplied by a circular Gaussian envelope, fading into a soft grey field.
 */
export default function GaborPatch({
  angle = 0,
  frequency = 4.5,
  size = 60,
  contrast = 1,
  phase = 0,
  label,
  className = "",
  style,
}) {
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderedSize = Math.max(16, Math.round(size));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pixelSize = Math.max(16, Math.round(renderedSize * dpr));
    canvas.width = pixelSize;
    canvas.height = pixelSize;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const image = context.createImageData(pixelSize, pixelSize);
    const data = image.data;
    const radians = (angle * Math.PI) / 180;
    const cosine = Math.cos(radians);
    const sine = Math.sin(radians);
    const half = pixelSize / 2;
    const background = 230;
    const midtone = 128;
    const envelopeSigma = 0.37;
    const twoSigmaSquared = 2 * envelopeSigma * envelopeSigma;

    for (let y = 0; y < pixelSize; y += 1) {
      const normalizedY = (y + 0.5 - half) / half;
      const normalizedY2 = normalizedY * normalizedY;

      for (let x = 0; x < pixelSize; x += 1) {
        const normalizedX = (x + 0.5 - half) / half;
        const alongStripes = normalizedX * cosine + normalizedY * sine;
        const distanceSquared = normalizedX * normalizedX + normalizedY2;
        const envelope = Math.exp(-distanceSquared / twoSigmaSquared);
        const wave = Math.cos(Math.PI * frequency * alongStripes + phase);
        const centerValue = midtone + wave * 100 * contrast;
        const luminance = clamp(
          Math.round(background + (centerValue - background) * envelope),
          0,
          255,
        );
        const index = (y * pixelSize + x) * 4;

        data[index] = luminance;
        data[index + 1] = luminance;
        data[index + 2] = luminance;
        data[index + 3] = 255;
      }
    }

    context.putImageData(image, 0, 0);
  }, [angle, contrast, frequency, phase, size]);

  return (
    <canvas
      ref={canvasRef}
      className={`gabor-patch block shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    />
  );
}

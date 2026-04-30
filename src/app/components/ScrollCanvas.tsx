import { useEffect, useRef, useState } from 'react';
import { MotionValue } from 'motion/react';

interface ScrollCanvasProps {
  frameCount: number;
  scrollProgress: MotionValue<number>;
}

export function ScrollCanvas({ frameCount, scrollProgress }: ScrollCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameIndex = i.toString().padStart(3, '0');
      img.src = `/plant/Plants_exploding_into_indoor_jungle_202604291712_${frameIndex}.jpg`;
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      img.onerror = () => {
        console.warn(`Failed to load frame ${frameIndex}`);
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
  }, [frameCount]);

  // Render to canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameIndex = -1;

    const render = (progress: number) => {
      // Clamp progress 0-1
      const clampedProgress = Math.max(0, Math.min(1, progress));
      
      // Map progress 0-1 to frame index 0-(frameCount-1)
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.floor(clampedProgress * (frameCount - 1)))
      );

      // Skip if same frame (avoid redundant draws)
      if (frameIndex === lastFrameIndex) return;
      lastFrameIndex = frameIndex;

      const img = images[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      // Handle devicePixelRatio for sharp visuals
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      const targetW = rect.width * dpr;
      const targetH = rect.height * dpr;

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      // Reset transform for each draw
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // "cover" fit rendering so it fills the screen
      const scale = Math.max(rect.width / img.naturalWidth, rect.height / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const x = (rect.width - drawW) / 2;
      const y = (rect.height - drawH) / 2;

      // Clear with earthy tone
      ctx.fillStyle = '#EEF2EC';
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.drawImage(img, x, y, drawW, drawH);
    };

    // Initial render
    render(scrollProgress.get());

    // Subscribe to scroll changes
    const unsubscribe = scrollProgress.on('change', (latest) => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => render(latest));
    });

    // Handle resize
    const handleResize = () => {
      lastFrameIndex = -1; // Force redraw on resize
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => render(scrollProgress.get()));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [images, scrollProgress, frameCount]);

  return (
    <div className="sticky top-0 w-full h-screen flex items-center justify-center bg-[#EEF2EC] overflow-hidden z-0">
      {/* Loading overlay removed for instant access */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
        style={{ opacity: 1 }}
      />
    </div>
  );
}

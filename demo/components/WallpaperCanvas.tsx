import { useEffect, useRef } from 'react';
import { createWallpaper } from '../../src/index.js';
import type { WallpaperConfig, WallpaperInstance } from '../../src/types.js';

interface WallpaperCanvasProps {
  config: WallpaperConfig;
  onCaptureRequest?: (captureFn: () => string) => void;
}

const WallpaperCanvas = ({ config, onCaptureRequest }: WallpaperCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<WallpaperInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const instance = createWallpaper(containerRef.current, config);
    instanceRef.current = instance;
    onCaptureRequest?.(() => instance.capture());

    return () => {
      instance.destroy();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    instanceRef.current?.setConfig(config);
    if (instanceRef.current && onCaptureRequest) {
      onCaptureRequest(() => instanceRef.current!.capture());
    }
  }, [config, onCaptureRequest]);

  return <div ref={containerRef} className="h-full w-full" />;
};

export default WallpaperCanvas;

import { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { EnhancedAircraft, AircraftHistoryMap, PositionHistory } from '@/types/aircraft';
import { EMERGENCY_COLOR } from '@/lib/colors/emergency';
import { useConfigStore } from '@/store/configStore';
import { useUIStore } from '@/store/uiStore';

interface AircraftTrailsCanvasProps {
  aircraft: EnhancedAircraft[];
  history: AircraftHistoryMap;
}

export function AircraftTrailsCanvas({ aircraft, history }: AircraftTrailsCanvasProps) {
  const { current: mapInstance } = useMap();
  const { showTrails, trailColor } = useConfigStore();
  const { selectedAircraftHex, viewMode } = useUIStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const needsRedrawRef = useRef(true);

  // Mark for redraw when data changes
  useEffect(() => {
    needsRedrawRef.current = true;
  }, [aircraft, history, showTrails, selectedAircraftHex, trailColor, viewMode]);

  useEffect(() => {
    if (!mapInstance) return;
    const map = mapInstance.getMap();
    if (!map) return;

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '0';
      canvasRef.current = canvas;

      const mapContainer = map.getContainer();
      mapContainer.appendChild(canvas);
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to draw trails
    const drawTrails = () => {
      const mapCanvas = map.getCanvas();
      const width = mapCanvas.clientWidth;
      const height = mapCanvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      // Update canvas size with device pixel ratio
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Scale context for device pixel ratio
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw trails based on settings
      aircraft.forEach((ac) => {
        // Show trail if:
        // - viewMode is realistic (always show all trails), OR
        // - showTrails is enabled (show all), OR
        // - this aircraft is selected (show only selected)
        const shouldShowTrail = viewMode === 'realistic' || showTrails || ac.hex === selectedAircraftHex;
        if (!shouldShowTrail) return;

        const trail = history[ac.hex];
        if (!trail || trail.length < 2) return;

        const color = ac.isEmergency ? EMERGENCY_COLOR : trailColor;

        // Start drawing
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.8;

        let firstPoint = true;
        trail.forEach((pos: PositionHistory) => {
          const point = map.project([pos.lon, pos.lat]);
          if (firstPoint) {
            ctx.moveTo(point.x, point.y);
            firstPoint = false;
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });

        ctx.stroke();
      });
    };

    // Animation loop
    const animate = () => {
      if (needsRedrawRef.current) {
        drawTrails();
        needsRedrawRef.current = false;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Mark for redraw on map move/zoom
    const handleMapChange = () => {
      needsRedrawRef.current = true;
    };

    map.on('move', handleMapChange);
    map.on('zoom', handleMapChange);

    // Start animation loop
    animate();

    return () => {
      map.off('move', handleMapChange);
      map.off('zoom', handleMapChange);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
    };
  }, [mapInstance, aircraft, history, showTrails, selectedAircraftHex, trailColor]);

  return null;
}

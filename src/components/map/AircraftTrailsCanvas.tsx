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
  const { showTrails, trailColor, userLat, userLon } = useConfigStore();
  const { selectedAircraftHex, viewMode } = useUIStore();
  const animationFrameRef = useRef<number | null>(null);
  const needsRedrawRef = useRef(true);

  // Refs so the draw loop always reads latest data without restarting
  const aircraftRef = useRef(aircraft);
  const historyRef = useRef(history);
  const showTrailsRef = useRef(showTrails);
  const selectedHexRef = useRef(selectedAircraftHex);
  const trailColorRef = useRef(trailColor);
  const viewModeRef = useRef(viewMode);
  const userLatRef = useRef(userLat);
  const userLonRef = useRef(userLon);

  // Update refs and mark dirty — no canvas/loop restart needed
  useEffect(() => {
    aircraftRef.current = aircraft;
    historyRef.current = history;
    needsRedrawRef.current = true;
  }, [aircraft, history]);

  useEffect(() => {
    showTrailsRef.current = showTrails;
    selectedHexRef.current = selectedAircraftHex;
    trailColorRef.current = trailColor;
    viewModeRef.current = viewMode;
    needsRedrawRef.current = true;
  }, [showTrails, selectedAircraftHex, trailColor, viewMode]);

  useEffect(() => {
    userLatRef.current = userLat;
    userLonRef.current = userLon;
    needsRedrawRef.current = true;
  }, [userLat, userLon]);

  // Canvas + rAF loop — created once when the map mounts, torn down on unmount
  useEffect(() => {
    if (!mapInstance) return;
    const map = mapInstance.getMap();
    if (!map) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    map.getCanvasContainer().appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawTrails = () => {
      const mapCanvas = map.getCanvas();
      const width = mapCanvas.clientWidth;
      const height = mapCanvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const ac = aircraftRef.current;
      const hist = historyRef.current;
      const color = trailColorRef.current;
      const selHex = selectedHexRef.current;
      const trails = showTrailsRef.current;
      const mode = viewModeRef.current;

      // Draw home position dot
      const homeLat = userLatRef.current;
      const homeLon = userLonRef.current;
      if (homeLat !== null && homeLon !== null) {
        const pt = map.project([homeLon, homeLat]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.globalAlpha = 1;
        ctx.fill();
      }

      ac.forEach((a) => {
        const shouldShow = mode === 'realistic' || trails || a.hex === selHex;
        if (!shouldShow) return;

        const trail = hist[a.hex];
        if (!trail || trail.length < 2) return;

        ctx.beginPath();
        ctx.strokeStyle = a.isEmergency ? EMERGENCY_COLOR : color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.8;

        let first = true;
        trail.forEach((pos: PositionHistory) => {
          const pt = map.project([pos.lon, pos.lat]);
          if (first) { ctx.moveTo(pt.x, pt.y); first = false; }
          else ctx.lineTo(pt.x, pt.y);
        });

        ctx.stroke();
      });
    };

    const animate = () => {
      if (needsRedrawRef.current) {
        drawTrails();
        needsRedrawRef.current = false;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const markDirty = () => { needsRedrawRef.current = true; };
    map.on('move', markDirty);
    map.on('zoom', markDirty);
    animate();

    return () => {
      map.off('move', markDirty);
      map.off('zoom', markDirty);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [mapInstance]); // ← solo mapInstance: canvas e loop vivono con la mappa

  return null;
}

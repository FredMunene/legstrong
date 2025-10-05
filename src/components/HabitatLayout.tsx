import { useRef, useEffect, useState } from 'react';
import { Component } from '../lib/supabase';
import { HabitatGeometry } from '../types';
import { Play, Pause, RotateCcw } from 'lucide-react';

type HabitatLayoutProps = {
  geometry: HabitatGeometry;
  components: Component[];
  isGenerating: boolean;
};

export function HabitatLayout({ geometry, components, isGenerating }: HabitatLayoutProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotating, setRotating] = useState(true);
  const [currentShape, setCurrentShape] = useState<'cylinder' | 'sphere' | 'cuboid'>(geometry.shape as any);
  const [dimensions, setDimensions] = useState({
    radius: geometry.dimensions.radius || 50,
    height: geometry.dimensions.height || 100,
    width: geometry.dimensions.width || 80,
    depth: geometry.dimensions.depth || 80
  });
  const rotationRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Update shape when geometry changes
  useEffect(() => {
    setCurrentShape(geometry.shape as any);
    setDimensions({
      radius: geometry.dimensions.radius || 50,
      height: geometry.dimensions.height || 100,
      width: geometry.dimensions.width || 80,
      depth: geometry.dimensions.depth || 80
    });
  }, [geometry]);

  // Draw NASA-style sphere
  const drawSphere = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    color: string,
    rotation: number
  ) => {
    const latitudes = 12;
    
    for (let i = 0; i < latitudes; i++) {
      const lat1 = (i / latitudes - 0.5) * Math.PI;
      const lat2 = ((i + 1) / latitudes - 0.5) * Math.PI;
      
      const y1 = centerY + radius * Math.sin(lat1);
      const y2 = centerY + radius * Math.sin(lat2);
      const r1 = radius * Math.cos(lat1);
      const r2 = radius * Math.cos(lat2);

      // Latitude band
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7 - (i * 0.03);
      
      ctx.beginPath();
      ctx.moveTo(centerX - r1 * Math.cos(rotation), y1);
      ctx.lineTo(centerX - r2 * Math.cos(rotation), y2);
      ctx.lineTo(centerX + r2 * Math.cos(rotation), y2);
      ctx.lineTo(centerX + r1 * Math.cos(rotation), y1);
      ctx.closePath();
      ctx.fill();

      // Longitude lines
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Main outline
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Highlight
    const gradient = ctx.createRadialGradient(
      centerX - radius * 0.3, centerY - radius * 0.3, 0,
      centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.5
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0.6)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
  };

  // Draw NASA-style cylinder
  const drawCylinder = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    height: number,
    color: string,
    rotation: number
  ) => {
    // Left panel
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    
    ctx.beginPath();
    ctx.moveTo(centerX - radius * Math.cos(rotation), centerY - height/2);
    ctx.lineTo(centerX - radius * Math.cos(rotation), centerY + height/2);
    ctx.lineTo(centerX - radius * Math.cos(rotation + 0.6), centerY + height/2);
    ctx.lineTo(centerX - radius * Math.cos(rotation + 0.6), centerY - height/2);
    ctx.closePath();
    ctx.fill();

    // Right panel
    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(centerX + radius * Math.cos(rotation), centerY - height/2);
    ctx.lineTo(centerX + radius * Math.cos(rotation), centerY + height/2);
    ctx.lineTo(centerX + radius * Math.cos(rotation - 0.6), centerY + height/2);
    ctx.lineTo(centerX + radius * Math.cos(rotation - 0.6), centerY - height/2);
    ctx.closePath();
    ctx.fill();

    // Rings/bands
    const rings = 5;
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= rings; i++) {
      const y = centerY - height/2 + (height / rings) * i;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(centerX, y, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Top cap
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - height/2, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bottom cap
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + height/2, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outlines
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - height/2, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + height/2, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  // Draw NASA-style cuboid
  const drawCuboid = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    depth: number,
    color: string,
    rotation: number
  ) => {
    const d = depth * Math.abs(Math.cos(rotation));
    const offsetX = d * 0.5;
    const offsetY = d * 0.25;

    // Front face
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(centerX - width/2, centerY - height/2, width, height);

    // Grid lines on front
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX - width/2, centerY - height/2 + (height/4) * i);
      ctx.lineTo(centerX + width/2, centerY - height/2 + (height/4) * i);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - width/2 + (width/4) * i, centerY - height/2);
      ctx.lineTo(centerX - width/2 + (width/4) * i, centerY + height/2);
      ctx.stroke();
    }

    // Top face
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.moveTo(centerX - width/2, centerY - height/2);
    ctx.lineTo(centerX - width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2, centerY - height/2);
    ctx.closePath();
    ctx.fill();

    // Right face
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(centerX + width/2, centerY - height/2);
    ctx.lineTo(centerX + width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2 + offsetX, centerY + height/2 - offsetY);
    ctx.lineTo(centerX + width/2, centerY + height/2);
    ctx.closePath();
    ctx.fill();

    // Outlines
    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);

    // Top outline
    ctx.beginPath();
    ctx.moveTo(centerX - width/2, centerY - height/2);
    ctx.lineTo(centerX - width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2, centerY - height/2);
    ctx.stroke();

    // Right outline
    ctx.beginPath();
    ctx.moveTo(centerX + width/2, centerY - height/2);
    ctx.lineTo(centerX + width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2 + offsetX, centerY + height/2 - offsetY);
    ctx.lineTo(centerX + width/2, centerY + height/2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      // Space background
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, width, height);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 150; i++) {
        const x = (i * 137.5) % width;
        const y = (i * 93.7) % height;
        const size = Math.random() * 2;
        ctx.globalAlpha = 0.4 + Math.random() * 0.6;
        ctx.fillRect(x, y, size, size);
      }
      ctx.globalAlpha = 1;

      const centerX = width / 2;
      const centerY = height / 2;
      const rotation = rotationRef.current;
      const color = geometry.color;

      // Draw the habitat shape
      if (currentShape === 'sphere') {
        drawSphere(ctx, centerX, centerY, dimensions.radius, color, rotation);
      } else if (currentShape === 'cylinder') {
        drawCylinder(ctx, centerX, centerY, dimensions.radius, dimensions.height, color, rotation);
      } else if (currentShape === 'cuboid') {
        drawCuboid(ctx, centerX, centerY, dimensions.width, dimensions.height, dimensions.depth, color, rotation);
      }

      if (rotating) {
        rotationRef.current += 0.012;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentShape, dimensions, rotating, geometry.color]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Habitat 3D Preview</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRotating(!rotating)}
            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            title={rotating ? 'Pause' : 'Play'}
          >
            {rotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => rotationRef.current = 0}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-lg overflow-hidden border-2 border-gray-700">
        <canvas
          ref={canvasRef}
          width={600}
          height={500}
          className="w-full"
        />
        
        <div className="absolute top-4 right-4 bg-black bg-opacity-70 px-3 py-2 rounded text-white text-xs font-mono">
          {currentShape.toUpperCase()} HABITAT
        </div>
      </div>

      {/* Shape Selector */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select Habitat Shape</label>
        <div className="grid grid-cols-3 gap-3">
          {(['cylinder', 'sphere', 'cuboid'] as const).map((shape) => (
            <button
              key={shape}
              onClick={() => setCurrentShape(shape)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentShape === shape
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
              }`}
            >
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Dimension Controls */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
        <label className="block text-sm font-medium text-gray-700">Adjust Dimensions</label>
        
        {(currentShape === 'sphere' || currentShape === 'cylinder') && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Radius</span>
              <span>{dimensions.radius.toFixed(0)}m</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              value={dimensions.radius}
              onChange={(e) => setDimensions({...dimensions, radius: Number(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}

        {currentShape === 'cylinder' && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Height</span>
              <span>{dimensions.height.toFixed(0)}m</span>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              value={dimensions.height}
              onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        )}

        {currentShape === 'cuboid' && (
          <>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Width</span>
                <span>{dimensions.width.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Height</span>
                <span>{dimensions.height.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Depth</span>
                <span>{dimensions.depth.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={dimensions.depth}
                onChange={(e) => setDimensions({...dimensions, depth: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
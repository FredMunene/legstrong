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
  const [currentShape, setCurrentShape] = useState<'cylinder' | 'sphere' | 'cuboid' | 'torus' | 'cone'>('cylinder');
  const [dimensions, setDimensions] = useState({
    radius: 70,
    height: 120,
    width: 100,
    depth: 100
  });
  const rotationRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Update shape when geometry changes
  useEffect(() => {
    if (geometry.shape === 'sphere' || geometry.shape === 'cylinder' || geometry.shape === 'cuboid') {
      setCurrentShape(geometry.shape as any);
    }
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

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7 - (i * 0.03);
      
      ctx.beginPath();
      ctx.moveTo(centerX - r1 * Math.cos(rotation), y1);
      ctx.lineTo(centerX - r2 * Math.cos(rotation), y2);
      ctx.lineTo(centerX + r2 * Math.cos(rotation), y2);
      ctx.lineTo(centerX + r1 * Math.cos(rotation), y1);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

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
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    
    ctx.beginPath();
    ctx.moveTo(centerX - radius * Math.cos(rotation), centerY - height/2);
    ctx.lineTo(centerX - radius * Math.cos(rotation), centerY + height/2);
    ctx.lineTo(centerX - radius * Math.cos(rotation + 0.6), centerY + height/2);
    ctx.lineTo(centerX - radius * Math.cos(rotation + 0.6), centerY - height/2);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.65;
    ctx.beginPath();
    ctx.moveTo(centerX + radius * Math.cos(rotation), centerY - height/2);
    ctx.lineTo(centerX + radius * Math.cos(rotation), centerY + height/2);
    ctx.lineTo(centerX + radius * Math.cos(rotation - 0.6), centerY + height/2);
    ctx.lineTo(centerX + radius * Math.cos(rotation - 0.6), centerY - height/2);
    ctx.closePath();
    ctx.fill();

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

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - height/2, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(centerX, centerY + height/2, radius * Math.abs(Math.cos(rotation)), radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

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

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(centerX - width/2, centerY - height/2, width, height);

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

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.moveTo(centerX - width/2, centerY - height/2);
    ctx.lineTo(centerX - width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2, centerY - height/2);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(centerX + width/2, centerY - height/2);
    ctx.lineTo(centerX + width/2 + offsetX, centerY - height/2 - offsetY);
    ctx.lineTo(centerX + width/2 + offsetX, centerY + height/2 - offsetY);
    ctx.lineTo(centerX + width/2, centerY + height/2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.strokeRect(centerX - width/2, centerY - height/2, width, height);

    ctx.globalAlpha = 1;
  };

  // Draw NASA-style torus
  const drawTorus = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    majorRadius: number,
    minorRadius: number,
    color: string,
    rotation: number
  ) => {
    const segments = 24;
    const angleStep = (Math.PI * 2) / segments;

    for (let i = 0; i < segments; i++) {
      const angle = i * angleStep + rotation;
      const x1 = centerX + majorRadius * Math.cos(angle);
      const y1 = centerY + majorRadius * Math.sin(angle) * 0.4;
      
      const brightness = Math.abs(Math.sin(angle));
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5 + brightness * 0.3;
      
      ctx.beginPath();
      ctx.ellipse(x1, y1, minorRadius, minorRadius * 0.6, angle, 0, Math.PI * 2);
      ctx.fill();

      if (i < segments - 1) {
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.4;
        ctx.lineWidth = minorRadius * 0.8;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const x2 = centerX + majorRadius * Math.cos((i + 1) * angleStep + rotation);
        const y2 = centerY + majorRadius * Math.sin((i + 1) * angleStep + rotation) * 0.4;
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, majorRadius, majorRadius * 0.4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, majorRadius * 0.7, majorRadius * 0.28, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  // Draw NASA-style cone
  const drawCone = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    baseRadius: number,
    height: number,
    color: string,
    rotation: number
  ) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + height/2, baseRadius * Math.abs(Math.cos(rotation)), baseRadius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height/2);
    ctx.lineTo(centerX - baseRadius * Math.cos(rotation), centerY + height/2);
    ctx.lineTo(centerX - baseRadius * Math.cos(rotation + 0.5), centerY + height/2);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - height/2);
    ctx.lineTo(centerX + baseRadius * Math.cos(rotation), centerY + height/2);
    ctx.lineTo(centerX + baseRadius * Math.cos(rotation - 0.5), centerY + height/2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    const panels = 4;
    for (let i = 1; i < panels; i++) {
      const y = centerY - height/2 + (height / panels) * i;
      const r = baseRadius * (i / panels);
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.ellipse(centerX, y, r * Math.abs(Math.cos(rotation)), r * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(centerX, centerY - height/2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + height/2, baseRadius * Math.abs(Math.cos(rotation)), baseRadius * 0.3, 0, 0, Math.PI * 2);
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
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, width, height);

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

      if (currentShape === 'sphere') {
        drawSphere(ctx, centerX, centerY, dimensions.radius, color, rotation);
      } else if (currentShape === 'cylinder') {
        drawCylinder(ctx, centerX, centerY, dimensions.radius, dimensions.height, color, rotation);
      } else if (currentShape === 'cuboid') {
        drawCuboid(ctx, centerX, centerY, dimensions.width, dimensions.height, dimensions.depth, color, rotation);
      } else if (currentShape === 'torus') {
        drawTorus(ctx, centerX, centerY, dimensions.radius, dimensions.radius * 0.3, color, rotation);
      } else if (currentShape === 'cone') {
        drawCone(ctx, centerX, centerY, dimensions.radius, dimensions.height, color, rotation);
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
          >
            {rotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => rotationRef.current = 0}
            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-3">Select NASA Habitat Shape</label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: 'cylinder', label: 'Cylinder', desc: 'ISS Module' },
            { value: 'sphere', label: 'Sphere', desc: 'Pressure Vessel' },
            { value: 'cuboid', label: 'Cuboid', desc: 'Cargo Bay' },
            { value: 'torus', label: 'Torus', desc: 'Rotating Ring' },
            { value: 'cone', label: 'Cone', desc: 'Capsule/Lander' }
          ].map((shape) => (
            <button
              key={shape.value}
              onClick={() => setCurrentShape(shape.value as any)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentShape === shape.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400'
              }`}
            >
              <div>{shape.label}</div>
              <div className="text-[10px] opacity-75 mt-1">{shape.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
        <label className="block text-sm font-medium text-gray-700">Adjust Size</label>
        
        {currentShape === 'sphere' && (
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Radius</span>
              <span className="font-medium">{dimensions.radius.toFixed(0)}m</span>
            </div>
            <input
              type="range"
              min="40"
              max="150"
              value={dimensions.radius}
              onChange={(e) => setDimensions({...dimensions, radius: Number(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>Small</span>
              <span>Medium (Default)</span>
              <span>Large</span>
            </div>
          </div>
        )}

        {(currentShape === 'cylinder' || currentShape === 'cone' || currentShape === 'torus') && (
          <>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{currentShape === 'torus' ? 'Major Radius' : 'Radius'}</span>
                <span className="font-medium">{dimensions.radius.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={dimensions.radius}
                onChange={(e) => setDimensions({...dimensions, radius: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Small</span>
                <span>Medium (Default)</span>
                <span>Large</span>
              </div>
            </div>
            {currentShape !== 'torus' && (
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Height</span>
                  <span className="font-medium">{dimensions.height.toFixed(0)}m</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="200"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Short</span>
                  <span>Medium (Default)</span>
                  <span>Tall</span>
                </div>
              </div>
            )}
          </>
        )}

        {currentShape === 'cuboid' && (
          <>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Width</span>
                <span className="font-medium">{dimensions.width.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={dimensions.width}
                onChange={(e) => setDimensions({...dimensions, width: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Narrow</span>
                <span>Medium (Default)</span>
                <span>Wide</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Height</span>
                <span className="font-medium">{dimensions.height.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="60"
                max="180"
                value={dimensions.height}
                onChange={(e) => setDimensions({...dimensions, height: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Short</span>
                <span>Medium (Default)</span>
                <span>Tall</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Depth</span>
                <span className="font-medium">{dimensions.depth.toFixed(0)}m</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={dimensions.depth}
                onChange={(e) => setDimensions({...dimensions, depth: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>Shallow</span>
                <span>Medium (Default)</span>
                <span>Deep</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
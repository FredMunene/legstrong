import { useRef, useEffect, useState } from 'react';
import { Component } from '../lib/supabase';
import { HabitatGeometry } from '../types';
import { Play, Pause, RotateCcw, Shapes, Palette, Ruler, Zap } from 'lucide-react';

type HabitatLayoutProps = {
  geometry: HabitatGeometry;
  components: Component[];
  isGenerating: boolean;
  onChange: (geometry: HabitatGeometry) => void;
};

export function HabitatLayout({ geometry, components, isGenerating, onChange }: HabitatLayoutProps) {
  const updateGeometry = (updates: Partial<HabitatGeometry>) => {
    onChange({
      ...geometry,
      ...updates,
      dimensions: {
        ...geometry.dimensions,
        ...(updates.dimensions || {}),
      },
    });
  };
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
      <div className="flex items-center gap-3 mb-6">
        <Shapes className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Habitat Design</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Shapes className="w-4 h-4" />
            Habitat Shape
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'sphere', label: 'Sphere', description: 'Spherical habitat' },
              { value: 'cylinder', label: 'Cylinder', description: 'Cylindrical habitat' },
              { value: 'cuboid', label: 'Cuboid', description: 'Rectangular habitat' }
            ].map((shape) => (
              <button
                key={shape.value}
                onClick={() => {
                  const newShape = shape.value as HabitatGeometry["shape"];
                  const defaultDimensions = {
                    sphere: { radius: 5 },
                    cylinder: { radius: 5, height: 10 },
                    cuboid: { width: 8, height: 10, depth: 8 },
                  };
                  updateGeometry({
                    shape: newShape,
                    dimensions: defaultDimensions[newShape],
                  });
                  setCurrentShape(newShape as any);
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  geometry.shape === shape.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-sm">{shape.label}</div>
                <div className="text-xs text-gray-500 mt-1">{shape.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Zap className="w-4 h-4" />
            Quick Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Small Lab', shape: 'cylinder' as const, dimensions: { radius: 3, height: 6 }, color: '#3b82f6' },
              { name: 'Research Station', shape: 'cuboid' as const, dimensions: { width: 12, height: 8, depth: 12 }, color: '#10b981' },
              { name: 'Spherical Base', shape: 'sphere' as const, dimensions: { radius: 8 }, color: '#f59e0b' },
              { name: 'Large Habitat', shape: 'cylinder' as const, dimensions: { radius: 8, height: 20 }, color: '#8b5cf6' }
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  onChange(preset);
                  setCurrentShape(preset.shape as any);
                }}
                className="p-2 text-xs rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="font-medium text-gray-900">{preset.name}</div>
                <div className="text-gray-500">
                  {preset.shape === 'sphere' && `${preset.dimensions.radius}m radius`}
                  {preset.shape === 'cylinder' && `${preset.dimensions.radius}m × ${preset.dimensions.height}m`}
                  {preset.shape === 'cuboid' && `${preset.dimensions.width}m × ${preset.dimensions.height}m × ${preset.dimensions.depth}m`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {geometry.shape === "sphere" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Ruler className="w-4 h-4" />
              Dimensions
            </label>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Radius</span>
                  <span className="text-sm font-medium text-gray-900">{geometry.dimensions.radius || 5}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={geometry.dimensions.radius || 5}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { radius: +e.target.value },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1m</span>
                  <span>50m</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {geometry.shape === "cylinder" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Ruler className="w-4 h-4" />
              Dimensions
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Radius</span>
                  <span className="text-sm font-medium text-gray-900">{geometry.dimensions.radius || 5}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={geometry.dimensions.radius || 5}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...geometry.dimensions, radius: +e.target.value },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1m</span>
                  <span>20m</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Height</span>
                  <span className="text-sm font-medium text-gray-900">{geometry.dimensions.height || 10}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={geometry.dimensions.height || 10}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...geometry.dimensions, height: +e.target.value },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1m</span>
                  <span>50m</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {geometry.shape === "cuboid" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Ruler className="w-4 h-4" />
              Dimensions
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Width</span>
                  <span className="text-sm font-medium text-gray-900">{geometry.dimensions.width || 8}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={geometry.dimensions.width || 8}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...geometry.dimensions, width: +e.target.value },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1m</span>
                  <span>50m</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Depth</span>
                  <span className="text-sm font-medium text-gray-900">{geometry.dimensions.depth || 8}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={geometry.dimensions.depth || 8}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...geometry.dimensions, depth: +e.target.value },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1m</span>
                  <span>50m</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Height</span>
                  <span className="text-sm font-medium text-gray-900">{geometry.dimensions.height || 10}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={geometry.dimensions.height || 10}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...geometry.dimensions, height: +e.target.value },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1m</span>
                  <span>50m</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Palette className="w-4 h-4" />
            Habitat Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={geometry.color}
              onChange={(e) => {
                updateGeometry({ color: e.target.value });
              }}
              className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">Color Preview</div>
              <div className="text-xs text-gray-500">{geometry.color}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-900">Habitat Volume</div>
                <div className="text-2xl font-bold text-blue-700">
                  {calculateVolume(geometry.shape, geometry.dimensions).toFixed(1)} m³
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600">Capacity</div>
                <div className="text-sm font-medium text-blue-800">
                  ~{Math.floor(calculateVolume(geometry.shape, geometry.dimensions) / 50)} people
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">3D Preview</h4>
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
              height={400}
              className="w-full"
            />
            
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 px-3 py-2 rounded text-white text-xs font-mono">
              {currentShape.toUpperCase()} HABITAT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateVolume(
  shape: HabitatGeometry["shape"],
  dimensions: HabitatGeometry["dimensions"]
): number {
  switch (shape) {
    case "sphere":
      return (4 / 3) * Math.PI * Math.pow(dimensions.radius || 5, 3);
    case "cylinder":
      return Math.PI * Math.pow(dimensions.radius || 5, 2) * (dimensions.height || 10);
    case "cuboid":
      return (
        (dimensions.width || 8) *
        (dimensions.height || 10) *
        (dimensions.depth || 8)
      );
  }
}
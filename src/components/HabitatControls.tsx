import { HabitatGeometry } from "../types";
import { Shapes, Palette, Ruler, Zap } from "lucide-react";

type HabitatControlsProps = {
  value: HabitatGeometry;
  onChange: (geometry: HabitatGeometry) => void;
};

export function HabitatControls({ value, onChange }: HabitatControlsProps) {
  const updateGeometry = (updates: Partial<HabitatGeometry>) => {
    onChange({
      ...value,
      ...updates,
      dimensions: {
        ...value.dimensions,
        ...(updates.dimensions || {}),
      },
    });
  };

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
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  value.shape === shape.value
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
                onClick={() => onChange(preset)}
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

        {value.shape === "sphere" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Ruler className="w-4 h-4" />
              Dimensions
            </label>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Radius</span>
                  <span className="text-sm font-medium text-gray-900">{value.dimensions.radius || 5}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={value.dimensions.radius || 5}
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

        {value.shape === "cylinder" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Ruler className="w-4 h-4" />
              Dimensions
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Radius</span>
                  <span className="text-sm font-medium text-gray-900">{value.dimensions.radius || 5}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={value.dimensions.radius || 5}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...value.dimensions, radius: +e.target.value },
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
                  <span className="text-sm font-medium text-gray-900">{value.dimensions.height || 10}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={value.dimensions.height || 10}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...value.dimensions, height: +e.target.value },
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

        {value.shape === "cuboid" && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Ruler className="w-4 h-4" />
              Dimensions
            </label>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Width</span>
                  <span className="text-sm font-medium text-gray-900">{value.dimensions.width || 8}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={value.dimensions.width || 8}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...value.dimensions, width: +e.target.value },
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
                  <span className="text-sm font-medium text-gray-900">{value.dimensions.depth || 8}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={value.dimensions.depth || 8}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...value.dimensions, depth: +e.target.value },
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
                  <span className="text-sm font-medium text-gray-900">{value.dimensions.height || 10}m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={value.dimensions.height || 10}
                  onChange={(e) => {
                    updateGeometry({
                      dimensions: { ...value.dimensions, height: +e.target.value },
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
              value={value.color}
              onChange={(e) => {
                updateGeometry({ color: e.target.value });
              }}
              className="w-16 h-12 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">Color Preview</div>
              <div className="text-xs text-gray-500">{value.color}</div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-900">Habitat Volume</div>
                <div className="text-2xl font-bold text-blue-700">
                  {calculateVolume(value.shape, value.dimensions).toFixed(1)} m³
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600">Capacity</div>
                <div className="text-sm font-medium text-blue-800">
                  ~{Math.floor(calculateVolume(value.shape, value.dimensions) / 15)} people
                </div>
              </div>
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

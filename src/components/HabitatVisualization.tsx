import { HabitatGeometry } from "../types";
import { Rocket, Circle, Square, Box } from "lucide-react";

type HabitatVisualizationProps = {
  geometry: HabitatGeometry;
};

export function HabitatVisualization({ geometry }: HabitatVisualizationProps) {
  const getShapeIcon = () => {
    switch (geometry.shape) {
      case 'sphere':
        return <Circle className="w-16 h-16" style={{ color: geometry.color }} />;
      case 'cylinder':
        return <Box className="w-16 h-16" style={{ color: geometry.color }} />;
      case 'cuboid':
        return <Square className="w-16 h-16" style={{ color: geometry.color }} />;
      default:
        return <Rocket className="w-16 h-16" style={{ color: geometry.color }} />;
    }
  };

  const getShapeDescription = () => {
    switch (geometry.shape) {
      case 'sphere':
        return `Spherical habitat with ${geometry.dimensions.radius}m radius`;
      case 'cylinder':
        return `Cylindrical habitat: ${geometry.dimensions.radius}m radius × ${geometry.dimensions.height}m height`;
      case 'cuboid':
        return `Rectangular habitat: ${geometry.dimensions.width}m × ${geometry.dimensions.height}m × ${geometry.dimensions.depth}m`;
      default:
        return 'Habitat design';
    }
  };

  const calculateVolume = (shape: HabitatGeometry["shape"], dimensions: HabitatGeometry["dimensions"]): number => {
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
  };

  const volume = calculateVolume(geometry.shape, geometry.dimensions);
  const capacity = Math.floor(volume / 15);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Habitat Preview</h3>
      
      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
        <div className="text-center">
          {getShapeIcon()}
          <p className="text-gray-600 text-sm mt-2 font-medium">
            {geometry.shape.charAt(0).toUpperCase() + geometry.shape.slice(1)} Habitat
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          {getShapeDescription()}
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {volume.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Volume (m³)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {capacity}
            </div>
            <div className="text-xs text-gray-500">Capacity</div>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Color:</span>
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: geometry.color }}
              />
              <span className="font-mono text-xs">{geometry.color}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

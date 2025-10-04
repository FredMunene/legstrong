import { useState } from 'react';
import { Users, Package, Wrench, Zap, Heart, Wifi, Utensils, Microscope, MapPin, RotateCcw } from 'lucide-react';

type Object3D = {
  id: string;
  type: 'human' | 'equipment' | 'furniture';
  name: string;
  icon: any;
  x: number;
  y: number;
  size: number;
  color: string;
  description: string;
};

type Habitat3DViewProps = {
  habitatGeometry: {
    shape: string;
    dimensions: any;
  };
  crewSize: number;
  areas: any[];
};

const OBJECT_LIBRARY: Omit<Object3D, 'id' | 'x' | 'y'>[] = [
  // Humans
  { type: 'human', name: 'Astronaut', icon: Users, size: 1, color: '#3b82f6', description: 'Crew member' },
  
  // Equipment
  { type: 'equipment', name: 'Life Support', icon: Heart, size: 1.5, color: '#ef4444', description: 'ECLSS system' },
  { type: 'equipment', name: 'Power Unit', icon: Zap, size: 1.2, color: '#f59e0b', description: 'Power generation' },
  { type: 'equipment', name: 'Comm Array', icon: Wifi, size: 1, color: '#8b5cf6', description: 'Communication' },
  { type: 'equipment', name: 'Lab Equipment', icon: Microscope, size: 1.3, color: '#10b981', description: 'Research tools' },
  
  // Furniture
  { type: 'furniture', name: 'Sleep Pod', icon: MapPin, size: 1.2, color: '#6b7280', description: 'Sleep quarters' },
  { type: 'furniture', name: 'Galley', icon: Utensils, size: 1.4, color: '#f97316', description: 'Food prep area' },
  { type: 'furniture', name: 'Storage', icon: Package, size: 1.1, color: '#84cc16', description: 'Equipment storage' },
  { type: 'furniture', name: 'Workbench', icon: Wrench, size: 1.3, color: '#64748b', description: 'Maintenance station' },
];

export function Habitat3DView({ habitatGeometry, crewSize, areas }: Habitat3DViewProps) {
  const [objects, setObjects] = useState<Object3D[]>([]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placingObject, setPlacingObject] = useState<Omit<Object3D, 'id' | 'x' | 'y'> | null>(null);

  const addObject = (objectType: Omit<Object3D, 'id' | 'x' | 'y'>) => {
    const newObject: Object3D = {
      ...objectType,
      id: `${objectType.name}-${Date.now()}`,
      x: 50,
      y: 50,
    };
    setObjects([...objects, newObject]);
    setIsPlacing(true);
    setPlacingObject(objectType);
  };

  const removeObject = (objectId: string) => {
    setObjects(objects.filter(obj => obj.id !== objectId));
  };

  const updateObjectPosition = (objectId: string, x: number, y: number) => {
    setObjects(objects.map(obj => 
      obj.id === objectId ? { ...obj, x, y } : obj
    ));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isPlacing || !placingObject) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newObject: Object3D = {
      ...placingObject,
      id: `${placingObject.name}-${Date.now()}`,
      x,
      y,
    };
    
    setObjects([...objects, newObject]);
    setIsPlacing(false);
    setPlacingObject(null);
  };

  const getShapeDescription = () => {
    switch (habitatGeometry.shape) {
      case 'sphere':
        return `Spherical habitat (R: ${habitatGeometry.dimensions.radius}m)`;
      case 'cylinder':
        return `Cylindrical habitat (R: ${habitatGeometry.dimensions.radius}m × H: ${habitatGeometry.dimensions.height}m)`;
      case 'cuboid':
        return `Rectangular habitat (${habitatGeometry.dimensions.width}m × ${habitatGeometry.dimensions.height}m × ${habitatGeometry.dimensions.depth}m)`;
      default:
        return 'Habitat';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">3D Habitat View</h3>
        <div className="text-sm text-gray-600">
          {objects.length} objects • {getShapeDescription()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Object Library */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">3D Objects</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {OBJECT_LIBRARY.map((obj, index) => (
              <button
                key={index}
                onClick={() => addObject(obj)}
                className="w-full p-2 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <obj.icon className="w-4 h-4" style={{ color: obj.color }} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{obj.name}</div>
                    <div className="text-xs text-gray-500">{obj.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Add Crew */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                for (let i = 0; i < crewSize; i++) {
                  addObject(OBJECT_LIBRARY[0]); // Add astronaut
                }
              }}
              className="w-full p-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add {crewSize} Astronauts
            </button>
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="lg:col-span-3">
          <div 
            className="aspect-square bg-gradient-to-br from-indigo-50 to-purple-100 rounded-lg border-2 border-gray-200 relative overflow-hidden cursor-crosshair"
            onClick={handleCanvasClick}
          >
            {/* Habitat Shape Indicator */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-xs font-medium text-gray-700">
              {habitatGeometry.shape.toUpperCase()}
            </div>

            {/* Objects */}
            {objects.map((obj) => (
              <div
                key={obj.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group ${
                  selectedObject === obj.id ? 'z-10' : 'z-0'
                }`}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedObject(obj.id);
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    backgroundColor: obj.color,
                    transform: `scale(${obj.size})`
                  }}
                >
                  <obj.icon className="w-4 h-4" />
                </div>
                
                {/* Object Label */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {obj.name}
                </div>

                {/* Delete Button */}
                {selectedObject === obj.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeObject(obj.id);
                      setSelectedObject(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            {/* Placing Indicator */}
            {isPlacing && placingObject && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <placingObject.icon className="w-6 h-6" style={{ color: placingObject.color }} />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">Click to place {placingObject.name}</p>
                  <button
                    onClick={() => {
                      setIsPlacing(false);
                      setPlacingObject(null);
                    }}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {objects.length === 0 && !isPlacing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Add objects to visualize your habitat</p>
                </div>
              </div>
            )}
          </div>

          {/* Object Controls */}
          {selectedObject && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Object Controls</h5>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const obj = objects.find(o => o.id === selectedObject);
                    if (obj) {
                      updateObjectPosition(obj.id, Math.random() * 80 + 10, Math.random() * 80 + 10);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                >
                  <RotateCcw className="w-4 h-4" />
                  Randomize Position
                </button>
                <button
                  onClick={() => {
                    removeObject(selectedObject);
                    setSelectedObject(null);
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  Delete Object
                </button>
              </div>
            </div>
          )}

          {/* Scene Info */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-700">
                {objects.filter(obj => obj.type === 'human').length}
              </div>
              <div className="text-xs text-blue-600">Crew</div>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-700">
                {objects.filter(obj => obj.type === 'equipment').length}
              </div>
              <div className="text-xs text-green-600">Equipment</div>
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-700">
                {objects.filter(obj => obj.type === 'furniture').length}
              </div>
              <div className="text-xs text-purple-600">Furniture</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

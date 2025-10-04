import { useState } from 'react';
import { FunctionalArea, FUNCTIONAL_AREAS, validateLayout } from '../types/functionalAreas';
import { Plus, Trash2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

type AreaPlacement = {
  id: string;
  areaId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  volume: number;
};

type FunctionalAreaDesignerProps = {
  habitatGeometry: {
    shape: string;
    dimensions: any;
  };
  crewSize: number;
  onAreasChange: (areas: AreaPlacement[]) => void;
};

export function FunctionalAreaDesigner({ habitatGeometry, crewSize, onAreasChange }: FunctionalAreaDesignerProps) {
  const [areas, setAreas] = useState<AreaPlacement[]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [placingAreaType, setPlacingAreaType] = useState<string | null>(null);

  const addArea = (areaType: string) => {
    const functionalArea = FUNCTIONAL_AREAS.find(fa => fa.id === areaType);
    if (!functionalArea) return;

    const newArea: AreaPlacement = {
      id: `${areaType}-${Date.now()}`,
      areaId: areaType,
      x: 50,
      y: 50,
      width: 20,
      height: 20,
      area: 20 * 20,
      volume: 20 * 20 * 3, // Assuming 3m height
    };

    setAreas([...areas, newArea]);
    onAreasChange([...areas, newArea]);
    setIsPlacing(true);
    setPlacingAreaType(areaType);
  };

  const removeArea = (areaId: string) => {
    const newAreas = areas.filter(area => area.id !== areaId);
    setAreas(newAreas);
    onAreasChange(newAreas);
  };

  const updateArea = (areaId: string, updates: Partial<AreaPlacement>) => {
    const newAreas = areas.map(area => 
      area.id === areaId 
        ? { ...area, ...updates, area: (updates.width || area.width) * (updates.height || area.height) }
        : area
    );
    setAreas(newAreas);
    onAreasChange(newAreas);
  };

  const constraints = validateLayout(areas, crewSize);

  const getAreaColor = (areaId: string) => {
    const functionalArea = FUNCTIONAL_AREAS.find(fa => fa.id === areaId);
    if (!functionalArea) return '#6b7280';

    switch (functionalArea.priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getAreaIcon = (areaId: string) => {
    const functionalArea = FUNCTIONAL_AREAS.find(fa => fa.id === areaId);
    return functionalArea?.icon || '📦';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Functional Area Designer</h3>
        <div className="text-sm text-gray-600">
          Crew Size: {crewSize} | Areas: {areas.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Library */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Available Areas</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {FUNCTIONAL_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => addArea(area.id)}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{area.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{area.name}</div>
                    <div className="text-xs text-gray-500">{area.description}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        area.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        area.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        area.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {area.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {area.minAreaPerPerson}m²/person
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Habitat Layout Canvas */}
        <div className="lg:col-span-2">
          <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 border-gray-200 relative overflow-hidden">
            {areas.map((area) => {
              const functionalArea = FUNCTIONAL_AREAS.find(fa => fa.id === area.areaId);
              return (
                <div
                  key={area.id}
                  className={`absolute border-2 rounded-lg cursor-move hover:shadow-lg transition-all ${
                    selectedArea === area.id ? 'border-blue-500 shadow-lg' : 'border-gray-300'
                  }`}
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                    backgroundColor: getAreaColor(area.areaId),
                    opacity: 0.8,
                  }}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <div className="p-2 h-full flex flex-col justify-center items-center text-white">
                    <span className="text-lg">{getAreaIcon(area.areaId)}</span>
                    <div className="text-xs font-medium text-center">
                      {functionalArea?.name.split(' ')[0]}
                    </div>
                    <div className="text-xs opacity-75">
                      {area.area.toFixed(0)}m²
                    </div>
                  </div>
                  
                  {selectedArea === area.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeArea(area.id);
                        setSelectedArea(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}

            {isPlacing && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg text-center">
                  <p className="text-sm text-gray-700 mb-2">Click to place the area</p>
                  <button
                    onClick={() => {
                      setIsPlacing(false);
                      setPlacingAreaType(null);
                    }}
                    className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Area Controls */}
          {selectedArea && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Area Controls</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Width (%)</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={areas.find(a => a.id === selectedArea)?.width || 20}
                    onChange={(e) => updateArea(selectedArea, { width: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Height (%)</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={areas.find(a => a.id === selectedArea)?.height || 20}
                    onChange={(e) => updateArea(selectedArea, { height: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Results */}
      {constraints.length > 0 && (
        <div className="mt-6 space-y-2">
          <h4 className="font-medium text-gray-900">Layout Validation</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {constraints.map((constraint, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded text-sm ${
                  constraint.severity === 'error' ? 'bg-red-50 text-red-700' :
                  constraint.severity === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                {constraint.severity === 'error' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : constraint.severity === 'warning' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
                {constraint.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {constraints.length === 0 && areas.length > 0 && (
        <div className="mt-6 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Layout validation passed!</span>
        </div>
      )}
    </div>
  );
}

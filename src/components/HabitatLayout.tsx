import { Component } from '../lib/supabase';
import { HabitatGeometry } from '../types';
import { MapPin, Users, Zap, Wrench, Heart, Wifi, Utensils, Microscope } from 'lucide-react';

type HabitatLayoutProps = {
  geometry: HabitatGeometry;
  components: Component[];
  isGenerating: boolean;
};

const componentIcons: Record<string, any> = {
  sleep: Users,
  lifesupport: Heart,
  power: Zap,
  storage: Wrench,
  medical: Heart,
  communication: Wifi,
  galley: Utensils,
  research: Microscope,
};

const getComponentPosition = (index: number, total: number, shape: HabitatGeometry["shape"]) => {
  const angle = (index / total) * 2 * Math.PI;
  const radius = 0.7; // Position components in a circle within the habitat
  
  if (shape === 'sphere' || shape === 'cylinder') {
    return {
      x: 50 + radius * 40 * Math.cos(angle),
      y: 50 + radius * 40 * Math.sin(angle),
    };
  } else {
    // For cuboid, arrange in a grid
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: 20 + (col / (cols - 1)) * 60,
      y: 20 + (row / (Math.ceil(total / cols) - 1)) * 60,
    };
  }
};

export function HabitatLayout({ geometry, components, isGenerating }: HabitatLayoutProps) {
  if (components.length === 0 && !isGenerating) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Habitat Layout</h3>
        <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Generate a habitat to see component layout</p>
          </div>
        </div>
      </div>
    );
  }

  const uniqueComponents = components.reduce((acc, comp) => {
    const key = `${comp.name}-${comp.type}`;
    if (!acc[key]) {
      acc[key] = { component: comp, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { component: Component; count: number }>);

  const componentList = Object.values(uniqueComponents);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Habitat Layout</h3>
      
      <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg relative border-2 border-gray-200 mb-4 overflow-hidden">
        {componentList.map(({ component, count }, index) => {
          const Icon = componentIcons[component.type] || Wrench;
          const position = getComponentPosition(index, componentList.length, geometry.shape);
          
          return (
            <div
              key={component.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            >
              <div className="bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-colors cursor-pointer">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              {count > 1 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </div>
              )}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {component.name}
              </div>
            </div>
          );
        })}
        
        {isGenerating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Arranging components...</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Component Summary</h4>
        <div className="grid grid-cols-2 gap-2">
          {componentList.map(({ component, count }) => {
            const Icon = componentIcons[component.type] || Wrench;
            return (
              <div key={component.id} className="flex items-center gap-2 text-xs">
                <Icon className="w-3 h-3 text-gray-500" />
                <span className="text-gray-600">{component.name}</span>
                {count > 1 && (
                  <span className="bg-gray-200 text-gray-600 px-1 rounded text-xs">
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

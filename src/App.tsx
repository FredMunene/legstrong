import { Rocket } from 'lucide-react';
import { MissionForm } from './components/MissionForm';
import { AssemblyView } from './components/AssemblyView';
import { ValidationPanel } from './components/ValidationPanel';
import { HabitatControls } from './components/HabitatControls';
import { HabitatVisualization } from './components/HabitatVisualization';
import { HabitatLayout } from './components/HabitatLayout';
import { FunctionalAreaDesigner } from './components/FunctionalAreaDesigner';
import { QuantitativeAnalysis } from './components/QuantitativeAnalysis';
import { Habitat3DView } from './components/Habitat3DView';
import { useHabitatGeneration } from './hooks/useHabitatGeneration';
import { useState } from 'react';
import { HabitatGeometry } from './types';

function App() {
  const { isGenerating, components, validation, error, generateHabitat } = useHabitatGeneration();
  const [habitatGeometry, setHabitatGeometry] = useState<HabitatGeometry>({
    shape: 'cylinder',
    dimensions: { radius: 5, height: 10 },
    color: '#3b82f6'
  });
  const [missionData, setMissionData] = useState<any>(null);
  const [functionalAreas, setFunctionalAreas] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Rocket className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Habitat Design System</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Interactive space habitat designer for students and professionals. Design your habitat shape and dimensions, 
            then let AI generate the complete component breakdown with validation and 3D assets. Perfect for learning 
            space architecture and mission planning.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Rocket className="w-4 h-4" />
              Educational Tool
            </span>
            <span>•</span>
            <span>Interactive Design</span>
            <span>•</span>
            <span>AI-Powered</span>
            <span>•</span>
            <span>Real-time Validation</span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MissionForm 
                onSubmit={(data) => {
                  setMissionData(data);
                  generateHabitat(data);
                }} 
                isLoading={isGenerating} 
              />
              <HabitatControls 
                value={habitatGeometry} 
                onChange={setHabitatGeometry} 
              />
            </div>
            <div className="space-y-6">
              <HabitatVisualization geometry={habitatGeometry} />
            </div>
          </div>

          {missionData && (
            <div className="w-full max-w-6xl space-y-6">
              <FunctionalAreaDesigner
                habitatGeometry={habitatGeometry}
                crewSize={missionData.crew_size}
                onAreasChange={setFunctionalAreas}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Habitat3DView
                  habitatGeometry={habitatGeometry}
                  crewSize={missionData.crew_size}
                  areas={functionalAreas}
                />
                
                {functionalAreas.length > 0 && (
                  <QuantitativeAnalysis
                    areas={functionalAreas}
                    crewSize={missionData.crew_size}
                    habitatVolume={(() => {
                      const { shape, dimensions } = habitatGeometry;
                      switch (shape) {
                        case 'sphere':
                          return (4 / 3) * Math.PI * Math.pow(dimensions.radius || 5, 3);
                        case 'cylinder':
                          return Math.PI * Math.pow(dimensions.radius || 5, 2) * (dimensions.height || 10);
                        case 'cuboid':
                          return (dimensions.width || 8) * (dimensions.height || 10) * (dimensions.depth || 8);
                        default:
                          return 0;
                      }
                    })()}
                    habitatArea={(() => {
                      const { shape, dimensions } = habitatGeometry;
                      switch (shape) {
                        case 'sphere':
                          return 4 * Math.PI * Math.pow(dimensions.radius || 5, 2);
                        case 'cylinder':
                          return 2 * Math.PI * Math.pow(dimensions.radius || 5, 2) + 2 * Math.PI * (dimensions.radius || 5) * (dimensions.height || 10);
                        case 'cuboid':
                          return 2 * ((dimensions.width || 8) * (dimensions.height || 10) + (dimensions.width || 8) * (dimensions.depth || 8) + (dimensions.height || 10) * (dimensions.depth || 8));
                        default:
                          return 0;
                      }
                    })()}
                  />
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="w-full max-w-6xl bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          )}

          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AssemblyView components={components} isGenerating={isGenerating} />
            <HabitatLayout 
              geometry={habitatGeometry} 
              components={components} 
              isGenerating={isGenerating} 
            />
          </div>

          <ValidationPanel validation={validation} />
        </div>
      </div>
    </div>
  );
}

export default App;

import { Rocket } from 'lucide-react';
import { MissionForm } from './components/MissionForm';
import { AssemblyView } from './components/AssemblyView';
import { ValidationPanel } from './components/ValidationPanel';
import { useHabitatGeneration } from './hooks/useHabitatGeneration';

function App() {
  const { isGenerating, components, validation, error, generateHabitat } = useHabitatGeneration();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Rocket className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Habitat Design System</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            AI-powered space habitat designer. Enter mission parameters and watch as advanced AI
            conceptualizes a complete habitat with component breakdown, validation, and 3D assets.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <MissionForm onSubmit={generateHabitat} isLoading={isGenerating} />

          {error && (
            <div className="w-full max-w-6xl bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">Error: {error}</p>
            </div>
          )}

          <AssemblyView components={components} isGenerating={isGenerating} />

          <ValidationPanel validation={validation} />
        </div>
      </div>
    </div>
  );
}

export default App;
